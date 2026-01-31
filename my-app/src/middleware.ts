// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserRole } from './utils/getUserRole';

export async function middleware(request: NextRequest) {
  const UserRole = (await getUserRole()).UserRole as "admin" | "employee" | "guest";

  const pathname = request.nextUrl.pathname;

  if(UserRole === "guest" && pathname.startsWith('/u')) {
    return NextResponse.redirect(new URL('/auth/set-role', request.url));
  }

  if(!UserRole && pathname === "/auth/set-role") {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const pathSegments = pathname.split('/'); // ['', 'u', 'admin', 'profile', ...]
  const pathRole = pathSegments[2]; // 'admin' or 'employee'

  // If the URL role segment doesn't match the user role, redirect
  if ((UserRole === 'admin' || UserRole === 'employee') && pathRole !== UserRole) {
    const restPath = pathSegments.slice(3).join('/'); // all segments after the role
    return NextResponse.redirect(new URL(`/u/${UserRole}/${restPath}`, request.url));
  }

  // 4️⃣ إعادة التوجيه حسب الدور
  if (pathname.startsWith('/u/admin') && UserRole === 'employee') {
    return NextResponse.redirect(new URL('/u/employee', request.url));
  }

  if (pathname.startsWith('/u/employee') && UserRole === 'admin') {
    return NextResponse.redirect(new URL('/u/admin', request.url));
  }

  if (pathname.startsWith('/auth/set-role') && (UserRole === 'admin' || UserRole === 'employee')) {
    return NextResponse.redirect(new URL('/u/admin', request.url));
  }

  if (!UserRole && pathname.startsWith('/u')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/u/:path*", "/auth/:path*"],
};
