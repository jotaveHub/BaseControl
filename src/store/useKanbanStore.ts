import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStatus } from '../types';

interface KanbanState {
  tasks: Task[];
  addTask: (content: string) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  deleteTask: (id: string) => void;
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (content) => set((state) => ({
        tasks: [...state.tasks, { id: crypto.randomUUID(), content, status: 'todo' }]
      })),
      moveTask: (id, newStatus) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, status: newStatus } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
    }),
    {
      name: 'kanban-storage',
    }
  )
);
