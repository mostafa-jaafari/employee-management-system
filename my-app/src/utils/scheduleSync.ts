import { taskDB } from "@/lib/Ind/db";

let syncTimeout: NodeJS.Timeout | null = null;

async function syncPendingTasks() {
  const pending = await taskDB.getPendingTasks();
  if (pending.length === 0) return;

  for (const task of pending) {
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      await taskDB.markSynced(task.id);
    } catch (err) {
      console.error('Failed to sync task', task.id, err);
      // keep in queue for retry
    }
  }
}

// Schedule sync with debounce
export function scheduleSync(delay = 5000) {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    syncPendingTasks();
  }, delay);
}

// Sync on window close
window.addEventListener('beforeunload', () => {
  syncPendingTasks();
});
