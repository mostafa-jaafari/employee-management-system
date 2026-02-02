"use client";
import { TaskType } from "@/GlobalTypes";
import { FaRegCircleCheck } from "react-icons/fa6";
import { GoTasklist } from "react-icons/go";
import { SlOptionsVertical } from "react-icons/sl";


export function TaskCard({ tasks, status, assigned_to, created_by, due_date, due_time, priority, created_at }: TaskType){
    const PROGRESS_TEST = 76.5863578;
    const Created_Data = new Date(created_at).toISOString().split("T")[0]
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
                    <p>3</p>
                    of
                    <p>4</p>
                </span>
                <div
                    className="relative h-2 w-full rounded-full bg-neutral-700/60 overflow-hidden"
                >
                    <span 
                        style={{ width: `${PROGRESS_TEST}%` }}
                        className="absolute left-0 top-0 h-full bg-green-500"
                    />
                </div>
                <h2>{Math.floor(PROGRESS_TEST)}%</h2>
            </div>
        </div>
    )
}