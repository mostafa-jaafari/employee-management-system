import { openDB } from 'idb';
import { TaskType } from '@/GlobalTypes';

const DB_NAME = 'Staffy-Employees-Manager';
const STORE_NAME = 'tasks';
const SYNC_STORE_NAME = 'pending-sync';

export async function initDB() {
  if (typeof window === 'undefined') return null;
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(SYNC_STORE_NAME)) {
        db.createObjectStore(SYNC_STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

// db.ts
export const taskDB = {
  async addTask(task: Omit<TaskType, "id" | "created_at" | "status" | "synced">) {
    const db = await initDB();
    const newTask: TaskType = {
      ...task,
      id: crypto.randomUUID(),
      status: "pending",
      created_at: new Date().toISOString(),
      synced: false, // NEW
    };
    await db?.add(STORE_NAME, newTask);
    return newTask;
  },

  async getAllTasks(): Promise<TaskType[]> {
    const db = await initDB();
    if (!db) return [];
    return db.getAll(STORE_NAME);
  },

  async updateTask(task: TaskType) {
    const db = await initDB();
    return db?.put(STORE_NAME, task);
  },

  async deleteTask(id: string) {
    const db = await initDB();
    return db?.delete(STORE_NAME, id);
  }
};
