// hooks/useMergedTasks.ts
import useSWR, { mutate } from "swr";
import { taskDB } from "@/lib/Ind/db";
import { TaskType } from "@/GlobalTypes";

async function fetchAndMergeTasksFromDB() {
  // 1️⃣ Fetch Supabase tasks
  const res = await fetch("/api/tasks");
  const supabaseTasks: TaskType[] = await res.json();

  // 2️⃣ Get local tasks
  const localTasks = await taskDB.getAllTasks();

  // 3️⃣ Merge: use local if exists, else supabase
  const mergedTasksMap = new Map<string, TaskType>();

  [...supabaseTasks, ...localTasks].forEach(task => {
    mergedTasksMap.set(task.id, task);
  });

  // 4️⃣ Save merged tasks into IndexedDB
  for (const task of mergedTasksMap.values()) {
    await taskDB.updateTask(task);
  }

  return Array.from(mergedTasksMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function useMergedTasks() {
  const { data, isLoading } = useSWR("local-tasks-key", fetchAndMergeTasksFromDB, {
    revalidateOnFocus: false,
    fallbackData: [],
  });

  return {
    tasks: data || [],
    isLoading,
    mutateTasks: () => mutate("local-tasks-key"),
  };
}
