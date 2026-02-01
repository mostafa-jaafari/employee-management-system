import { DemoTasksNotice } from "./DemoTasksNotice";
import { TasksHeader } from "./TasksHeader";


export default async function page({ params }: { params: Promise<{ userrole: string }> }) {
    const PARAMS = await params;
    const User_Role = PARAMS.userrole as "employee" | "admin";
    return (
        <main>
            <TasksHeader User_Role={User_Role}/>

            {/* --- TASKS DEMO NOTICE --- */}
            <DemoTasksNotice />

            {/* --- Tasks Body --- */}

            <section>
                
            </section>
        </main>
    )
}