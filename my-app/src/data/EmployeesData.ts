import { SupabaseServer } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";

const EMPLOYEES_LIMIT = 20;

export const EmployeesData = (page: number, status?: string, department?: string, q?: string) =>
  unstable_cache(
    async () => {
      const supabase = SupabaseServer();

      const from = (page - 1) * EMPLOYEES_LIMIT;
      const to = from + EMPLOYEES_LIMIT - 1;

      let query = supabase.from("employees").select("*", { count: "exact" });

      if (status) query = query.eq("status", status);
      if (department) query = query.eq("department", department);
      if (q) query = query.ilike("first_name", `%${q}%`);

      query = query.range(from, to);

      const { data, error, count } = await query;
      const { data: Available_Status_Data } = await supabase.from("employees").select("status", { count: "exact" });

      const Available_Status = Array.from(new Set(Available_Status_Data?.map(employer => employer.status)))

      // ✅ التحقق من وجود الخطأ بطريقة آمنة
      if (error) {
        console.error("Supabase query error:", error);
        throw new Error(error.message ?? JSON.stringify(error));
      }

      return {
        data,
        TotalEmployees: count ?? 0,
        page,
        status: status ?? null,
        department: department ?? null,
        Available_Status,
      };
    },
    ["Employees-Data", `page-${page}`, `status-${status}`, `department-${department}`, `q-${q}`],
    { revalidate: 3600 }
  )();
