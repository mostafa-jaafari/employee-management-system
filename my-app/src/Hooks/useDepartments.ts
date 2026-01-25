import useSWR from "swr";

// Simple fetcher function
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch departments");
    return res.json();
  });

export function useDepartments(userId?: string) {
  const { data, error, isLoading, mutate } = useSWR<string[]>(
    userId ? "/api/departments" : null, // Key is the URL
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    departments: data ?? [],
    isLoading,
    isError: error,
    mutateDepartments: mutate, // Expose mutate to trigger re-fetch
  };
}