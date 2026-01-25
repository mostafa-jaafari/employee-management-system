import { createSupabaseServerClient } from "@/lib/supabase/server";

const EMPLOYEES_LIMIT = 20;

// Hardcoded based on your SQL ENUM to save performance
const KNOWN_STATUSES = ['ACTIVE', 'PROBATION', 'INACTIVE'];

export async function EmployeesData(
  page: number, 
  status?: string, 
  department?: string, 
  q?: string
) {
  // 1. Use the client that has User Session (Cookies)
  const supabase = await createSupabaseServerClient();

  // 2. Pagination Logic
  const from = (page - 1) * EMPLOYEES_LIMIT;
  const to = from + EMPLOYEES_LIMIT - 1;

  // 3. Start building the query
  let query = supabase
    .from("employees")
    .select("*", { count: "exact" });

  // 4. Apply Filters
  if (status && status !== "All") {
    query = query.eq("status", status);
  }
  
  if (department && department !== "All") {
    query = query.eq("department", department);
  }

  if (q) {
    // Search in first_name, last_name, or email
    query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`);
  }

  // 5. Apply Range (Pagination) & Order
  query = query
    .range(from, to)
    .order("created_at", { ascending: false });

  // 6. Execute Query
  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching employees:", error);
    // Return empty state instead of throwing to prevent crashing the UI
    return {
      data: [],
      TotalEmployees: 0,
      page,
      status: status ?? null,
      department: department ?? null,
      Available_Status: KNOWN_STATUSES
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
}