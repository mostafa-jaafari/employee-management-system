import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose';

// تأكد من وجود القيمة الافتراضية لمنع توقف التشفير
const ROLE_SECRET = process.env.ROLE_SECRET_KEY || "fallback_secret_at_least_32_characters_long";
const SECRET_KEY = new TextEncoder().encode(ROLE_SECRET);

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  const forwardedHost = request.headers.get('x-forwarded-host')
  let origin = requestUrl.origin

  if (forwardedHost) {
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    origin = `${protocol}://${forwardedHost}`
  } else if (origin.includes('app.github.dev') && origin.includes(':3000')) {
    origin = origin.replace(':3000', '')
  }

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && user) {
      const { data: userData } = await supabase
        .from("users")
        .select("id, email, name, role, avatar_url")
        .eq("id", user?.id)
        .single();

      const payload = {
        id: user?.id,
        role: userData?.role,
        name: userData?.name,
        avatar_url: userData?.avatar_url,
      };
      if(error) throw error;

      // إنشاء التوكن
      try {
          const userToken = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(SECRET_KEY);

          // توحيد اسم الكوكي مع الـ LoginAction
          cookieStore.set("user-context", userToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
          });

          const targetPath = user.role === "guest" ? "/auth/set-role" : `/u/${user.role}`;
          return NextResponse.redirect(`${origin}${targetPath}`)
      } catch (jwtError) {
          console.error("JWT Signing Error:", jwtError);
          return NextResponse.redirect(`${origin}/auth/auth-code-error`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}