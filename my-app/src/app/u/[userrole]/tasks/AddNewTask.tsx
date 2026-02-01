"use client";
import { DropDown } from "@/Components/DropDown";
import { useAddNewTask } from "@/context/AddNewTaskProvider";
import { useState } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { motion } from "framer-motion";


export function AddNewTask(){
    const { isOpenAddNewTask, setIsOpenAddNewTask } = useAddNewTask();
    const [inputs, setInputs] = useState({
        title: "",
        description: "",
        assignedEmployee: "",
        dueDate: ""
    });

    const HandleChangeInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        })
    }
    if(!isOpenAddNewTask) return null;
    return (
        <section
            className="fixed left-0 top-0 z-50 w-full h-screen bg-black/20 
                backdrop-blur-[1px] flex flex-col items-center justify-center"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="w-full max-w-[550px] bg-neutral-800 rounded-lg border border-neutral-700/60 shadow-lg min-h-80"
            >
                {/* --- TASK HEADER --- */}
                <div
                    className="flex items-center justify-between px-6 py-3 border-b border-neutral-700/60"
                >
                    <h1
                        className="capitalize text-sm"
                    >
                        Add New Task
                    </h1>
                    <button
                        onClick={() => setIsOpenAddNewTask(false)}
                        className="text-neutral-400 hover:text-neutral-100 cursor-pointer"
                    >
                        <HiMiniXMark size={22}/>
                    </button>
                </div>

                {/* --- TASK BODY --- */}
                <div
                    className="pt-3 pb-6 px-6 space-y-3"
                >
                    {/* --- TASK TITLE --- */}
                    <div
                        className="flex flex-col "
                    >
                        <label 
                            htmlFor="TaskTitle"
                            className="mb-0.5 text-sm text-neutral-300 hover:text-neutral-200 cursor-pointer"
                        >
                            Task Title
                        </label>
                        <input 
                            type="text"
                            id="TaskTitle"
                            name="title"
                            value={inputs.title}
                            onChange={HandleChangeInputs}
                            placeholder="Task Title"
                            className="placeholder:font-[300] outline-none border border-neutral-700 focus:border-neutral-600 hover:border-neutral-600 focus:bg-neutral-700/20 rounded-lg p-3 text-sm"
                        />
                    </div>
                    {/* --- TASK DESCRIPTION --- */}
                    <div
                        className="flex flex-col "
                    >
                        <label 
                            htmlFor="TaskDescription"
                            className="mb-0.5 text-sm text-neutral-300 hover:text-neutral-200 cursor-pointer"
                        >
                            Task Description
                        </label>
                        <textarea
                            id="TaskDescription"
                            name="description"
                            value={inputs.description}
                            onChange={HandleChangeInputs}
                            placeholder="Task Description"
                            className="placeholder:font-[300] outline-none resize-none min-h-20 border border-neutral-700 focus:border-neutral-600 hover:border-neutral-600 focus:bg-neutral-700/20 rounded-lg p-3 text-sm"
                        />
                    </div>
                    {/* --- TASK EMPLOYEE FOR --- */}
                    <div
                        className="flex items-center gap-1.5"
                    >
                        <div>
                            <label 
                                className="mb-0.5 text-sm text-neutral-300 hover:text-neutral-200 cursor-pointer"
                            >
                                Task Description
                            </label>
                            <DropDown
                                HandleSelectOption={(employee) => setInputs({ ...inputs, assignedEmployee: employee }) }
                                Label="Assined Employee"
                                Options={["jaafarimostafa081@gmail.com", "fakec5563@gmail.com"]}
                                selectedLabel={inputs.assignedEmployee}
                                DefaultAllButton={false}
                                className="w-full min-w-[250px] lowercase border-neutral-600 text-sm p-3 rounded-lg"
                            />
                        </div>

                        <div
                            className="w-full flex flex-col "
                        >
                            <label 
                                htmlFor="DueDate"
                                className="mb-0.5 text-sm text-neutral-300 hover:text-neutral-200 cursor-pointer"
                            >
                                Task Due Date
                            </label>
                            <input
                                id="DueDate"
                                type="date"
                                name="dueDate"
                                value={inputs.dueDate}
                                onChange={HandleChangeInputs}
                                className="w-full outline-none border border-neutral-700 focus:border-neutral-600 hover:border-neutral-600 focus:bg-neutral-700/20 rounded-lg p-3 text-sm"
                            />
                        </div>
                    </div>

                    <button
                        className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 p-3 text-sm rounded-lg"
                    >
                        Create Task
                    </button>
                </div>
            </motion.div>
        </section>
    )
}