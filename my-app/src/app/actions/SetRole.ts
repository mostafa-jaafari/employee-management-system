"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const ROLE_SECRET = process.env.ROLE_SECRET_KEY || "your_32_character_secret_key_here";
const SECRET_KEY = new TextEncoder().encode(ROLE_SECRET);

export async function SetRoleAction(selectedRole: "admin" | "employee") {
  const supabase = await createSupabaseServerClient();
  const cookieStore = await cookies();

  // 1. Get the current user session
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: "User session not found. Please log in again." };
  }

  // 2. Update the user role in your Supabase 'users' table
  const { error: dbError } = await supabase
    .from("users")
    .update({ role: selectedRole })
    .eq("id", user.id);

  if (dbError) {
    return { success: false, message: dbError.message };
  }

  const existingToken = cookieStore.get("user-context")?.value as string;

  if(!existingToken){
    return { success: false, message: "Please login first !" }
  }
  try {
    const { payload } = await jwtVerify(existingToken, SECRET_KEY);

    const newPayload = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      avatar_url: payload.avatar_url,
      role: selectedRole,
    };

    const roleToken = await new SignJWT(newPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(SECRET_KEY);

    // 4. Set the cookie (Matches the name used in Middleware)
    cookieStore.set("user-context", roleToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, role: selectedRole };
  } catch (err) {
    console.error("JWT Signing Error:", err);
    return { success: false, message: "Failed to generate security token." };
  }
}