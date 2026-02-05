import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";


const SECRET_KEY = new TextEncoder().encode(process.env.ROLE_SECRET_KEY);
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ✅ استثناء صفحات auth
  if (
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/auth/auth-code-error")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("user-context")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  let payload;
  try {
    ({ payload } = await jwtVerify(token, SECRET_KEY));
  } catch {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  const userRole = payload.role as "admin" | "employee" | "guest";
  const pathSegments = pathname.split("/");
  const pathRole = pathSegments[2];

  if (pathname.startsWith("/u") && userRole === "guest") {
    return NextResponse.redirect(
      new URL("/auth/set-role", request.url)
    );
  }

  if (
    (userRole === "admin" || userRole === "employee") &&
    pathRole !== userRole
  ) {
    return NextResponse.redirect(
      new URL(`/u/${userRole}`, request.url)
    );
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/u/:path*", "/auth/set-role"],
};
