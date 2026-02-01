import { IoIosAddCircle } from "react-icons/io";
import { DemoTasksNotice } from "./DemoTasksNotice";


export default async function page({ params }: { params: Promise<{ userrole: string }> }) {
    const PARAMS = await params;
    const User_Role = PARAMS.userrole as "employee" | "admin";
    return (
        <main>
            <div
                className="pb-3 w-full flex items-center justify-between border-b border-neutral-700/60"
            >
                <h1 className="text-xl md:text-2xl font-bold text-white">
                    Tasks Management {User_Role === "admin" && "- Admin Panel"}
                </h1>
                <button
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-neutral-100 py-1.5 px-3 rounded-lg text-sm"
                >
                    <IoIosAddCircle size={18}/> New Task
                </button>
            </div>

            {/* --- TASKS DEMO NOTICE --- */}
            <DemoTasksNotice />

            {/* --- Tasks Body --- */}

            <section>
                
            </section>
        </main>
    )
}