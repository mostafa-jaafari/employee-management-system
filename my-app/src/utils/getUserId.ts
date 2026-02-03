import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getUserId() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { userId: user?.id, UserEmail: user?.email || null};
}