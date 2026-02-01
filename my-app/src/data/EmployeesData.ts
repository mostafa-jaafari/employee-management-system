import { unstable_cache } from "next/cache";
import { SupabaseServerCache } from "@/lib/supabase/ServerCache";

const EMPLOYEES_LIMIT = 20;
const KNOWN_STATUSES = ["ACTIVE", "PROBATION", "INACTIVE"];

const supabaseDb = SupabaseServerCache();

export const getCachedEmployeesData = unstable_cache(
  async (
    adminId: string,
    page: number,
    status?: string,
    department?: string,
    q?: string
  ) => {
    const from = (page - 1) * EMPLOYEES_LIMIT;
    const to = from + EMPLOYEES_LIMIT - 1;

    let query = supabaseDb
      .from("employees")
      .select("*", { count: "exact" })
      .eq("chef_admin", adminId);

    if (status && status !== "All") query = query.eq("status", status);
    if (department && department !== "All") query = query.eq("department", department);
    if (q) query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`);

    query = query.range(from, to).order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching employees:", error);
      return {
        data: [],
        TotalEmployees: 0,
        page,
        status: status ?? null,
        department: department ?? null,
        Available_Status: KNOWN_STATUSES,
      };
    }

    return {
      data: data ?? [],
      TotalEmployees: count ?? 0,
      page,
      status: status ?? null,
      department: department ?? null,
      Available_Status: KNOWN_STATUSES,
    };
  },
  ["Employees-Data"],
  { tags: ["Employees-Data"] }
);
