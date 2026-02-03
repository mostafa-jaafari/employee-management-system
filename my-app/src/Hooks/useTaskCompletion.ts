"use client";
import { useEffect, useMemo, useState } from "react";

type TaskItem = { text: string; completed: boolean };

export function useTaskCompletion(
  taskId: string,
  tasks: TaskItem[],
  initialStatus: string
) {
  const storageKey = `task-progress-${taskId}`;

  const [isLocked, setIsLocked] = useState(initialStatus === "completed");

  const [taskList, setTaskList] = useState<TaskItem[]>(() => {
    if (typeof window === "undefined") return tasks;

    const stored = localStorage.getItem(storageKey);
    try {
      const parsed = stored ? JSON.parse(stored) : null;
      // إذا الـ tasks الجديدة مختلفة عن ما في storage، نستخدم الجديدة
      if (parsed && Array.isArray(parsed) && parsed.length === tasks.length) {
        return parsed;
      }
      return tasks;
    } catch {
      return tasks;
    }
  });

  const [cardStatus, setCardStatus] = useState(initialStatus);

  const toggleTask = (index: number) => {
    if (isLocked) return;

    setTaskList(prev =>
      prev.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  useEffect(() => {
    if (isLocked) return;
    localStorage.setItem(storageKey, JSON.stringify(taskList));
  }, [taskList, isLocked, storageKey]);

  useEffect(() => {
    if (isLocked || taskList.length === 0) return;

    const allCompleted = taskList.every(t => t.completed);
    if (!allCompleted) return;

    (async () => {
      const { updateTaskStatusInDB } = await import("@/app/actions/Task");
      await updateTaskStatusInDB(taskId, taskList, "completed");

      localStorage.removeItem(storageKey);
      setCardStatus("completed");
      setIsLocked(true);
    })();
  }, [taskList, isLocked, taskId, storageKey]);

  const progress = useMemo(() => {
    if (taskList.length === 0) return 0;
    const completed = taskList.filter(t => t.completed).length;
    return Math.round((completed / taskList.length) * 100);
  }, [taskList]);

  // إذا تغيرت prop tasks (مثل عند إنشاء مهمة جديدة)، نحدث taskList مباشرة
  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  return {
    taskList,
    toggleTask,
    progress,
    cardStatus,
    isLocked,
  };
}
