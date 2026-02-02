"use client";

import { TaskType } from "@/GlobalTypes";


export function TaskCard({ status, assigned_to, created_by, description, due_date, due_time, priority, title, created_at }: TaskType){
    
    const Created_Data = new Date(created_at).toISOString().split("T")[0]
    return (
        <div
            className={`w-full min-w-[250px] h-[200px] rounded-lg border
                ${status === "pending" ? "bg-yellow-800/40 border-yellow-700/60"
                    :
                status === "in progress" ? ""
                    :
                status === "completed" ? ""
                    :
                    "bg-neutral-800/40"}`}
                    >
            <span
                className={`border-b px-3 py-2 flex items-center justify-between
                    ${status === "pending" ? "border-yellow-700/60"
                    :
                status === "in progress" ? ""
                    :
                status === "completed" ? ""
                    :
                    "bg-neutral-800/40"}`}
            >
                <h2
                    className={`text-xs
                        ${status === "pending" ? "text-yellow-500"
                        :
                    status === "in progress" ? ""
                        :
                    status === "completed" ? ""
                        :
                        "bg-neutral-800/40"}`}
                >
                    {Created_Data}
                </h2>
                <p
                    className={`text-xs w-max py-1 px-3 rounded-full
                        ${status === "pending" ? "bg-yellow-800 text-yellow-500"
                        :
                    status === "in progress" ? ""
                        :
                    status === "completed" ? ""
                        :
                        "bg-neutral-800/40"}`}
                >Pending</p>
            </span>
        </div>
    )
}