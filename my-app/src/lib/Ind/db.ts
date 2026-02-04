import { openDB } from 'idb';
import { TaskType } from '@/GlobalTypes';

const DB_NAME = 'LocalTaskManager';
const STORE_NAME = 'tasks';

export async function initDB() {
  if (typeof window === 'undefined') return null;
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export const taskDB = {
  // Create
  async add(task: Omit<TaskType, 'id' | 'created_at' | 'status'>) {
    const db = await initDB();
    const newTask: TaskType = {
      ...task,
      id: crypto.randomUUID(), // Generate local unique ID
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    await db?.add(STORE_NAME, newTask);
    return newTask;
  },

  // Read
  async getAll(): Promise<TaskType[]> {
    const db = await initDB();
    if (!db) return [];
    return db.getAll(STORE_NAME);
  },

  // Update
  async update(task: TaskType) {
    const db = await initDB();
    return db?.put(STORE_NAME, task);
  },

  // Delete
  async delete(id: string) {
    const db = await initDB();
    return db?.delete(STORE_NAME, id);
  }
};