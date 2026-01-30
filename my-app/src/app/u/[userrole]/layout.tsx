import { Header } from "@/Components/Header";
import { SideBar } from "@/Components/SideBar";
import { ConfirmationModalProvider } from "@/context/ConfirmationModal";




export default function RootLayout({ children }: { children: React.ReactNode }){
    return (
        <main
            className="w-full h-screen overflow-x-hidden overflow-y-auto text-neutral-100"
        >
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
                            className="w-full overflow-hidden"
                        >
                            {children}
                        </div>
                    </div>
                </div>
            </ConfirmationModalProvider>
        </main>
    )
}