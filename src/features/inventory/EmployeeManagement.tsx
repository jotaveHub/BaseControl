import React, { useState } from 'react';
import { useInventoryStore } from '../../store/useInventoryStore';
import { Button, Input, Card, Modal } from '../../components/ui';
import { Plus, Trash2, Users } from 'lucide-react';

export const EmployeeManagement = () => {
  const { employees, addEmployee, deleteEmployee } = useInventoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', role: '' });

  const handleAddEmployee = () => {
    if (formState.name) {
      addEmployee(formState);
      setFormState({ name: '', role: '' });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Funcionários</h1>
          <p className="text-gray-500">Cadastre e gerencie os responsáveis pelas movimentações.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={18} /> Adicionar Funcionário
        </Button>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Cargo/Função</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map(e => (
              <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{e.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{e.role}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => deleteEmployee(e.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-gray-500">Nenhum funcionário cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Funcionário"
      >
        <div className="space-y-4">
          <Input
            label="Nome Completo"
            placeholder="Ex: João Silva"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          />
          <Input
            label="Cargo / Função"
            placeholder="Ex: Almoxarife"
            value={formState.role}
            onChange={(e) => setFormState({ ...formState, role: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddEmployee}>Salvar Funcionário</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
