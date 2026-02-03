"use client";
import { useUserInfos } from "@/context/UserInfos";
import { TaskType } from "@/GlobalTypes";
import { useTaskCompletion } from "@/Hooks/useTaskCompletion";
import { getFormattedTimeLeft } from "@/utils/getDaysRemaining";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaCheckCircle, FaUserEdit } from "react-icons/fa";
import { FaFlag, FaRegCircleCheck, FaTrash, FaUserCheck } from "react-icons/fa6";
import { FiClock } from "react-icons/fi";
import { GoTasklist } from "react-icons/go";
import { MdEdit } from "react-icons/md";
import { RxLapTimer } from "react-icons/rx";
import { SlOptionsVertical } from "react-icons/sl";


const DropDownOptions = () => {
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
export function TaskCard({ id: taskId, tasks, status, assigned_to, due_date, due_time, priority }: TaskType){
    const DropDownOptionRef = useRef<HTMLButtonElement | null>(null);
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

    const { taskList, toggleTask, progress, cardStatus, isLocked } = useTaskCompletion(taskId, tasks, status);
    const { userInfos } = useUserInfos();
    const Created_By = userInfos?.email;

  const timeMetrics = useMemo(() => {
    if (!due_date) return null;
    // We pass currentTime to trigger the re-calculation
    return getFormattedTimeLeft(due_date, due_time);
  }, [due_date, due_time]);


    return (
        <div
            className={`w-full min-w-[250px] h-max rounded-lg border
                px-3 py-2`}
        >
            {JSON.stringify(due_date + " / " + due_time)}
            <div
                className="relative w-full flex items-center justify-between"
            >
                <span
                    className="flex items-center gap-1.5"
                >
                    <GoTasklist className="w-8 h-8 text-neutral-400" />
                    <h1 className="text-lg capitalize">Task Item</h1>
                </span>

                <button
                    ref={DropDownOptionRef}
                    onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                >
                    <SlOptionsVertical className="w-4 h-4 cursor-pointer text-neutral-400 hover:text-neutral-200"/>
                </button>

                {isOptionsOpen && (
                    <DropDownOptions />
                )}
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
                            aria-disabled={isLocked}
                            onClick={() => toggleTask(idx)} 
                            className="relative cursor-pointer hover:text-neutral-300
                                flex gap-2 capitalize aria-disabled:cursor-not-allowed">
                            {/* Timeline */}
                            <div className="relative flex flex-col items-center">
                                {/* Icon */}
                                {!isLocked ?
                               <FaRegCircleCheck className="z-10 mt-1 h-3 w-3 text-neutral-200 flex-shrink-0"/>
                               :
                               <FaCheckCircle
                                    className="z-10 mt-1 h-3 w-3 text-green-500 flex-shrink-0"
                                />
                                }

                                {/* Connector */}
                                {!isLast && (
                                <span className="absolute top-5 bottom-0 w-px bg-neutral-700/70 rounded-full" />
                                )}
                            </div>

                            {/* Content */}
                            <p
                                className={`text-xs leading-5
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
                        <RxLapTimer size={12}/>
                        Status
                    </span>
                    <p className={`capitalize text-xs font-[400] 
                    ${cardStatus === "pending" ?
                        "text-yellow-600"
                        :
                        cardStatus === "completed" ?
                        "text-green-600"
                        :
                        "text-gray-600"
                    }`}>{cardStatus}</p>
                </div>

                 <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border`}>
        <FiClock size={14} />
        <span className="text-[11px] font-bold uppercase">
            {timeMetrics}
        </span>
     </div>

            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-neutral-400">
      
            {/* Assigned To */}
            {assigned_to && (
                <span className="flex items-center gap-1.5 rounded-md border border-neutral-700/40 bg-neutral-800/40 px-2 py-1">
                <FaUserCheck className="h-3.5 w-3.5 text-neutral-300" />
                <span>{assigned_to}</span>
                </span>
            )}

            {/* Created By */}
            {Created_By && (
                <span className="flex items-center gap-1.5 rounded-md border border-neutral-700/40 bg-neutral-800/40 px-2 py-1">
                <FaUserEdit className="h-3.5 w-3.5 text-neutral-400" />
                <span>{Created_By}</span>
                </span>
            )}


            {/* Due Time */}
            {due_time && (
                <span className="grow flex justify-center items-center gap-1.5 rounded-md border border-neutral-700/40 bg-neutral-800/40 px-2 py-1">
                <FiClock className="h-3.5 w-3.5 text-neutral-400" />
                <span>{due_time}</span>
                </span>
            )}
            </div>
        </div>
    )
}