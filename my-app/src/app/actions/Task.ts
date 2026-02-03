"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";


export async function CreateTaskAction(formData: FormData, userEmail: string){
    const supabase = await createSupabaseServerClient();

    const tasksRaw = formData.get("tasks") as string; 
    const tasks = JSON.parse(tasksRaw) as string[];
    const assigned_to = formData.get("assigned_to") as string;
    const due_date = formData.get("due_date") as string;
    const priority = formData.get("priority") as string;
    const due_time = formData.get("due_time") as string;

    if(tasks.length === 0 && assigned_to === "" && due_date === "" && priority === ""){
        return { success: false, message: "Please fill required inputs first !" }
    }

    const TASK = {
        tasks,
        assigned_to,
        due_date,
        due_time,
        priority,
        created_by: userEmail,
    }

    const { data, error } = await supabase
        .from("tasks")
        .insert([TASK])
        .select();

    if(error){
        return { success: false, message: error.message, data: null }
    }

    return { success: true, message: "Task added successfully.", task: data?.[0] }
}

export async function updateTaskStatusInDBAction(taskId: string, status: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("tasks")
        .update({ status: status }) // Ensure 'status' is being updated
        .eq("id", taskId); 
    
    if (error) throw new Error(error.message);
    return data;
}

export async function DeleteTaskAction(taskId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId); 
    
    if (error) {
        return { success: false, message: error.message, data: null }
    };
    return { success: true, message: "Task deleted successfully.", task: data?.[0] }
}