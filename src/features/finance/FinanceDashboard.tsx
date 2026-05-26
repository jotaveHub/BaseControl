import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';

import { Button, Input, Card, Modal } from '../../components/ui';
import { Plus, Trash2, DollarSign, TrendingUp } from 'lucide-react';
import { Button, Card } from '../../components/ui';
import { Trash2, DollarSign } from 'lucide-react';
import { FinanceRecord } from '../../types';

export const FinanceDashboard = () => {
  const { records, deleteRecord } = useFinanceStore();

  const totalValue = records.reduce((acc, rec) => acc + rec.value, 0);


  const revenue30Days = records.reduce((acc, rec) => {
    const recordDate = new Date(rec.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (rec.value > 0 && recordDate >= thirtyDaysAgo) {
      return acc + rec.value;
    }
    return acc;
  }, 0);

  const handleAddRecord = () => {
    if (formState.description && formState.value !== 0) {
      addRecord(formState);
      setFormState({
        date: new Date().toISOString().split('T')[0],
        description: '',
        value: 0,
        product: '',
        paymentMethod: '',
      });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Controle Financeiro</h1>
          <p className="text-gray-500">Gerencie suas entradas e saídas financeiras.</p>
        </div_
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 p-6">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Acumulado</p>
            <p className="text-2xl font-bold text-gray-800">
              R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-6">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Faturamento (30 dias)</p>
            <p className="text-2xl font-bold text-gray-800">
              R$ {revenue30Days.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Produto</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Pagamento</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Valor</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.map((rec) => (
              <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">{rec.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{rec.description}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{rec.product}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{rec.paymentMethod}</td>
                <td className={`px-6 py-4 text-sm font-bold text-right ${rec.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {rec.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => deleteRecord(rec.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Nenhum registro encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
