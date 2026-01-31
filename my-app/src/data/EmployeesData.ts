import { createSupabaseServerClient } from "@/lib/supabase/server";

const EMPLOYEES_LIMIT = 20;
const KNOWN_STATUSES = ['ACTIVE', 'PROBATION', 'INACTIVE'];

export async function EmployeesData(
  page: number, 
  status?: string, 
  department?: string, 
  q?: string
) {
  const supabase = await createSupabaseServerClient();

  // 1️⃣ Get current logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return {
      data: [],
      TotalEmployees: 0,
      page,
      status: null,
      department: null,
      Available_Status: KNOWN_STATUSES,
    };
  }

  // 2️⃣ Pagination
  const from = (page - 1) * EMPLOYEES_LIMIT;
  const to = from + EMPLOYEES_LIMIT - 1;

  // 3️⃣ Base query → IMPORTANT PART 👇
  let query = supabase
    .from("employees")
    .select("*", { count: "exact" })
    .eq("chef_admin", user.id); // ✅ filter by current admin

  // 4️⃣ Filters
  if (status && status !== "All") {
    query = query.eq("status", status);
  }

  if (department && department !== "All") {
    query = query.eq("department", department);
  }

  if (q) {
    query = query.or(
      `first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`
    );
  }

  // 5️⃣ Pagination & order
  query = query
    .range(from, to)
    .order("created_at", { ascending: false });

  // 6️⃣ Execute
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
}
