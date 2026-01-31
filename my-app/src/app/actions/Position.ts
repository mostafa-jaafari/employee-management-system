"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Standardized response type
type ActionResponse = {
  success: boolean;
  message: string;
};

export async function AddNewPositionAction(userId: string, newPosition: string, userRole: "admin" | "employee" | "guest"): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();

  if (!userId || !newPosition) {
    return { success: false, message: "Missing required fields." };
  }

  if(userRole === "employee"){
    return { success: false, message: "Sorry employees can't add positions." };
  }

  // 1. Fetch current departments
  const { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("available_positions")
    .eq("id", userId)
    .single();

  if (fetchError) return { success: false, message: fetchError.message };

  const currentDepartments = userData?.available_positions ?? [];

  // 2. Check for duplicates
  // Case insensitive check is usually better (optional)
  if (currentDepartments.includes(newPosition)) {
    return { success: false, message: `"${newPosition}" already exists.` };
  }

  const updatedDepartments = [...currentDepartments, newPosition];

  // 3. Update Database
  const { error: updateError } = await supabase
    .from("users")
    .update({ available_positions: updatedDepartments })
    .eq("id", userId);

  if (updateError) {
    return { success: false, message: updateError.message };
  }

  return { success: true, message: "Department added successfully." };
}

export async function DeletePositionAction(userId: string, positionToDelete: string): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();

  if (!userId || !positionToDelete) {
    return { success: false, message: "Missing required fields." };
  }

  // 1. Fetch current departments
  const { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("available_positions")
    .eq("id", userId)
    .single();

  if (fetchError) return { success: false, message: fetchError.message };

  const currentDepartments = userData?.available_positions ?? [];
  
  // 2. Filter out the item
  const updatedDepartments = currentDepartments.filter(
    (dep: string) => dep !== positionToDelete
  );

  // 3. Update Database
  const { error: updateError } = await supabase
    .from("users")
    .update({ available_positions: updatedDepartments })
    .eq("id", userId);

  // *** THE FIX: Checking updateError, not fetchError ***
  if (updateError) {
    return { success: false, message: updateError.message };
  }

  return { success: true, message: "Department deleted successfully." };
}