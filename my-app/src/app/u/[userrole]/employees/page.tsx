import { getCachedEmployeesData } from "@/data/EmployeesData";
import { EmployeesTable } from "./EmployeesTable";
import { getUserId } from "@/utils/getUserId";


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
  const UserId = await getUserId();

  if(!UserId) return null;

  const Employees_Data = await getCachedEmployeesData(UserId, page, status, department, q);

  return (
    <main className="w-full">
      <EmployeesTable Employees_Data={Employees_Data} />
    </main>
  );
}
