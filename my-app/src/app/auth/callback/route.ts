import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // 1. حساب الـ Origin (نفس منطقك السابق)
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
    
    // 2. تبديل الكود بجلسة (Session)
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // --- الخطوة الإضافية الهامة: جلب الدور وتعيين الكوكي ---
      
      const { data: roleData } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      const userRole = roleData?.role || "guest";

      // 3. تعيين كوكي الدور (نفس إعدادات LoginAction)
      cookieStore.set("user-role", userRole, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // أسبوع
      });

      // 4. التوجيه بناءً على الدور
      // إذا كان المستخدم جديداً (guest)، نوجهه لصفحة اختيار الدور
      const targetPath = userRole === "guest" ? "/auth/set-role" : `/u/${userRole}`;
      
      return NextResponse.redirect(`${origin}${targetPath}`)
    }
  }

  // في حال حدوث خطأ
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}