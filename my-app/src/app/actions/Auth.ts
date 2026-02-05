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
  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { success: false, message: error.message };

  const { data: userData } = await supabase
    .from("users")
    .select("name, role, avatar_url")
    .eq("id", user?.id)
    .single();

    const payload = {
      id: user?.id,
      role: userData?.role,
      name: userData?.name,
      avatar_url: userData?.avatar_url,
      email: user?.email,
    };


    // Sign the token even if they are a 'guest' so the middleware can track them
    const userToken = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET_KEY);

      cookieStore.set("user-context", userToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      });

    return { success: true, role: userToken };
}


export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  const cookieStore = await cookies();

  await supabase.auth.signOut();

  cookieStore.delete("user-context");
  redirect("/auth/login");
}