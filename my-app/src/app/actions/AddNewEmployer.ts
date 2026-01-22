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


    const { data, error } = await supabase.auth.admin.inviteUserByEmail(
        email,
        {
            redirectTo: "https://fluffy-fortnight-gw56pw6p6v5hw446-3000.app.github.dev/auth/set-password"
        });

    await supabase
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
                role: "employee"
            }
        ])
        if(error){
            return { success: false, message: error.message, data: null };
        }
    
        updateTag("Employees-Data");
    return { success: true, message: "Employer added successfully.", data: data };
}


export async function UpdateEmployee(password: string){
    const supabase = SupabaseServer();

    if(password.length < 6){
        return { success: false, message: "Password should be atleast 6 caracters !" }
    }
    const { error } = await supabase.auth.updateUser({
        password: password,
    })

    if(error){
        return { success: false, message: error.message }
    }

    return { success: true, message: "Password created successfully." }
}