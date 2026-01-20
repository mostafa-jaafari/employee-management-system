// app/api/departments/route.ts
import { DepartmentsData } from "@/data/DepartmentsData";
import { NextResponse } from "next/server";

export async function GET() {
  const departments = await DepartmentsData();
  return NextResponse.json(departments.data);
}
