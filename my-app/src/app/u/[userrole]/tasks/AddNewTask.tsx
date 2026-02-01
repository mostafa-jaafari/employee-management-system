"use client";
import { DropDown } from "@/Components/DropDown";
import { useAddNewTask } from "@/context/AddNewTaskProvider";
import { useState } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { motion } from "framer-motion";
import { CreateTaskAction } from "@/app/actions/Task";
import { useUserInfos } from "@/context/UserInfos";
import { toast } from "sonner";


export function AddNewTask({ initialEmails }: { initialEmails: string[] }){
    const { isOpenAddNewTask, setIsOpenAddNewTask } = useAddNewTask();
    const { userInfos } = useUserInfos();
    const [inputs, setInputs] = useState({
        title: "",
        description: "",
        assigned_to: "",
        due_date: "",
        priority: "",
        status: ""
    });

    const HandleChangeInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        })
    }


    const [isLoadingSubmitTask, setIsLoadingSubmitTask] = useState(false);
    const HandleCreateTask = async () => {
        if(!userInfos?.id) return null;
        try {
            setIsLoadingSubmitTask(true);
            const formData = new FormData();
            formData.append("title", inputs.title);
            formData.append("description", inputs.description);
            formData.append("assigned_to", inputs.assigned_to);
            formData.append("due_date", inputs.due_date);
            formData.append("priority", inputs.priority);
            formData.append("status", inputs.status);

            const res = await CreateTaskAction(formData, userInfos?.id)
            if(!res.success){
                toast.error(res.message);
                setIsLoadingSubmitTask(false);
                return;
            }
            setIsLoadingSubmitTask(false);
            toast.success(res.success)
        }catch (err){
            toast.error((err as { message: string }).message);
            setIsLoadingSubmitTask(false);
        }
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
                            className="mb-0.5 text-sm text-neutral-300 w-max hover:text-neutral-200 cursor-pointer"
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
                            className="mb-0.5 text-sm text-neutral-300 w-max hover:text-neutral-200 cursor-pointer"
                        >
                            Task Description <span className="text-neutral-400">(optional)</span>
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
                                className="mb-0.5 text-sm text-neutral-300 w-max hover:text-neutral-200 cursor-pointer"
                            >
                                Assined Employee
                            </label>
                            <DropDown
                                HandleSelectOption={(employee) => setInputs({ ...inputs, assigned_to: employee }) }
                                Label="--"
                                Options={initialEmails}
                                selectedLabel={inputs.assigned_to}
                                DefaultAllButton={false}
                                className="w-full min-w-[250px] lowercase border-neutral-600 text-sm p-3 rounded-lg"
                            />
                        </div>

                        <div
                            className="w-full flex flex-col "
                        >
                            <label 
                                htmlFor="DueDate"
                                className="mb-0.5 text-sm text-neutral-300 w-max hover:text-neutral-200 cursor-pointer"
                            >
                                Due Date
                            </label>
                            <input
                                id="DueDate"
                                type="date"
                                name="due_date"
                                value={inputs.due_date}
                                onChange={HandleChangeInputs}
                                className="w-full outline-none border border-neutral-700 focus:border-neutral-600 hover:border-neutral-600 focus:bg-neutral-700/20 rounded-lg p-3 text-sm"
                            />
                        </div>
                    </div>

                    <div
                        className="flex items-center gap-1.5"
                    >
                        {/* --- PRIORITY --- */}
                        <div>
                            <label 
                                className="mb-0.5 text-sm text-neutral-300 w-max hover:text-neutral-200 cursor-pointer"
                            >
                                Priority
                            </label>
                            <DropDown
                                HandleSelectOption={(pre) => setInputs({ ...inputs, priority: pre }) }
                                Label="--"
                                Options={["low", "medium", "high"]}
                                selectedLabel={inputs.priority}
                                DefaultAllButton={false}
                                className="w-full min-w-[250px] lowercase border-neutral-600 text-sm p-3 rounded-lg"
                            />
                        </div>

                        {/* --- STATUS --- */}
                        <div>
                            <label 
                                className="mb-0.5 text-sm text-neutral-300 w-max hover:text-neutral-200 cursor-pointer"
                            >
                                Status
                            </label>
                            <DropDown
                                HandleSelectOption={(stat) => setInputs({ ...inputs, status: stat }) }
                                Label="Pending"
                                Options={["pending", "in progress", "completed"]}
                                selectedLabel={inputs.status}
                                DefaultAllButton={false}
                                className="w-full min-w-[250px] lowercase border-neutral-600 text-sm p-3 rounded-lg"
                            />
                        </div>
                    </div>

                    <button
                        onClick={HandleCreateTask}
                        disabled={isLoadingSubmitTask || (inputs.priority === "" || inputs.title === "" || inputs.due_date === "" || inputs.assigned_to === "")}
                        className="w-full cursor-pointer bg-blue-600 
                            hover:bg-blue-700 p-3 text-sm rounded-lg
                            border border-blue-500
                            disabled:bg-neutral-700 disabled:border-neutral-600 disabled:cursor-not-allowed disabled:text-neutral-400"
                    >
                        {isLoadingSubmitTask ? "Creating Task..." : "Create Task"}
                    </button>
                </div>
            </motion.div>
        </section>
    )
}