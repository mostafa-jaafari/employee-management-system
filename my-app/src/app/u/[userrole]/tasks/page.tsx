import { getUserInfos } from "@/utils/getUserInfos";
import { DemoTasksNotice } from "./DemoTasksNotice";
import { TasksContainer } from "./TasksContainer";
import { TasksHeader } from "./TasksHeader";
import { getAdminTasks } from "@/data/getAdminTasks";


export default async function page() {
    const user = await getUserInfos() ?? undefined;
    if(user === undefined) return;
    
    const User_Role = user?.role;

    const Cached_Tasks = await getAdminTasks(user?.id)
    return (
        <main>
            {JSON.stringify(Cached_Tasks) || "nothing"}
            <TasksHeader User_Role={User_Role}/>

            {/* --- TASKS DEMO NOTICE --- */}
            <DemoTasksNotice />

            {/* --- Tasks Body --- */}

            <section>
                <TasksContainer />
            </section>
        </main>
    )
}