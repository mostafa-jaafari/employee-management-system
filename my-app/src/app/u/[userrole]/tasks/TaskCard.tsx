"use client";
import { useUserInfos } from "@/context/UserInfos";
import { TaskType } from "@/GlobalTypes";
import { useTaskCompletion } from "@/Hooks/useTaskCompletion";
import { FaCheckCircle, FaUserEdit } from "react-icons/fa";
import { FaFlag, FaRegCircleCheck, FaUserCheck } from "react-icons/fa6";
import { FiCalendar, FiClock } from "react-icons/fi";
import { GoTasklist } from "react-icons/go";
import { RxLapTimer } from "react-icons/rx";
import { SlOptionsVertical } from "react-icons/sl";


export function TaskCard({ tasks, status, assigned_to, due_date, due_time, priority }: TaskType){
    const { taskList, toggleTask, progress, cardStatus } = useTaskCompletion(tasks, status);
        
    const { userInfos } = useUserInfos();
    const Created_By = userInfos?.email;
    return (
        <div
            className="w-full min-w-[250px] h-max rounded-lg border
                px-3 py-2 bg-section-h border border-neutral-700/60"
        >
            <div
                className="w-full flex items-center justify-between"
            >
                <span
                    className="flex items-center gap-1.5"
                >
                    <GoTasklist className="w-8 h-8 text-neutral-400" />
                    <h1 className="text-lg capitalize">Task Item</h1>
                </span>

                <button>
                    <SlOptionsVertical className="w-5 h-5 text-neutral-400 hover:text-neutral-200"/>
                </button>
            </div>

            {/* --- PROGRESS --- */}
            <div
                className="text-sm text-neutral-400 mt-1.5 rounded-full px-1 py-0.5 border border-neutral-700/60 flex items-center gap-1.5"
            >
                <FaRegCircleCheck className="w-4 h-4 text-neutral-400 flex-shrink-0"/>
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
                            role="button" 
                            onClick={() => toggleTask(idx)} 
                            key={idx} 
                            className="relative cursor-pointer hover:text-neutral-300 flex gap-3">
                            {/* Timeline */}
                            <div className="relative flex flex-col items-center">
                                {/* Icon */}
                                <FaCheckCircle
                                className="z-10 mt-0.5 h-3.5 w-3.5 text-neutral-400"
                                />

                                {/* Connector */}
                                {!isLast && (
                                <span className="absolute top-5 bottom-0 w-px bg-neutral-700/70 rounded-full" />
                                )}
                            </div>

                            {/* Content */}
                            <p
                                className={`text-sm hover:text-neutral-300 text-neutral-500 
                                    leading-5
                                    ${task.completed ? "line-through text-neutral-400" : ""}`}
                                title={task.text}
                            >
                                {task.text}
                            </p>
                        </li>
                    );
                    })}
                </ul>
            </div>

            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <span
                        className="flex items-center gap-3 text-neutral-400 text-xs"
                    >
                        <FaFlag size={12}/>
                        Priority
                    </span>
                    <p className={`capitalize text-sm
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
                    <p className={`capitalize font-[500] text-sm ${cardStatus === "pending" ?
                        "text-yellow-600"
                        :
                        cardStatus === "completed" ?
                        "text-green-600"
                        :
                        "text-gray-600"
                    }`}>{cardStatus}</p>
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

            {/* Due Date */}
            {due_date && (
                <span className="grow flex items-center gap-1.5 rounded-md border border-neutral-700/40 bg-neutral-800/40 px-2 py-1">
                <FiCalendar className="h-3.5 w-3.5 text-neutral-400" />
                <span>{due_date}</span>
                </span>
            )}

            {/* Due Time */}
            {due_time && (
                <span className="flex items-center gap-1.5 rounded-md border border-neutral-700/40 bg-neutral-800/40 px-2 py-1">
                <FiClock className="h-3.5 w-3.5 text-neutral-400" />
                <span>{due_time}</span>
                </span>
            )}
            </div>
        </div>
    )
}