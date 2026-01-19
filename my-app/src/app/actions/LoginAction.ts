"use server";

import { SupabaseServer } from "@/lib/supabase/server";

export async function LoginAction(email: string, password: string){
    const supabase = SupabaseServer();
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if(error){
        return { success: false, ErrorMessage: error.message }
    }

    return { success: true, data };
}