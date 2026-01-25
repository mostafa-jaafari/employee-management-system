import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  // 1. Parse the URL
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/adm/admin'
  
  // 2. Calculate the correct origin (Fix for Codespaces/Proxies)
  // Check if we have an x-forwarded-host header (standard in proxies like Codespaces)
  const forwardedHost = request.headers.get('x-forwarded-host')
  let origin = requestUrl.origin

  if (forwardedHost) {
    // If behind a proxy, use the protocol and host reported by the proxy
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    origin = `${protocol}://${forwardedHost}`
  } else {
    // Fallback manual fix: If we are on a Codespaces domain, usually we must strip :3000 from the origin string
    if (origin.includes('app.github.dev') && origin.includes(':3000')) {
        origin = origin.replace(':3000', '')
    }
  }

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 3. Redirect using the cleaned origin
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}