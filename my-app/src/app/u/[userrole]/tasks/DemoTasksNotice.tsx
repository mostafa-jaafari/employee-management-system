"use client";

import { useEffect, useState } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { TbAlertTriangle } from "react-icons/tb";


const STORAGE_KEY = "demo-tasks-notice-closed";
export function DemoTasksNotice() {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        if(typeof window === "undefined") return;

        const IsClosed = localStorage.getItem(STORAGE_KEY) === "true";

        if(!IsClosed) {
            setTimeout(() => setIsVisible(true))
        }
    },[])

    const handleClose = () => {
        localStorage.setItem(STORAGE_KEY, "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;
    return (
        <div
            className="my-1.5 w-full bg-yellow-800/20 border border-yellow-700/40 rounded-lg px-3 py-1.5"
        >
            <div
                className="w-full flex items-center justify-between"
            >
                <span
                    className="flex items-center gap-1.5"
                >
                    <TbAlertTriangle size={18} className="text-yellow-500" />
                    <h1
                        className="text-md font-semibold text-yellow-500"
                    >
                        Admin Demo Mode
                    </h1>
                </span>

                <button
                    onClick={handleClose}
                    className="border border-yellow-700/40 rounded bg-yellow-800/20 hover:bg-yellow-800/30 text-yellow-500 hover:text-yellow-400 cursor-pointer"
                >
                    <HiMiniXMark size={20}/>
                </button>
            </div>

            <span
                className="flex flex-col w-full px-6 py-1.5"
            >
                {["You can create, assign, and update task statuses to explore the system.",
                    "Employee records are test entries and cannot log in or interact with tasks."
                    ].map((notice, idx) => (
                        <li
                            key={idx}
                            className="text-yellow-600 text-sm ">
                            {notice}
                        </li>
                    ))}
            </span>
        </div>
    )
}