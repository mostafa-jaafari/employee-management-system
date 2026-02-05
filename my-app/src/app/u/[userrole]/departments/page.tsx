import { getUserInfos } from '@/utils/getUserInfos';
import { DepartmentGrid } from './DepartmentGrid';

export default async function page() {
  const user = await getUserInfos() ?? undefined;
  return (
    <main
        className='w-full min-h-140'
    >
      <DepartmentGrid userInfos={user} />
    </main>
  )
}
