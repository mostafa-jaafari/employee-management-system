import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function getUserId() {
    const cookieHeader = Array.from((await cookies()).getAll())
        .map(c => `${c.name}=${c.value}`)
        .join("; ");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { cookie: cookieHeader } } } // تمرير الكوكيز
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}
