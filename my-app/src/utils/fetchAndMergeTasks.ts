import { TaskType } from "@/GlobalTypes";
import { taskDB } from "@/lib/Ind/db";
import { mutate } from "swr";

export async function fetchAndMergeTasks() {
  try {
    const res = await fetch(`/api/tasks`);
    const supabaseTasks: TaskType[] = await res.json();

    const db = await taskDB.getAllTasks();

    // Merge tasks (avoid duplicates)
    const merged = [...db];
    for (const t of supabaseTasks) {
      if (!merged.find((mt) => mt.id === t.id)) {
        await taskDB.updateTask(t);
        merged.push(t);
      }
    }

    // Update SWR cache
    mutate('local-tasks-key', merged, false);
  } catch (err) {
    console.error('Failed to fetch tasks from Supabase', err);
  }
}
