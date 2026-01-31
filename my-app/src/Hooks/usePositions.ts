import useSWR from "swr";

// Simple fetcher function
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch positions");
    return res.json();
  });

export function usePositions(userId?: string) {
  const { data, error, isLoading, mutate } = useSWR<string[]>(
    userId ? "/api/positions" : null, // Key is the URL
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    positions: data ?? [],
    isLoading,
    isError: error,
    mutatePositions: mutate, // Expose mutate to trigger re-fetch
  };
}