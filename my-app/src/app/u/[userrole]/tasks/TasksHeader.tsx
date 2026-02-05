"use client";
import { useAddNewTask } from "@/context/AddNewTaskProvider";
import { IoIosAddCircle } from "react-icons/io";


export function TasksHeader({ User_Role }: { User_Role: string | undefined; }){
    const { setIsOpenAddNewTask } = useAddNewTask();
    return (
        <div
            className="pb-3 w-full flex items-center justify-between border-b border-neutral-700/60"
        >
            <h1 className="text-xl md:text-2xl font-bold text-white">
                Tasks Management {User_Role === "admin" && "- Admin Panel"}
            </h1>
            <button
                onClick={() => setIsOpenAddNewTask(true)}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-neutral-100 py-1.5 px-3 rounded-lg text-sm"
            >
                <IoIosAddCircle size={18}/> New Task
            </button>
        </div>
    )
}