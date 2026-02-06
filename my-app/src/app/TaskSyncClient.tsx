"use client";
import { useEffect } from "react";
import { toast } from "sonner";

export function SyncTasksOnExit({ userId }: { userId: string }) {
  const handleSend = async () => {
    const data = {
      // Note: Ensure the 'tasks' column in Supabase is type text[] or jsonb
      tasks: ["test test", "hi"], 
      assigned_to: "mosta@gmail.com",
      due_date: "2026-02-06",
      due_time: "15:03:00",
      priority: "high",
      status: "pending",
      created_by: userId,
      synced: false,
    };
    if(!userId || userId === ""){
        toast.error("User Id not defined")
        return;
    }

    try {
      const response = await fetch("/api/sync-tasks", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        keepalive: true, // This allows the request to finish even if the page closes
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.error?.message || "Failed to sync");
      }

      toast.success("Tasks synced successfully");
    } catch (err) {
      console.error("Sync error:", err);
      toast.error((err as Error).message);
    }
  };

  // If you want it to trigger on exit automatically:
  useEffect(() => {
    const handleExit = () => {
        // We use fetch here too. On exit, we can't 'await' or 'toast'.
        const data = {
            tasks: ["test test", "hi"],
            assigned_to: "mosta@gmail.com",
            due_date: "2026-02-06",
            due_time: "15:03:00",
            priority: "high",
            status: "pending",
            created_by: "mostafajaafari08@gmail.ma",
            synced: false,
        };
        fetch("/api/sync-tasks", {
            method: "POST",
            keepalive: true,
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        });
    };

    window.addEventListener("pagehide", handleExit); // pagehide is more reliable than beforeunload
    return () => window.removeEventListener("pagehide", handleExit);
  }, [userId]);

  return (
    <button 
      onClick={handleSend}
      className="p-2 bg-blue-500 text-white rounded"
    >
      Manual Sync Test
    </button>
  );
}