import useSWR from 'swr';
import { taskDB } from '@/lib/Ind/db';
import { TaskType } from '@/GlobalTypes';

// The "fetcher" now simply reads from IndexedDB
const localFetcher = async () => {
  return await taskDB.getAll();
};

export function useTasks() {
  const { data, mutate, isLoading } = useSWR<TaskType[]>(
    'local-tasks-key', 
    localFetcher,
    {
      fallbackData: [],
      revalidateOnFocus: false, // Not needed for local DB
    }
  );

  return {
    tasks: (data || []).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
    isLoading,
    mutateTasks: mutate,
  };
}