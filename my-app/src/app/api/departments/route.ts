import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserInfos } from "@/utils/getUserInfos";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUserInfos();
  const supabase = await createSupabaseServerClient();

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("available_departments")
    .eq("id", user?.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data?.available_departments ?? []);
}