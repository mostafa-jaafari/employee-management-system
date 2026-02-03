"use client";
import { useEffect, useMemo, useState } from "react";
import { updateTaskStatusInDB } from "@/app/actions/Task";

type TaskItem = { text: string; completed: boolean };

export function useTaskCompletion(
  taskId: string,
  tasks: TaskItem[],
  initialStatus: string
) {
  const storageKey = `task-progress-${taskId}`;

  /* ----------------------------------
     State
  ---------------------------------- */

  const [isLocked, setIsLocked] = useState(initialStatus === "completed");

  const [taskList, setTaskList] = useState<TaskItem[]>(() => {
    if (typeof window === "undefined") return tasks;

    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : tasks;
  });

  const [cardStatus, setCardStatus] = useState(initialStatus);

  /* ----------------------------------
     Toggle task (local only)
  ---------------------------------- */

  const toggleTask = (index: number) => {
    if (isLocked) return;

    setTaskList(prev =>
      prev.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  /* ----------------------------------
     Persist progress locally
  ---------------------------------- */

  useEffect(() => {
    if (isLocked) return;
    localStorage.setItem(storageKey, JSON.stringify(taskList));
  }, [taskList, isLocked, storageKey]);

  /* ----------------------------------
     Detect full completion → sync once
  ---------------------------------- */

  useEffect(() => {
    if (isLocked || taskList.length === 0) return;

    const allCompleted = taskList.every(t => t.completed);
    if (!allCompleted) return;

    (async () => {
      await updateTaskStatusInDB(taskId, taskList, "completed");

      localStorage.removeItem(storageKey);
      setCardStatus("completed");
      setIsLocked(true);
    })();
  }, [taskList, isLocked, taskId, storageKey]);

  /* ----------------------------------
     Progress
  ---------------------------------- */

  const progress = useMemo(() => {
    if (taskList.length === 0) return 0;
    const completed = taskList.filter(t => t.completed).length;
    return Math.round((completed / taskList.length) * 100);
  }, [taskList]);

  /* ----------------------------------
     API
  ---------------------------------- */

  return {
    taskList,
    toggleTask,
    progress,
    cardStatus,
    isLocked, // مفيد للـ UI (disable / opacity)
  };
}
