import React, { useState } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Button, Input, Card, Modal } from '../../components/ui';
import { Plus, Trash2, DollarSign, TrendingUp } from 'lucide-react';
import { FinanceRecord } from '../../types';

export const FinanceDashboard = () => {
  const { records, addRecord, deleteRecord } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    value: 0,
    product: '',
    paymentMethod: '',
  });

  const totalValue = records.reduce((acc, rec) => acc + rec.value, 0);

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

  const revenue30Days = records.reduce((acc, rec) => {
    const recordDate = new Date(rec.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (rec.value > 0 && recordDate >= thirtyDaysAgo) {
      return acc + rec.value;
    }
    return acc;
  }, 0);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Controle Financeiro</h1>
          <p className="text-gray-500">Gerencie suas entradas e saídas financeiras.</p>
        </div>
<<<<<<< HEAD
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={18} /> Novo Registro
        </Button>
=======
>>>>>>> 0c91d09 (fix(inventory/finance): registrar compras como despesa, normalizar valores e garantir entradas nas vendas)
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={18} /> Novo Registro
        </Button>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Registro Financeiro"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data"
              type="date"
              value={formState.date}
              onChange={(e) => setFormState({ ...formState, date: e.target.value })}
            />
            <Input
              label="Valor (R$)"
              type="number"
              value={formState.value}
              onChange={(e) => setFormState({ ...formState, value: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <Input
            label="Descrição"
            placeholder="Ex: Compra de insumos..."
            value={formState.description}
            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
          />
          <Input
            label="Produto"
            placeholder="Ex: Teclado, Mouse..."
            value={formState.product}
            onChange={(e) => setFormState({ ...formState, product: e.target.value })}
          />
          <Input
            label="Método de Pagamento"
            placeholder="Ex: PIX, Cartão, Boleto..."
            value={formState.paymentMethod}
            onChange={(e) => setFormState({ ...formState, paymentMethod: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddRecord}>
              Salvar Registro
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
