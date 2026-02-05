import { unstable_cache } from "next/cache";
import { SupabaseServerCache } from "@/lib/supabase/ServerCache";

const supabaseDb = SupabaseServerCache();

export const getCachedEmployeesEmails = unstable_cache(
  async (adminId: string) => {
    const { data } = await supabaseDb
      .from("employees")
      .select("email")
      .eq("chef_admin", adminId);

    return data ?? [];
  },
  ["employees-emails"],
  {
    tags: ["employees-emails"],
  }
);
