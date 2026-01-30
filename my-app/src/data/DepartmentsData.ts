import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cache } from "react";

export const DepartmentsData = cache(async () => {
  const supabase = await createSupabaseServerClient();

  const { data: { user }, error: userError } =
    await supabase.auth.getUser();

  if (!user || userError) {
    return { success: false, message: "Unauthorized", data: [] };
  }

  const { data, error } = await supabase
    .from("users")
    .select("available_departments")
    .eq("id", user.id)
    .single();

  if (error) {
    return { success: false, message: error.message, data: [] };
  }

  return {
    success: true,
    message: "Get data successfully",
    data: data?.available_departments ?? [],
  };
});
