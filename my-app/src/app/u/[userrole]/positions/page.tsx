import { getUserInfos } from '@/utils/getUserInfos';
import { PositionsGrid } from './PositionsGrid';

export default async function page() {
  const user = await getUserInfos() ?? undefined;
  
  return (
    <main
        className='w-full min-h-140'
    >
      <PositionsGrid userInfos={user} />
    </main>
  )
}
