// src/proxy.ts
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { TokenUserInfosPayload } from "./GlobalTypes";

const SECRET_KEY = new TextEncoder().encode(process.env.ROLE_SECRET_KEY!);

const PUBLIC_ROUTES = ["/auth/login", "/auth/set-role", "/auth/callback", "/auth/auth-code-error"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("user-context")?.value;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  let payload: TokenUserInfosPayload | undefined;

  // التحقق من صلاحية التوكن
  if (token) {
    try {
      const result = await jwtVerify(token, SECRET_KEY);
      payload = result.payload as TokenUserInfosPayload;
    } catch (err) {
      console.log(err)
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  const userRole = payload?.role ?? "guest"; // إذا لا payload → guest

  if(pathname.startsWith("/auth/set-role") && !token){
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
  // إذا الدور guest وحاول الوصول لمسار محمي → توجيه set-role
  if (userRole === "guest" && pathname.startsWith("/u") && !pathname.startsWith("/auth/set-role")) {
    return NextResponse.redirect(new URL("/auth/set-role", request.url));
  }

  // إذا المستخدم مسجل الدخول وليس guest وحاول الدخول لمسار auth (login/set-role) → إعادة التوجيه لمسار خاص بالدور
  if (pathname.startsWith("/auth") && userRole !== "guest") {
    // /auth/... → تحويله إلى /u/:role
    const redirectPath = `/u/${userRole}`;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/u/:path*", "/auth/:path*"],
};
