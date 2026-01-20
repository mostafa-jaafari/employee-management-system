"use client";

import { useAddNewEmployer } from "@/context/AddNewEmployer";
import { AiOutlineApartment } from "react-icons/ai";
import { FaTrash } from "react-icons/fa6";
import { MdOutlineAddCircle } from "react-icons/md";

export function DepartmentGrid({ Departments_Data }: { Departments_Data: string[]; }) {
    const { setIsOpenAddNewDepartment } = useAddNewEmployer();
  
    return (
        <section>
            <div
                className='flex items-center gap-6 justify-between'
            >
                <h1
                    className='font-semibold'
                >
                    Departments ({Departments_Data.length})
                </h1>
                <button
                    onClick={() => {
                        setIsOpenAddNewDepartment(true);
                    }}
                    className='cursor-pointer bg-blue-600 hover:bg-blue-600/90 flex items-center gap-1.5 border-b border-blue-800 rounded-lg px-3 py-1.5 text-white'
                >
                    <MdOutlineAddCircle /> <span className='text-xs'>Add Department</span>
                </button>
            </div>
            
            <span className='flex my-3 bg-gray-300 w-full h-px' />
            
            <div
                className="space-y-1.5"
            >
                {Departments_Data && Departments_Data.length > 0 ? 
                Departments_Data.map((dep, idx) => {
                    return (
                        <div
                            key={idx}
                            className='w-full hover:border-blue-400 hover:ring-blue-400 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between p-3 text-sm rounded-lg border-b border-neutral-400 ring ring-neutral-300'
                        >
                            <span
                                className="flex items-center gap-1.5 font-semibold"
                            >
                                <AiOutlineApartment size={18} /> {dep}
                            </span>
                            <button
                                className="text-red-600 border border-transparent hover:border-red-700 hover:text-red-700 rounded-lg p-1 cursor-pointer"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    )
                }) : ""}
            </div>
        </section>
    )
}
