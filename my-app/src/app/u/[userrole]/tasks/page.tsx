import { IoIosAddCircle } from "react-icons/io";


export default async function page(){
    
    return (
        <main>
            <div
                className="w-full flex items-center justify-between"
            >
                <h1 className="text-3xl font-bold text-white mb-6">
                    Tasks Management - Admin Panel
                </h1>
                <button
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-neutral-100 py-1.5 px-3 rounded-lg text-sm"
                >
                    <IoIosAddCircle size={18}/> New Task
                </button>
            </div>
        </main>
    )
}