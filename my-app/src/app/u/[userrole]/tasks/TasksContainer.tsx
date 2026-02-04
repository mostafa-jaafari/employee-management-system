"use client";
import { useEffect, useState } from "react";
import { useTasks } from "@/Hooks/useTasks";
import { TaskCard } from "./TaskCard";

export function TasksContainer() {
    const { tasks, isLoading } = useTasks();
    const [hasMounted, setHasMounted] = useState(false);

    // Ensure component is mounted on client before rendering IndexedDB data
    useEffect(() => {
        setTimeout(() => setHasMounted(true),0);
    }, []);

    if (!hasMounted) {
        return <div className="p-10 text-neutral-500">Loading workspace...</div>;
    }

    if (isLoading && tasks.length === 0) {
        return <div className="p-10 text-neutral-500">Syncing tasks...</div>;
    }

    return (
        <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        {...task}
                    />
                ))
            ) : (
                <div className="col-span-full py-20 text-center border border-dashed border-neutral-800 rounded-xl text-neutral-500">
                    No tasks available in your feed.
                </div>
            )}
        </section>
    );
}