"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EmployerType } from "@/GlobalTypes";
import { updateTag } from "next/cache";


export async function AddNewEmployerAction(formData: FormData, userRole: "admin" | "employee" | "guest"){
    const supabase = await createSupabaseServerClient();

    const first_name = formData.get('firstname') as string;
    const last_name = formData.get('lastname') as string;
    const email = formData.get('email') as string;
    const salary = Number(formData.get('salary')) as number;
    const position = formData.get('position') as string;
    const status = formData.get('status') as string;
    const department = formData.get('department') as string;
    const hired_at = formData.get('hired_at') as string;
    const chef_admin = formData.get('chef_admin') as string;

    if(userRole === "employee"){
        return { success: false, message: "Sorry, employees can't add employees" }
    }

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
                chef_admin,
                role: "employee"
            }
        ])
        if(error){
            return { success: false, message: `Insert Error : --${error.message}--`, data: null };
        }
    
        updateTag("Employees-Data");
        updateTag("employees-emails");
    return { success: true, message: "Employer added successfully.", data: data };
}

export async function DeleteEmployeeAction(EmployeeId: string, userRole: "admin" | "employee" | "guest"){
    const supabase = await createSupabaseServerClient();

    if(userRole === "employee"){
        return { success: false, message: "Sorry, employees cant't delete employees !" }
    }

    if(!EmployeeId){
        return { success: false, message: "Employee id is missing !" }
    }

    const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", EmployeeId);

    if(error){
        return { success: false, message: error.message }
    }

    updateTag("Employees-Data");
    return { success: true, message: "Employee Deleted Successfully."  }
}

export async function UpdateEmployeeAction(employeeId: string, updatedData: Partial<EmployerType>, userRole: "admin" | "employee" | "guest"){
    const supabase = await createSupabaseServerClient();

    if(userRole === "employee"){
        return { success: false, message: "Sorry, employees can't update employees !" }
    }

    if(employeeId === ""){
        return { success: false, message: "Employee Id is missing !" }
    }

    const { error } = await supabase
        .from('employees')
        .update(updatedData)
        .eq("id", employeeId);

    if(error){
        return { success: false, message: error.message }
    }

    updateTag("Employees-Data");
    return { success: true, message: "Employee updated successfully." }
}