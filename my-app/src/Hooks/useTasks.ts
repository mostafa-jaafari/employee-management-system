import useSWR, { mutate } from 'swr';
import { taskDB } from '@/lib/Ind/db';
import { TaskType } from '@/GlobalTypes';
import { scheduleSync } from '@/utils/scheduleSync';

// Fetcher reads tasks from IndexedDB
const localFetcher = async () => {
  return await taskDB.getAllTasks();
};

export function useTasks() {
  const { data, isLoading } = useSWR<TaskType[]>('local-tasks-key', localFetcher, {
    fallbackData: [],
    revalidateOnFocus: false,
  });

  const addTask = async (task: Omit<TaskType, 'id' | 'created_at' | 'status'>) => {
    const newTask = await taskDB.addTask(task);

    // Optimistic UI update
    mutate('local-tasks-key', [newTask, ...(data || [])], false);
    
    // Schedule delayed sync
    scheduleSync();

    return newTask;
  };

  return {
    tasks: (data || []).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
    isLoading,
    addTask,
  };
}
