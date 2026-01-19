import { Header } from "@/Components/Header";
import { SideBar } from "@/Components/SideBar";




export default function RootLayout({ children }: { children: React.ReactNode }){
    return (
        <main
            className="w-full h-screen overflow-x-hidden overflow-y-auto bg-gray-100 text-neutral-800"
        >
            <div
                className="w-full flex items-start gap-3"
            >
                <SideBar />
                <div
                    className="w-full py-3 space-y-1.5 pr-3"
                >
                    <Header />
                    <div
                        className="w-full border border-neutral-300 rounded-lg overflow-hidden p-3 bg-white"
                    >
                        {children}
                    </div>
                </div>
            </div>
        </main>
    )
}