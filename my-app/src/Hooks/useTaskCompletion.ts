"use client";

import { useEffect, useMemo, useState } from "react";
import { updateTaskStatusInDB } from "@/app/actions/Task";

type TaskItem = { text: string; completed: boolean };

export function useTaskCompletion(
  taskId: string,
  tasks: string[], 
  initialStatus: string,
  is_Over_Due: boolean,
) {
  const storageKey = `task-progress-${taskId}`;

  // 1. Helper to get saved state
  const getSavedTasks = (): TaskItem[] => {
    if (typeof window === "undefined") return tasks.map(t => ({ text: t, completed: false }));
    
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === tasks.length) {
          return parsed;
        }
      } catch (e) { console.error(e); }
    }
    // If DB says completed, all are true, else all false
    return tasks.map(t => ({ text: t, completed: initialStatus === "completed" }));
  };

  // 2. Initialize State
  const [taskList, setTaskList] = useState<TaskItem[]>(getSavedTasks);
  const [isLocked, setIsLocked] = useState(initialStatus === "completed");

  // 3. Sync cardStatus with the loaded data immediately
  const [cardStatus, setCardStatus] = useState(() => {
    const saved = getSavedTasks();
    const anyDone = saved.some(t => t.completed);
    const allDone = saved.every(t => t.completed) && saved.length > 0;

    if (initialStatus === "completed" || allDone) return "completed";
    if (anyDone) return "in progress";
    return initialStatus || "pending";
  });

  // 4. Handle Task Toggling
  const toggleTask = (index: number) => {
    if (isLocked || is_Over_Due) return;
    setTaskList(prev =>
      prev.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // 5. Watch for changes and update Database/LocalStorage
  useEffect(() => {
    if (isLocked) return;

    setTimeout(() => {
    const completedCount = taskList.filter(t => t.completed).length;
    const total = taskList.length;

    if (total === 0) return;

    if (completedCount === total) {
      // 100% Completed
        setCardStatus("completed")
        setIsLocked(true);
        localStorage.removeItem(storageKey);
        updateTaskStatusInDB(taskId, tasks, "completed");
      } else if (completedCount > 0) {
        // In Progress
        setCardStatus("in progress");
        localStorage.setItem(storageKey, JSON.stringify(taskList));
      } else {
        // Pending
        setCardStatus("pending");
        localStorage.setItem(storageKey, JSON.stringify(taskList));
      }
    },0)
  }, [taskList, taskId, storageKey, isLocked, tasks]);

  const progress = useMemo(() => {
    if (taskList.length === 0) return 0;
    const completed = taskList.filter(t => t.completed).length;
    return (completed / taskList.length) * 100;
  }, [taskList]);

  return { taskList, toggleTask, progress, cardStatus, isLocked };
}