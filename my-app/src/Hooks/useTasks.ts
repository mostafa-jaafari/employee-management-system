import { TaskType } from "@/GlobalTypes";
import useSWR from "swr";

// Simple fetcher function
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  });

export function useTasks(userId?: string) {
  const { data, error, isLoading, mutate } = useSWR<TaskType[]>(
    userId ? `/api/tasks?userId=${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    tasks: data ?? [],
    isLoading,
    isError: error,
    mutateTasks: mutate,
  };
}