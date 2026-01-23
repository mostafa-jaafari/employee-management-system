"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function LoginAction(email: string, password: string) {
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { success: false, ErrorMessage: error.message };
    }

    // Revalidate the entire layout to ensure server components see the new cookie
    revalidatePath("/", "layout");

    return { success: true, data };
}