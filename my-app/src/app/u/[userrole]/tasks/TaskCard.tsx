"use client";
// import { DeleteTaskAction } from "@/app/actions/Task";
import { ConfirmationModal } from "@/Components/ConfirmationModal";
import { useConfirmationModal } from "@/context/ConfirmationModal";
import { TaskType } from "@/GlobalTypes";
import { useTaskCompletion } from "@/Hooks/useTaskCompletion";
import { taskDB } from "@/lib/Ind/db";
import { getFormattedTimeLeft } from "@/utils/getDaysRemaining";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaCheckCircle, FaUserEdit } from "react-icons/fa";
import { FaFlag, FaRegCircleCheck, FaTrash, FaUserCheck } from "react-icons/fa6";
import { GoTasklist } from "react-icons/go";
import { MdEdit, MdOutlineTimerOff, MdRunningWithErrors, MdTimer } from "react-icons/md";
import { RiMapPinTimeFill } from "react-icons/ri";
import { SlOptionsVertical } from "react-icons/sl";
import { toast } from "sonner";
import { mutate } from "swr";


const DropDownOptions = ({ setIsConfirmationModalOpen }: { setIsConfirmationModalOpen: (isOpen: boolean) => void }) => {
    
    const Options = [{ label: "Edit", icon: MdEdit }, { label: "Delete", icon: FaTrash }]
    return (
        <ul
            className="absolute right-1 top-full z-30 w-full max-w-[160px]
                p-1.5 bg-neutral-900 shadow-lg rounded-lg border border-neutral-700/60"
        >
            {Options.map((opt, idx) => {
                return (
                    <li
                        key={idx}
                        role="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            if(opt.label.toLocaleLowerCase() === "delete"){
                                setIsConfirmationModalOpen(true);
                            }
                        }}
                        className="w-full justify-start flex items-center gap-1.5 py-1 px-3 
                            text-neutral-400 hover:text-neutral-100 cursor-pointer hover:bg-neutral-800 text-sm"
                    >
                        <opt.icon size={14}/>
                        <h1>
                            {opt.label}
                        </h1>
                    </li>
                )
            })}
        </ul>
    )
}
export function TaskCard({ id: taskId, tasks, status, assigned_to, due_date, due_time, priority, created_by }: TaskType){
    const DropDownOptionRef = useRef<HTMLDivElement | null>(null);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    useEffect(() => {
        const HideDropDownOptions = (e: MouseEvent) => {
            if(DropDownOptionRef.current && !DropDownOptionRef.current.contains(e.target as Node)){
                setIsOptionsOpen(false);
            }
        }
        window.addEventListener('mousedown', HideDropDownOptions)
        return () => window.removeEventListener('mousedown', HideDropDownOptions);
    },[])

    const timeMetrics = useMemo(() => {
      if (!due_date) return null;
      // We pass currentTime to trigger the re-calculation
      return getFormattedTimeLeft(due_date, due_time);
    }, [due_date, due_time]);
  
      const is_Over_Due = timeMetrics?.toLowerCase() === "overdue";

    const { taskList, toggleTask, progress, cardStatus, isLocked } = useTaskCompletion(taskId, tasks, status);
    const { setIsConfirmationModalOpen } = useConfirmationModal();
    const [isLoadingDeleteTask, setIsLoadingDeleteTask] = useState(false);
    


    const handleDeleteTask = async (taskId: string) => {
        try {
            setIsLoadingDeleteTask(true);

            await taskDB.deleteTask(taskId);
            mutate('local-tasks-key');
            toast.success("Task deleted from local storage");
            
            if (typeof setIsConfirmationModalOpen === "function") {
                setIsConfirmationModalOpen(false);
            }

        } catch (err) {
            console.error("Delete Error:", err);
            toast.error("Failed to delete task locally");
        } finally {
            setIsLoadingDeleteTask(false);
        }
    };
    return (
        <div
            className={`w-full min-w-[250px] h-max rounded-lg border px-3 py-2
                ${is_Over_Due ? 
                    "border-red-700/60 bg-red-800/10"
                    :
                    isLocked ? "border-green-700/60 bg-green-800/10"
                    :
                    "border-neutral-700/60 bg-section-h"}`}
        >
            <ConfirmationModal
                HandelConfirmModal={() => handleDeleteTask(taskId)}
                Title={`are you sure to delete this Task Card ?`}
                ConfirmButtonLabel="Delete"
                isLoadingConfirmation={isLoadingDeleteTask}
            />
            <div
                className="relative w-full flex items-center justify-between"
            >
                <span
                    className="flex items-center gap-1.5"
                >
                    <GoTasklist className="w-6 h-6 text-neutral-400" />
                    <h1 className="text-md capitalize text-neutral-300">Task Item</h1>
                </span>

                <div ref={DropDownOptionRef}>
                    <button
                    onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                >
                    <SlOptionsVertical className="w-4 h-4 cursor-pointer text-neutral-400 hover:text-neutral-200"/>
                </button>

                {isOptionsOpen && (
                    <DropDownOptions setIsConfirmationModalOpen={setIsConfirmationModalOpen} />
                )}
                </div>
            </div>

            {/* --- PROGRESS --- */}
            <div
                className="text-xs text-neutral-400 mt-1.5 rounded-full px-1 py-0.5 border border-neutral-700/60 flex items-center gap-1.5"
            >
                {isLocked ?
                    <FaCheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0"/>
                    :
                    <FaRegCircleCheck className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0"/>
                }
                <span className="flex gap-1 items-center flex-nowrap">
                    <p>{taskList.filter(t => t.completed).length}</p>
                    of
                    <p>
                        {taskList.length}
                    </p>
                </span>
                <div
                    className="relative h-2 w-full rounded-full bg-neutral-700/60 overflow-hidden"
                >
                    <span 
                        style={{ width: `${progress}%` }}
                        className="absolute left-0 top-0 h-full bg-green-500"
                    />
                </div>
                <h2>{Math.floor(progress)}%</h2>
            </div>

            {/* --- TASKS --- */}
            <div className="pl-3">
                <ul className="space-y-2 py-3">
                    {taskList.map((task, idx) => {
                    const isLast = idx === taskList.length - 1;

                    return (
                        <li 
                            key={idx} 
                            role="button" 
                            aria-disabled={isLocked || is_Over_Due}
                            onClick={() => toggleTask(idx)} 
                            className="relative cursor-pointer hover:text-neutral-300
                                flex gap-2 capitalize aria-disabled:cursor-not-allowed">
                            {/* Timeline */}
                            <div className="relative flex flex-col items-center">
                                {/* Icon */}
                                {is_Over_Due ?  
                                <MdRunningWithErrors className="z-10 mt-1 h-3.5 w-3.5 text-neutral-200 flex-shrink-0"/>
                                :
                                !isLocked ?
                               <FaRegCircleCheck className="z-10 mt-1 h-3.5 w-3.5 text-neutral-200 flex-shrink-0"/>
                               :
                               <FaCheckCircle
                                    className="z-10 mt-1 h-3.5 w-3.5 text-green-500 flex-shrink-0"
                                />
                                }

                                {/* Connector */}
                                {!isLast && (
                                <span className="absolute top-5 bottom-0 w-px bg-neutral-700/70 rounded-full" />
                                )}
                            </div>

                            {/* Content */}
                            <p
                                className={`text-sm leading-5
                                    ${isLocked ? 
                                        "line-through text-neutral-300"
                                        :
                                        "text-neutral-100"}
                                    `}
                                title={task.text}
                            >
                                {task.text}
                            </p>
                        </li>
                    );
                    })}
                </ul>
            </div>

            <span className="flex mb-1.5 w-full h-px bg-neutral-700/60"/>

            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <span
                        className="flex items-center gap-3 text-neutral-400 text-xs"
                    >
                        <FaFlag size={12}/>
                        Priority
                    </span>
                    <p className={`capitalize text-xs font-[400]
                        ${priority === "low" ?
                            "text-green-600"
                            :
                            priority === "medium" ?
                            "text-yellow-600"
                            :
                            "text-red-600"
                        }`}>{priority}</p>
                </div>
                <div className="flex items-center justify-between">
                    <span
                        className="flex items-center gap-3 text-neutral-400 text-xs"
                    >
                        <RiMapPinTimeFill size={12}/>
                        Status
                    </span>
                    <p className={`capitalize text-xs font-[400] 
                    ${is_Over_Due ?
                        "text-red-500"
                        :
                        cardStatus === "pending" ?
                        "text-yellow-600"
                        :
                        cardStatus === "completed" ?
                        "text-green-600"
                        :
                        "text-gray-600"
                    }`}>{is_Over_Due ? "Overdue" : cardStatus}</p>
                </div>

                <div className="flex items-center justify-between">
                    <span
                        className="flex items-center gap-3 text-neutral-400 text-xs"
                    >
                        {is_Over_Due ? 
                            <MdOutlineTimerOff size={12}/>
                        :
                            <MdTimer size={12}/>
                        }
                        Due Time
                    </span>
                    <p className={`capitalize text-xs font-[400] 
                    ${is_Over_Due ?
                        "text-red-500"
                        :
                        cardStatus === "pending" ?
                        "text-yellow-600"
                        :
                        cardStatus === "completed" ?
                        "text-green-600"
                        :
                        "text-gray-600"
                    }`}>{is_Over_Due ? "--" : timeMetrics}</p>
                </div>

                <span className="flex w-full h-px bg-neutral-700/60"/>

                <div className="text-nowrap flex items-center gap-1.5 text-neutral-400 text-xs">
                        <span className="p-0.5 rounded border border-neutral-700/60 text-white bg-neutral-800">
                            <FaUserCheck size={12}/>
                        </span>
                        Assined to : <p className="text-neutral-200 truncate">{assigned_to}</p>
                </div>
                <div className="text-nowrap flex items-center gap-1.5 text-neutral-400 text-xs">
                        <span className="p-0.5 rounded border border-neutral-700/60 text-white bg-neutral-800">
                            <FaUserEdit size={12}/>
                        </span>
                        Created by : <p className="text-neutral-200 truncate">{created_by}</p>
                </div> 
            </div>
        </div>
    )
}