"use client";
import { DropDown } from "@/Components/DropDown";
import { useAddNewTask } from "@/context/AddNewTaskProvider";
import { useState } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { MdAddTask } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { useTasks } from "@/Hooks/useTasks";
import { TokenUserInfosPayload } from "@/GlobalTypes";
import { syncTasksToSupabase } from "@/utils/scheduleSync";

let syncTimeout: NodeJS.Timeout;
function scheduleSync() {
  // Clear any previously scheduled sync
  clearTimeout(syncTimeout);

  // Schedule a new sync in 10 seconds
  syncTimeout = setTimeout(() => {
    syncTasksToSupabase();
  }, 10000); // 10000ms = 10 seconds
}
export function AddNewTask({ initialEmails, userInfos }: { initialEmails: string[]; userInfos: TokenUserInfosPayload | undefined }){
    const { isOpenAddNewTask, setIsOpenAddNewTask } = useAddNewTask();
    const { addTask } = useTasks();

    const [inputs, setInputs] = useState({
        tasks: [] as string[],
        task: "",
        assigned_to: "",
        due_date: "",
        priority: "",
        due_time: ""
    });

    const HandleChangeInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        })
    }


    const [isLoadingSubmitTask, setIsLoadingSubmitTask] = useState(false);
    const Today = new Date();
    const HandleCreateTask = async () => {
        // 1. التحقق من البيانات
        if (inputs.tasks.length === 0) {
            toast.error("Add at least one task!");
            return;
        }

        try {
            setIsLoadingSubmitTask(true);

            await addTask({
                tasks: inputs.tasks,
                assigned_to: inputs.assigned_to,
                due_date: inputs.due_date,
                due_time: inputs.due_time,
                priority: inputs.priority as "high" | "medium" | "low",
                created_by: userInfos?.email || "Local User",
                synced: false,
            });

            setInputs({
                tasks: [],
                task: "",
                assigned_to: "",
                due_date: "",
                priority: "",
                due_time: ""
            });
            setIsOpenAddNewTask(false);
            
            toast.success("Task saved locally!");
            scheduleSync();
        } catch (err) {
            console.error(err);
            toast.error("Failed to save task");
        } finally {
            setIsLoadingSubmitTask(false);
        }
    };

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
                    {/* --- TASKS --- */}
                    <div>
                        <div
                            className="mb-1.5"
                        >
                            {inputs.tasks.length > 0 ? (
                                <ul
                                    className="w-full max-h-[200px] overflow-auto flex flex-col items-start gap-1"
                                >
                                    {inputs.tasks.map((task, idx) => {
                                        return (
                                            <li
                                                key={idx}
                                                className="w-full flex justify-between items-start pr-3"
                                            >
                                                <div
                                                    className="w-full flex flex-col"
                                                >
                                                    <span
                                                        className="text-[12px] capitalize flex items-start gap-1 text-neutral-400"
                                                    >
                                                        <MdAddTask size={18} className="text-neutral-300"/>
                                                        {task}
                                                    </span>
                                                    {idx !== inputs.tasks.length - 1 && (
                                                        <span className="ml-2 mt-0.5 flex w-[1px] h-4 bg-neutral-500"/>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const Cleaned_Tasks = inputs.tasks.filter((t) => t !== task);
                                                        setInputs({ ...inputs, tasks: Cleaned_Tasks })
                                                    }}
                                                >
                                                    <FaTrash className="w-3 h-3 cursor-pointer text-red-600 hover:text-red-500"/>
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            ) : (
                                <span
                                    className="w-full flex justify-center p-2 border border-dashed border-neutral-700/60 text-sm text-neutral-500"
                                >
                                    Add To Do Tasks to see them here !
                                </span>
                            )}
                        </div>
                        <div
                            className="w-full flex items-end gap-1.5"
                        >

                            <div className="w-full">
                                <label 
                                    className="mb-0.5 text-sm text-neutral-300 w-max hover:text-neutral-200 cursor-pointer"
                                    htmlFor="TaskToDo"
                                >
                                    To Do
                                </label>
                                <input 
                                    type="text"
                                    id="TaskToDo"
                                    name="task"
                                    maxLength={50}
                                    value={inputs.task}
                                    onChange={HandleChangeInputs}
                                    className={`w-full grow outline-none border rounded-lg p-3 text-sm
                                        ${(inputs.tasks.length === 10 && inputs.task.length > 0) ? "bg-yellow-700/10 border-yellow-700 focus:border-yellow-600 hover:border-yellow-600 "
                                            :
                                            "focus:bg-neutral-700/20 border-neutral-700 focus:border-neutral-600 hover:border-neutral-600 "}`}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    if(inputs.tasks.includes(inputs.task)){
                                        toast.info(`${inputs.task} Already exists in your Tasks.`)
                                        return;
                                    }
                                    if(inputs.tasks.length === 10){
                                        toast.info("You can only add up to 10 tasks.")
                                        return;
                                    }
                                    setInputs({
                                        ...inputs,
                                        tasks: [...inputs.tasks, inputs.task], // فقط نص المهمة
                                        task: ""
                                        });
                                }}
                                disabled={inputs.task === "" || inputs.tasks.length === 10}
                                className="w-max cursor-pointer bg-blue-600
                                    hover:bg-blue-700 text-nowrap p-3 text-sm rounded-lg
                                    border border-blue-500
                                    disabled:bg-neutral-700 disabled:border-neutral-600 disabled:cursor-not-allowed disabled:text-neutral-400"
                            >
                                Add To Do
                            </button>
                        </div>
                        {(inputs.tasks.length === 10 && inputs.task.length > 0) && (
                            <span className="text-xs text-yellow-600"> You can only add up to 10 tasks. </span>
                        )}
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
                                isLabelCapitalized={false}
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
                                min={Today.toISOString().split("T")[0]}
                                value={inputs.due_date}
                                onChange={HandleChangeInputs}
                                className="w-full outline-none border border-neutral-700 focus:border-neutral-600 hover:border-neutral-600 focus:bg-neutral-700/20 rounded-lg p-3 text-sm"
                            />
                        </div>
                    </div>

                    <div
                        className="flex items-center gap-1.5"
                    >
                        <div
                            className="w-full flex flex-col"
                        >
                            <label 
                                htmlFor="DueTime"
                                className="mb-0.5 text-sm text-neutral-300 w-max hover:text-neutral-200 cursor-pointer"
                            >
                                Due Time
                            </label>
                            <input
                                id="DueTime"
                                type="time"
                                name="due_time"
                                min={Today.toISOString().split("T")[1]}
                                value={inputs.due_time}
                                onChange={HandleChangeInputs}
                                className="grow outline-none border border-neutral-700 focus:border-neutral-600 hover:border-neutral-600 focus:bg-neutral-700/20 rounded-lg p-3 text-sm"
                            />
                        </div>
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
                                isLabelCapitalized
                                className="w-full min-w-[150px] capitalize border-neutral-600 text-sm p-3 rounded-lg"
                            />
                        </div>
                    </div>

                    <button
                        onClick={HandleCreateTask}
                        disabled={isLoadingSubmitTask || (inputs.due_time === "" || inputs.priority === "" || inputs.tasks.length === 0 || inputs.due_date === "" || inputs.assigned_to === "")}
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