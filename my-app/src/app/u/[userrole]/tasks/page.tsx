import { getUserInfos } from "@/utils/getUserInfos";
import { DemoTasksNotice } from "./DemoTasksNotice";
import { TasksContainer } from "./TasksContainer";
import { TasksHeader } from "./TasksHeader";


export default async function page() {
    const user = await getUserInfos() ?? undefined;
    const User_Role = user?.role;

    return (
        <main>
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