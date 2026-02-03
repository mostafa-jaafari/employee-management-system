"use client";
import { useEffect, useState, useMemo } from "react";
import { updateTaskStatusInDB } from "@/app/actions/Task";

export function useTaskCompletion(taskId: string, tasks: string[], status: string) {
  // تحويل كل مهمة إلى { text, completed }
  const [taskList, setTaskList] = useState(
    Array.isArray(tasks) && tasks.length > 0
        ? tasks.map(task => {
            if (typeof task === "string") {
              return { text: task, completed: false }; // إذا كان مجرد نص
            }
            if (typeof task === "object" && task !== null && "text" in task && typeof (task as Record<string, unknown>).text === "string") {
              return { text: (task as Record<string, unknown>).text as string, completed: ((task as Record<string, unknown>).completed as boolean) ?? false }; // إذا جاء من DB
            }
            return { text: JSON.stringify(task), completed: false }; // fallback safety
          })
        : []
    );

  const [cardStatus, setCardStatus] = useState(status);

  // Toggle task
  const toggleTask = (index: number) => {
    setTaskList(prev => {
      const updated = prev.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      );
      return updated;
    });
  };

  // Progress
  const progress = useMemo(() => {
    if (taskList.length === 0) return 0;
    const completedCount = taskList.filter(t => t.completed).length;
    return Math.round((completedCount / taskList.length) * 100);
  }, [taskList]);

  // Auto-update status and DB
  useEffect(() => {
    if (taskList.length === 0) return;

    const allCompleted = taskList.every(t => t.completed);
    const newStatus = allCompleted ? "completed" : "pending";

    if (newStatus !== cardStatus) {
      (async () => {
        setCardStatus(newStatus);
        await updateTaskStatusInDB(taskId, taskList, newStatus);
      })();
    }
  }, [taskList, cardStatus, taskId]);

  return { taskList, toggleTask, progress, cardStatus };
}
