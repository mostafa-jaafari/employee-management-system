import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";

export function useDepartments(userId?: string) {
  return useSWR(
    userId ? ["departments", userId] : null,
    () => fetcher("/api/departments"),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 10, // 10 دقائق
    }
  );
}
