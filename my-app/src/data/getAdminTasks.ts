import { SupabaseServerCache } from "@/lib/supabase/ServerCache";
import { unstable_cache } from "next/cache";

export const getAdminTasks = async (userId: string) => {
  const cachedFn = unstable_cache(
    async () => {
      const supabase = SupabaseServerCache();

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("created_by", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    [`admin-tasks-${userId}`],
    {
      tags: [`admin-tasks-${userId}`],
      revalidate: 3600
    }
  );

  // 🔥 هنا كان ناقص
  return await cachedFn();
};
