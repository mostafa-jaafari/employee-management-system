"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SECRET_KEY = new TextEncoder().encode(process.env.ROLE_SECRET_KEY);
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

  const { data: roleData } = await supabase
    .from("users")
    .select("role")
    .eq("id", data.user.id)
    .single();

    const userRole = roleData?.role || "guest";

    // Sign the token even if they are a 'guest' so the middleware can track them
    const roleToken = await new SignJWT({ role: userRole })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(SECRET_KEY);

      cookieStore.set("user-role-token", roleToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      });

    return { success: true, role: userRole };
}


export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  const cookieStore = await cookies();

  await supabase.auth.signOut();

  cookieStore.delete("user-role-token");
  redirect("/auth/login");
}