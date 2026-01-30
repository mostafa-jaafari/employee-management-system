"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

// Standardized response type
type ActionResponse = {
  success: boolean;
  message: string;
};

export async function AddNewDepartment(userId: string, newDepartment: string, userRole: "admin" | "employee" | "guest"): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();

  if (!userId || !newDepartment) {
    return { success: false, message: "Missing required fields." };
  }

  if(userRole === "employee"){
    return { success: false, message: "Sorry employees can't add departments." };
  }

  // 1. Fetch current departments
  const { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("available_departments")
    .eq("id", userId)
    .single();

  if (fetchError) return { success: false, message: fetchError.message };

  const currentDepartments = userData?.available_departments ?? [];

  // 2. Check for duplicates
  // Case insensitive check is usually better (optional)
  if (currentDepartments.includes(newDepartment)) {
    return { success: false, message: `"${newDepartment}" already exists.` };
  }

  const updatedDepartments = [...currentDepartments, newDepartment];

  // 3. Update Database
  const { error: updateError } = await supabase
    .from("users")
    .update({ available_departments: updatedDepartments })
    .eq("id", userId);

  if (updateError) {
    return { success: false, message: updateError.message };
  }

  return { success: true, message: "Department added successfully." };
}

export async function DeleteDepartment(userId: string, departmentToDelete: string): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();

  if (!userId || !departmentToDelete) {
    return { success: false, message: "Missing required fields." };
  }

  // 1. Fetch current departments
  const { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("available_departments")
    .eq("id", userId)
    .single();

  if (fetchError) return { success: false, message: fetchError.message };

  const currentDepartments = userData?.available_departments ?? [];
  
  // 2. Filter out the item
  const updatedDepartments = currentDepartments.filter(
    (dep: string) => dep !== departmentToDelete
  );

  // 3. Update Database
  const { error: updateError } = await supabase
    .from("users")
    .update({ available_departments: updatedDepartments })
    .eq("id", userId);

  // *** THE FIX: Checking updateError, not fetchError ***
  if (updateError) {
    return { success: false, message: updateError.message };
  }

  return { success: true, message: "Department deleted successfully." };
}