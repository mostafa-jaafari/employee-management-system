"use server";
import { SupabaseServer } from "@/lib/supabase/server";
import { updateTag } from "next/cache";


export async function AddNewEmployerAction(formData: FormData){
    const supabase = SupabaseServer();

    const first_name = formData.get('firstname') as string;
    const last_name = formData.get('lastname') as string;
    const email = formData.get('email') as string;
    const salary = Number(formData.get('salary')) as number;
    const position = formData.get('position') as string;
    const status = formData.get('status') as string;
    const department = formData.get('department') as string;
    const hired_at = formData.get('hired_at') as string;


    const { data, error } = await supabase
        .from("employees")
        .insert([
            {
                first_name,
                last_name,
                email,
                salary,
                position,
                status: status.toUpperCase(),
                department,
                hired_at,
            }
        ])
        if(error){
            return { success: false, message: error.message, data: null };
        }
    
        updateTag("Employees-Data");
    return { success: true, message: "Employer added successfully.", data: data };
}