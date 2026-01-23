"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateTag } from "next/cache";


export async function AddNewDepartment(userId: string, NewDepartment: string){
    const supabase = await createSupabaseServerClient();

    if(userId === "" || NewDepartment === ""){
        return { success: false, message: "One of the parametres is not available!" };
    }
    
    const { data, error } = await supabase.
        from("users")
        .select("available_departments")
        .eq("id", userId)
        .single();

    if(error){
        return { success: false, message: error.message }
    }

    if(data?.available_departments.includes(NewDepartment)){
        return { success: false, message: `${NewDepartment} is already exist !` }
    }
    
    const updated_Departments = [...data?.available_departments, NewDepartment];

    const { error: Updated_Departments_Error } = await supabase
        .from("users")
        .update({ available_departments: updated_Departments })
        .eq("id", userId);
    
    if(error){
        return { success: false, message: Updated_Departments_Error?.message }
    }

    updateTag("Departments-Data");
    return { success: true, message: "Department added Successfully." }
}

export async function DeleteDepartment(userId: string, DepartmentToDelete: string){
    const supabase = await createSupabaseServerClient();

    if(userId === "" || DepartmentToDelete === ""){
        return { success: false, message: "One of the parametres is not available!" };
    }
    
    const { data, error } = await supabase.
        from("users")
        .select("available_departments")
        .eq("id", userId)
        .single();

    if(error){
        return { success: false, message: error.message }
    }
    
    const updated_Departments = data?.available_departments.filter((dep: string) => dep !== DepartmentToDelete);

    const { error: Updated_Departments_Error } = await supabase
        .from("users")
        .update({ available_departments: updated_Departments })
        .eq("id", userId);
    
    if(error){
        return { success: false, message: Updated_Departments_Error?.message }
    }

    updateTag("Departments-Data");
    return { success: true, message: "Department removed Successfully." }
}