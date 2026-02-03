"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";


export async function CreateTaskAction(formData: FormData, userId: string){
    const supabase = await createSupabaseServerClient();

    const tasksRaw = formData.get("tasks") as string; 
    const tasks = JSON.parse(tasksRaw) as { text: string; completed: boolean }[];
    const assigned_to = formData.get("assigned_to") as string;
    const due_date = formData.get("due_date") as string;
    const priority = formData.get("priority") as string;
    const status = formData.get("status") as string;
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

    return { success: true, message: "Task added successfully.", task: data?.[0] }
}

export async function updateTaskStatusInDB(taskId: string, tasks: { text: string; completed: boolean; }[], status: string) {
  
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("tasks")
        .update({ tasks, status })
        .eq("id", taskId); // id للـ card أو project
  if (error) console.error("Failed to update task:", error);
  return data;
}
