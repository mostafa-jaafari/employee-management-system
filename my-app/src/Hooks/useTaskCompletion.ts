"use client";
import { useEffect, useMemo, useState } from "react";
import { taskDB } from "@/lib/Ind/db";

type TaskItem = { text: string; completed: boolean };

export function useTaskCompletion(
  taskId: string,
  tasks: string[], // strings from DB
  initialStatus: string // "pending" | "in progress" | "completed"
) {
  const storageKey = `task-progress-${taskId}`;

  // 1. Logic to determine sub-task states on load
  const getInitialTasks = useMemo((): TaskItem[] => {
    // If DB already says completed, force all sub-tasks to true
    if (initialStatus === "completed") {
      return tasks.map((t) => ({ text: t, completed: true }));
    }

    // Otherwise, check LocalStorage for "In Progress" work
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length === tasks.length) {
            return parsed;
          }
        } catch (e) {
          console.error("LS Parse Error", e);
        }
      }
    }

    // Default: all unchecked
    return tasks.map((t) => ({ text: t, completed: false }));
  }, [initialStatus, tasks, storageKey]);

  const [taskList, setTaskList] = useState<TaskItem[]>(getInitialTasks);

  // 2. Derive status and progress (Reactive)
  const { progress, cardStatus, isLocked } = useMemo(() => {
    const total = taskList.length;
    const completedCount = taskList.filter((t) => t.completed).length;
    const allDone = total > 0 && completedCount === total;

    // Use DB status as base, but upgrade to "in progress" if user clicks something
    let status = initialStatus;
    if (allDone || initialStatus === "completed") {
      status = "completed";
    } else if (completedCount > 0) {
      status = "in progress";
    }

    return {
      progress: total === 0 ? 0 : (completedCount / total) * 100,
      cardStatus: status,
      isLocked: initialStatus === "completed" || allDone,
    };
  }, [taskList, initialStatus]);

  useEffect(() => {
    const syncStatus = async () => {
        const allDone = taskList.every(t => t.completed);
        
        // Find the full task object in IDB to update it
        const allTasks = await taskDB.getAllTasks();
        const currentTask = allTasks.find(t => t.id === taskId);

        if (currentTask) {
            const newStatus = allDone ? "completed" : taskList.some(t => t.completed) ? "in progress" : "pending";
            
            if (currentTask.status !== newStatus) {
                await taskDB.updateTask({ ...currentTask, status: newStatus });
                // Note: You might want to trigger a global mutate('local-tasks-key') 
                // here if you want other components to react to the status change
            }
        }
    };

    syncStatus();
}, [taskList, taskId]);

  // 4. Force reset when switching between different tasks (Fixes the "card info stays" issue)
  useEffect(() => {
    setTimeout(() => setTaskList(getInitialTasks), 0);
  }, [taskId, initialStatus, getInitialTasks]);

  const toggleTask = (index: number) => {
    if (isLocked) return;
    setTaskList((prev) =>
      prev.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return { taskList, toggleTask, progress, cardStatus, isLocked };
}