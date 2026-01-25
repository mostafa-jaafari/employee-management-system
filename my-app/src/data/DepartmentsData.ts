import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cache } from "react";

export const DepartmentsData = cache(
  async () => {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: UserError } = await supabase.auth.getUser();

    if(!user) {
      return { success: false, message: UserError?.message }
    }

    const { data, error: DataError } = await supabase
        .from("users")
        .select("available_departments")
        .eq("id", user?.id)
        .single();
        
        if(DataError){
          return { success: false, message: DataError.message, data: [] }
        }

        return { success: true, message: "Get data successfully.", data: data ?? [] }
    }

)