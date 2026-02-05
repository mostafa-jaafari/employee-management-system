"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignJWT } from "jose";
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

  try {
    // 3. Create the Signed JWT Token
    const roleToken = await new SignJWT({ role: selectedRole })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(SECRET_KEY);

    // 4. Set the cookie (Matches the name used in Middleware)
    cookieStore.set("user-role-token", roleToken, {
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