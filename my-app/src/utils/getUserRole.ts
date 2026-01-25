import { createSupabaseServerClient } from "@/lib/supabase/server";




export async function getUserRole(){
    const supabase = await createSupabaseServerClient();

    const { data: user, error } = await supabase.auth.getUser();
    
    if(error){
        return { success: false, message: error.message, UserRole: null };
    }

    const { data: role, error: RoleError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.user?.id)
        .single();

    if(RoleError){
        return { success: false, message: RoleError.message }
    }
    return { success: true, message: "Get user role successfully.", UserRole: role }
}