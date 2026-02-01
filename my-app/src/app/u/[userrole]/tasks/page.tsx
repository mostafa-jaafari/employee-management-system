import { DemoTasksNotice } from "./DemoTasksNotice";
import { TasksHeader } from "./TasksHeader";
import { getCachedEmployeesEmails } from "@/data/EmployeesEmails";
import { getUserId } from "@/utils/getUserId";


export default async function page({ params }: { params: Promise<{ userrole: string }> }) {
    const PARAMS = await params;
    const User_Role = PARAMS.userrole as "employee" | "admin";
    
    const userId = await getUserId();
    if(!userId) return null;
    const Employees_Emails = await getCachedEmployeesEmails(userId);
    return (
        <main>
            {JSON.stringify(Employees_Emails || "nothing")}
            <br />
            {userId}
            <TasksHeader User_Role={User_Role}/>

            {/* --- TASKS DEMO NOTICE --- */}
            <DemoTasksNotice />

            {/* --- Tasks Body --- */}

            <section>
                
            </section>
        </main>
    )
}