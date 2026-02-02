"use client";

import { TaskType } from "@/GlobalTypes";
import { GoTasklist } from "react-icons/go";
import { SlOptionsVertical } from "react-icons/sl";


export function TaskCard({ tasks, status, assigned_to, created_by, due_date, due_time, priority, created_at }: TaskType){
    
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
        </div>
    )
}