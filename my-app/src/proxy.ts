// src/proxy.ts
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { TokenUserInfosPayload } from "./GlobalTypes";

const SECRET_KEY = new TextEncoder().encode(
  process.env.ROLE_SECRET_KEY!
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  const AllowedRole = userRole !== "guest";

  if (pathname.startsWith("/u") && userRole === "guest") {
    return NextResponse.redirect(
      new URL("/auth/set-role", request.url)
    );
  }

  if (pathname.startsWith("/u/")) {
    // /u/admin/tasks/task => ["", "u", "admin", "tasks", "task"]
    const segments = pathname.split("/"); 
    const roleInPath = segments[2]; // "admin" in this example

    // reconstruct the path after the role
    const restOfPath = segments.slice(3).join("/"); // "tasks/task"

    if (roleInPath && roleInPath !== userRole) {
      // redirect to the same path but with the correct role
      const redirectPath = `/u/${userRole}${restOfPath ? "/" + restOfPath : ""}`;
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  if (token && (pathname.startsWith("/auth") || pathname === "/u")) {
    return NextResponse.redirect(new URL(`/u/${AllowedRole}`, request.url));
  }

  if (
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/auth/auth-code-error")
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/u/:path*", "/auth/:path*"],
};
