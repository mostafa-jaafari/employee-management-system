"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";


export async function CreateTaskAction(formData: FormData, userId: string){
    const supabase = await createSupabaseServerClient();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const assigned_to = formData.get("assigned_to") as string;
    const due_date = formData.get("due_date") as string;
    const priority = formData.get("priority") as string;
    const status = formData.get("status") || "pending" as string;

    if(title === "" && assigned_to === "" && due_date === "" && priority === ""){
        return { success: false, message: "Please fill required inputs first !" }
    }

    const TASK = {
        title,
        description,
        assigned_to,
        due_date,
        priority,
        status,
        created_by: userId,
    }

    const { data, error } = await supabase
        .from("tasks")
        .insert([TASK])
        .select();

    if(error){
        return { success: false, message: error.message, data: null }
    }

    return { success: true, message: "Task added successfully.", data: data }
}