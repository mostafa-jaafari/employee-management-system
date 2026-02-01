import { Header } from "@/Components/Header";
import { SideBar } from "@/Components/SideBar";
import { ConfirmationModalProvider } from "@/context/ConfirmationModal";
import { AddNewTask } from "./tasks/AddNewTask";
import { AddNewTaskProvider } from "@/context/AddNewTaskProvider";
import { getCachedEmployeesEmails } from "@/data/EmployeesEmails";
import { getUserId } from "@/utils/getUserId";




export default async function RootLayout({ children }: { children: React.ReactNode }){
    
    const userId = await getUserId();
    let employeesEmails: string[] = [];
    
    if (userId) {
        const data = await getCachedEmployeesEmails(userId); // fetch cached emails
        employeesEmails = data.map(e => e.email); // adjust if necessary
    }

    return (
        <AddNewTaskProvider>
            <main
                className="w-full h-screen overflow-x-hidden overflow-y-auto text-neutral-100"
            >
                <AddNewTask initialEmails={employeesEmails} />
                <ConfirmationModalProvider>
                    <div
                        className="w-full flex items-start gap-3"
                    >
                        <SideBar />
                        <div
                            className="w-full py-3 space-y-1.5 pr-3"
                        >
                            <Header />
                            <div
                                className="w-full overflow-hidden pr-3"
                            >
                                {children}
                            </div>
                        </div>
                    </div>
                </ConfirmationModalProvider>
            </main>
        </AddNewTaskProvider>
    )
}