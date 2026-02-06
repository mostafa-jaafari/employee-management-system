// src/app/api/sync-tasks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ success: false, error: "Empty body" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    
    // Check if body.tasks is an array and if your DB expects a string or array
    const { error } = await supabase.from("tasks").insert([body]);

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API Route Error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" }, 
      { status: 500 }
    );
  }
}