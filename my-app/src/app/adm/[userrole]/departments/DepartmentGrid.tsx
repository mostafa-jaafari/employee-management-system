"use client";

import { DeleteDepartment } from "@/app/actions/Department";
import { ConfirmationModal } from "@/Components/ConfirmationModal";
import { useAddNewEmployer } from "@/context/AddNewEmployer";
import { useConfirmationModal } from "@/context/ConfirmationModal";
import { useUserInfos } from "@/context/UserInfos";
import { useState } from "react";
import { AiOutlineApartment } from "react-icons/ai";
import { FaTrash } from "react-icons/fa6";
import { MdOutlineAddCircle } from "react-icons/md";
import { toast } from "sonner";

export function DepartmentGrid({ Departments_Data }: { Departments_Data: string[]; }) {
    const { setIsOpenAddNewDepartment } = useAddNewEmployer();
    const { userInfos } = useUserInfos();
    const { setIsConfirmationModalOpen } = useConfirmationModal()

    const [departmentToDelete, setDepartmentToDelete] = useState<string>("");
    const [isLoadingDeleteDepartment, setIsLoadingDeleteDepartment] = useState(false);
    const HandleRemoveDepartment = async (DepartmentToDelete: string) => {
        if(!userInfos) return;
        setIsLoadingDeleteDepartment(true);
        try{
            const Result = await DeleteDepartment(userInfos?.id, DepartmentToDelete);

            if(!Result.success){
                toast.error(Result.message);
                return;
            }

            toast.success(Result.message);
            setIsLoadingDeleteDepartment(false);
        }catch (err){
            toast.error((err as { message: string }).message)
            setIsLoadingDeleteDepartment(false);
        }
    }

    return (
        <section>
            <ConfirmationModal 
                ConfirmButtonLabel="Delete"
                Title={`Are you sure you want to delete "${departmentToDelete}" ?`}
                HandelConfirmModal={() => HandleRemoveDepartment(departmentToDelete)}
                HandelCancelModal={() => setDepartmentToDelete("")}
                ShowWarningMessage
                isLoadingConfirmation={isLoadingDeleteDepartment}
                WarningMessage="This department will be permanently deleted and cannot be recovered."
            />
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

                {Departments_Data && Departments_Data.length > 0 ? (
                    <div
                        className="grid grid-cols-2 gap-3"
                    >
                        {Departments_Data.map((dep, idx) => {
                            return (
                                <div
                                    key={idx}
                                    className='w-full hover:border-blue-400 hover:ring-blue-400 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between p-3 text-sm rounded-lg border-b border-neutral-400 ring ring-neutral-300'
                                >
                                    <span
                                        className="flex items-center gap-1.5 font-semibold"
                                    >
                                        <AiOutlineApartment size={18} className="text-neutral-500" /> {dep}
                                    </span>
                                    <button
                                        // onClick={() => HandleRemoveDepartment(dep)}
                                        onClick={() => {
                                            setIsConfirmationModalOpen(true)
                                            setDepartmentToDelete(dep)
                                        }}
                                        className="text-red-600 border border-transparent hover:border-red-700 hover:text-red-700 rounded-lg p-1 cursor-pointer"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )
                : (
                    <div
                        className="text-neutral-500 w-full flex flex-col gap-3 justify-center items-center py-14 text-sm"
                    >
                        No &quote;Departments&quote; Available right now !
                        <br />
                        <button
                            onClick={() => {
                                setIsOpenAddNewDepartment(true);
                            }}
                            className='cursor-pointer bg-blue-600 hover:bg-blue-600/90 flex items-center gap-1.5 border-b border-blue-800 rounded-lg px-3 py-1.5 text-white'
                        >
                            <MdOutlineAddCircle /> <span className='text-xs'>Add Department</span>
                        </button>
                    </div>
                )}
        </section>
    )
}
