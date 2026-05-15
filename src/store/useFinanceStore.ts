import { create } from 'zustand';
import { FinanceRecord } from '../types';

interface FinanceState {
  records: FinanceRecord[];
  addRecord: (record: Omit<FinanceRecord, 'id'>) => void;
  deleteRecord: (id: string) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  records: [
    { id: '1', date: '2026-05-01', description: 'Compra de Teclados', value: 150.00, product: 'Teclado Mecânico', paymentMethod: 'Cartão de Crédito' },
    { id: '2', date: '2026-05-02', description: 'Venda de Monitor', value: 800.00, product: 'Monitor 24"', paymentMethod: 'PIX' },
    { id: '3', date: '2026-05-03', description: 'Assinatura Software', value: 45.00, product: 'SaaS Tool', paymentMethod: 'Boleto' },
  ],
  addRecord: (record) => set((state) => ({
    records: [...state.records, { ...record, id: crypto.randomUUID() }]
  })),
  deleteRecord: (id) => set((state) => ({
    records: state.records.filter(r => r.id !== id)
  })),
}));
