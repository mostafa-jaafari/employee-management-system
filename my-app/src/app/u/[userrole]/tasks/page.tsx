import { getUserRole } from "@/utils/getUserInfos";
import { DemoTasksNotice } from "./DemoTasksNotice";
import { TasksContainer } from "./TasksContainer";
import { TasksHeader } from "./TasksHeader";


export default async function page({ params }: { params: Promise<{ userrole: string }> }) {
    const PARAMS = await params;
    const User_Role = PARAMS.userrole as "employee" | "admin";
    const T = await getUserRole();
    return (
        <main>
            {T.UserRole}
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