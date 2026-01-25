import { DepartmentsData } from '@/data/DepartmentsData'
import { DepartmentGrid } from './DepartmentGrid';

export default async function page() {
    const Departments_Data = await DepartmentsData();
  return (
    <main
        className='w-full min-h-140'
    >
        <DepartmentGrid Departments_Data={(Departments_Data as { data: { available_departments: string[] } }).data?.available_departments ?? []} />
    </main>
  )
}
