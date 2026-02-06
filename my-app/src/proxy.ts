// src/proxy.ts
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { TokenUserInfosPayload } from "./GlobalTypes";

const SECRET_KEY = new TextEncoder().encode(
  process.env.ROLE_SECRET_KEY!
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Allow auth-related pages
  if (
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/auth/auth-code-error")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("user-context")?.value;

  // ❌ No token → login
  if (!token) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  let payload;

  try {
    const result = await jwtVerify(token, SECRET_KEY);
    payload = result.payload as TokenUserInfosPayload | undefined;
  } catch {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  const userRole = payload?.role as "admin" | "employee" | "guest";

  // 🧭 guest لازم يحدد الدور
  if (pathname.startsWith("/u") && userRole === "guest") {
    return NextResponse.redirect(
      new URL("/auth/set-role", request.url)
    );
  }

  // 🧭 حماية المسارات حسب الدور
  if (pathname.startsWith("/u/")) {
    const roleInPath = pathname.split("/")[2]; // /u/admin/...

    if (roleInPath && roleInPath !== userRole) {
      return NextResponse.redirect(
        new URL(`/u/${userRole}`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/u/:path*", "/auth/set-role"],
};
