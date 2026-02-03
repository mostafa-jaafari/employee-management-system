"use client";
import { useEffect, useMemo, useState } from "react";


// TYPES
type TaskItem = { text: string; completed: boolean };

// HOOK: useTaskCompletion
export function useTaskCompletion(taskId: string, tasks: TaskItem[], initialStatus: string) {
  const storageKey = `task-progress-${taskId}`;

  const [isLocked, setIsLocked] = useState(initialStatus === "completed");
  const [taskList, setTaskList] = useState<TaskItem[]>(() => {
    if (typeof window === "undefined") return tasks;

    const stored = localStorage.getItem(storageKey);
    try {
      const parsed = stored ? JSON.parse(stored) : null;
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

  // حفظ progress في localStorage
  useEffect(() => {
    if (!isLocked) localStorage.setItem(storageKey, JSON.stringify(taskList));
  }, [taskList, isLocked, storageKey]);

  // تحديث status تلقائي حسب تقدم المهام + إرسال completed إلى DB
  useEffect(() => {
    if (taskList.length === 0) {
    setCardStatus("pending"); // مهمة جديدة دائماً pending أولاً
    return;
  }

    const allCompleted = taskList.every(t => t.completed);
    const anyCompleted = taskList.some(t => t.completed);

    if (allCompleted) setCardStatus("completed");
    else if (anyCompleted) setCardStatus("in progress");
    else setCardStatus("pending");

    if (allCompleted) {
      (async () => {
        const { updateTaskStatusInDB } = await import("@/app/actions/Task");
        await updateTaskStatusInDB(taskId, taskList, "completed");
        localStorage.removeItem(storageKey);
        setIsLocked(true);
      })();
    }
  }, [taskList, isLocked, taskId, storageKey]);

  // إذا تغيرت prop tasks، نحدث taskList مباشرة
  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  const progress = useMemo(() => {
    if (taskList.length === 0) return 0;
    const completed = taskList.filter(t => t.completed).length;
    return Math.round((completed / taskList.length) * 100);
  }, [taskList]);

  return { taskList, toggleTask, progress, cardStatus, isLocked, setCardStatus };
}