import { taskDB } from "@/lib/Ind/db";

export async function syncTasksToSupabase() {
  const localTasks = await taskDB.getAllTasks();
  const unsyncedTasks = localTasks.filter(t => !t.synced);

  for (const task of unsyncedTasks) {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(task),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Supabase POST failed");

      // Mark synced AFTER successful POST
      await taskDB.updateTask({ ...task, synced: true });
    } catch (err) {
      console.error("Sync failed:", task.id, err);
    }
  }
}
