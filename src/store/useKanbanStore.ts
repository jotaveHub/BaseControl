import { create } from 'zustand';
import { Task, TaskStatus } from '../types';

interface KanbanState {
  tasks: Task[];
  addTask: (content: string) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  deleteTask: (id: string) => void;
}

export const useKanbanStore = create<KanbanState>((set) => ({
  tasks: [
    { id: '1', content: 'Configurar ambiente de desenvolvimento', status: 'done' },
    { id: '2', content: 'Implementar estrutura básica do layout', status: 'done' },
    { id: '3', content: 'Desenvolver quadro Kanban', status: 'doing' },
    { id: '4', content: 'Criar módulo financeiro', status: 'todo' },
    { id: '5', content: 'Implementar controle de estoque', status: 'todo' },
  ],
  addTask: (content) => set((state) => ({
    tasks: [...state.tasks, { id: crypto.randomUUID(), content, status: 'todo' }]
  })),
  moveTask: (id, newStatus) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, status: newStatus } : t)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  })),
}));
