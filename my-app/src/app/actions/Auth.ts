"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createSupabaseServerClient();
  const cookieStore = await cookies();

  // 1. Sign in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { success: false, message: error.message };

  // 2. Fetch Role (Only once during login!)
  const { data: roleData } = await supabase
    .from("users")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const userRole = roleData?.role || "guest";

  // 3. Set a dedicated Role Cookie
  // This cookie is what the middleware will read
  cookieStore.set("user-role", userRole, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return { success: true, role: userRole };
}