import { createSupabaseServerClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";

export const DepartmentsData = () =>
  unstable_cache(
    async () => {
      const supabase = await createSupabaseServerClient();

      const { data, error } = await supabase
        .from("users")
        .select("available_departments")
        .limit(1)
        .single();

      if (error) {
        return {
          success: false,
          message: error.message,
          data: [],
        };
      }

      return {
        success: true,
        message: "Get departments successfully.",
        data: data?.available_departments ?? [],
      };
    },
    ["Departments-Data"],
    {
      tags: ["Departments-Data"],
    }
  )();
