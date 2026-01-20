"use server";
import { SupabaseServer } from "@/lib/supabase/server";
import { updateTag } from "next/cache";


export async function AddNewDepartment(userId: string, NewDepartment: string){
    const supabase = SupabaseServer();

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