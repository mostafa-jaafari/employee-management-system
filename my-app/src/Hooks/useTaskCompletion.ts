"use client";
import { useEffect, useState, useMemo } from "react";

const STORAGE_KEY = "task-card-completed";

export function useTaskCompletion(tasks: string[], status: string) {
  // 1️⃣ Tasks state
  const [taskList, setTaskList] = useState(
    tasks.map(text => ({ text, completed: false }))
  );

  // 2️⃣ Status state
  const [cardStatus, setCardStatus] = useState(status);

  // 3️⃣ Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (parsed.tasks) {
        setTimeout(() => setTaskList(parsed.tasks), 0)
      }
      if (parsed.status) {
        setTimeout(() => setCardStatus(parsed.status), 0)
      }
    } catch {}
  }, []);

  // 4️⃣ Persist to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ tasks: taskList, status: cardStatus })
    );
  }, [taskList, cardStatus]);

  // 5️⃣ Toggle single task
  const toggleTask = (index: number) => {
    setTaskList(prev =>
      prev.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // 6️⃣ Progress calculation
  const progress = useMemo(() => {
    if (taskList.length === 0) return 0;
    const completedCount = taskList.filter(t => t.completed).length;
    return Math.round((completedCount / taskList.length) * 100);
  }, [taskList]);

  // 7️⃣ Auto-complete status
  useEffect(() => {
    if (taskList.length === 0) return;

    const allCompleted = taskList.every(t => t.completed);

    if (allCompleted && cardStatus !== "completed") {
      (async () => {
        await new Promise(res => setTimeout(res, 300));
        setCardStatus("completed");
      })();
    } else if (!allCompleted && cardStatus === "completed") {
        setTimeout(() => setCardStatus("pending"), 0)
    }
  }, [taskList, cardStatus]);

  return { taskList, toggleTask, progress, cardStatus, setCardStatus };
}
