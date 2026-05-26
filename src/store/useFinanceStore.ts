import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FinanceRecord } from '../types';

interface FinanceState {
  records: FinanceRecord[];
  addRecord: (record: Omit<FinanceRecord, 'id'>) => void;
  deleteRecord: (id: string) => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (record) => set((state) => ({
        records: [...state.records, { ...record, id: crypto.randomUUID() }]
      })),
      deleteRecord: (id) => set((state) => ({
        records: state.records.filter(r => r.id !== id)
      })),
    }),
    {
      name: 'finance-storage',
    }
  )
);
