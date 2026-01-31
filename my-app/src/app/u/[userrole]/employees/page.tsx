import { EmployeesData } from "@/data/EmployeesData";
import { EmployeesTable } from "./EmployeesTable";


export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string;  department?: string; q?: string }>;
}) {
  const Search_Params = await searchParams;
  const page = Number(Search_Params?.page) || 1;
  const status = Search_Params?.status;
  const department = Search_Params?.department;
  const q = Search_Params?.q;

  const Employees_Data = await EmployeesData(page, status, department, q);

  return (
    <main className="w-full">
      <EmployeesTable Employees_Data={Employees_Data} />
    </main>
  );
}
