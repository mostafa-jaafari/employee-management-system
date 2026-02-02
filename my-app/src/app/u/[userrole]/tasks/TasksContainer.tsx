"use client";

import { useUserInfos } from "@/context/UserInfos";
import { useTasks } from "@/Hooks/useTasks";
import { TaskCard } from "./TaskCard";


export function TasksContainer(){
    const { userInfos } = useUserInfos();
    const { tasks } = useTasks(userInfos?.id);
    return (
        <section
            className="w-full grid grid-cols-4 gap-3"
        >
            {tasks.length > 0 ? tasks.map((task, idx) => {
                return (
                    <TaskCard
                        key={idx}
                        title={task.title}
                        description={task.description}
                        assigned_to={task.assigned_to}
                        created_by={task.created_by}
                        due_date={task.due_date}
                        due_time={task.due_time}
                        status={task.status}
                        priority={task.priority}
                        created_at={task.created_at}
                    />
                )
            }) : "no tasks available"}
        </section>
    )
}