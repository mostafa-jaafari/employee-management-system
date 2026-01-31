"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";



export async function SetRoleAction(role: "admin" | "employee") {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("users")
        .update({ role: role })
        .eq("id", (await supabase.auth.getUser()).data.user?.id);

    if (error) {
        return { success: false, message: error.message, role: null };
    }

    return { success: true, message: "Role updated successfully.", role: data };
}