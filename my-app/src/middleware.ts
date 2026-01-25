// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getUserRole } from './utils/getUserRole'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options) // Important: Set on response
          })
        },
      },
    }
  )

  // This refreshes the session if expired
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname;

  const UserRole = await getUserRole();

  // const UserRole = profile?.role as "employee" | "admin";

  if(UserRole.UserRole && UserRole.UserRole.role === "employee" && pathname.includes("/departments")){
    return NextResponse.redirect(new URL('/adm/dashboard', request.url))
  }
  // Protected routes logic
  if (!user && pathname.startsWith('/adm')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Auth routes logic
  if (user && pathname.startsWith('/auth/login')) {
    return NextResponse.redirect(new URL('/adm/admin', request.url));
  }

  return response
}

export const config = {
  matcher: ["/adm/:path*", "/auth/:path*"],
}