import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserId } from "@/utils/getUserId";
import { NextResponse } from "next/server";

export async function GET() {
  const UserId = await getUserId();
  const supabase = await createSupabaseServerClient();

  if (!UserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*", { count: "exact" })
    .eq("created_by", UserId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}