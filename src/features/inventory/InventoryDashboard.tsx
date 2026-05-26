import React, { useState } from 'react';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Button, Input, Card, Modal, cn } from '../../components/ui';
import { Plus, Trash2 } from 'lucide-react';
import { MovementType } from '../../types';

export const InventoryDashboard = () => {
  const { products, movements, employees, addProduct, deleteProduct, addMovement, deleteMovement } = useInventoryStore();
  const { addRecord, deleteRecord } = useFinanceStore();
  const [activeTab, setActiveTab] = useState<'products' | 'movements'>('products');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

  const [productForm, setProductForm] = useState({ code: '', name: '', cost: '', sellingPrice: '', stock: '' });
  const [movementForm, setMovementForm] = useState({
    productId: '',
    date: new Date().toISOString().split('T')[0],
    type: 'purchase' as MovementType,
    quantity: '',
    employeeId: employees[0]?.id || '',
    paymentMethod: 'PIX',
  });

  const handleAddProduct = () => {
    if (productForm.name && productForm.code) {
      const cost = Math.max(0, parseFloat(productForm.cost) || 0);
      const sellingPrice = Math.max(0, parseFloat(productForm.sellingPrice) || 0);
      const stock = Math.max(0, parseInt(productForm.stock) || 0);

      addProduct({
        ...productForm,
        cost,
        sellingPrice,
        stock
      });
      setProductForm({ code: '', name: '', cost: '', sellingPrice: '', stock: '' });
      setIsProductModalOpen(false);
    }
  };

  const handleAddMovement = () => {
    const quantity = parseInt(movementForm.quantity) || 0;
    if (movementForm.productId && quantity !== 0) {
      const { paymentMethod, quantity: _, ...movementData } = movementForm;

      const movementId = crypto.randomUUID();
      addMovement({ ...movementData, quantity, id: movementId as any });

      const product = products.find(p => p.id === movementForm.productId);
      if (product) {
        if (movementForm.type === 'sale') {
          const sellingPrice = Number(product.sellingPrice) || 0;
          const totalValue = sellingPrice * quantity;
          addRecord({
            date: movementForm.date,
            description: `Venda - ${product.name} (x${quantity})`,
            value: totalValue,
            product: product.name,
            paymentMethod: movementForm.paymentMethod,
            movementId: movementId,
          });
        } else if (movementForm.type === 'purchase') {
          const cost = Number(product.cost) || 0;
          const totalValue = cost * quantity;
          addRecord({
            date: movementForm.date,
            description: `Compra - ${product.name} (x${quantity})`,
            value: -totalValue,
            product: product.name,
            paymentMethod: 'A definir',
            movementId: movementId,
          });
        }
      }

      setMovementForm({
        productId: '',
        date: new Date().toISOString().split('T')[0],
        type: 'purchase',
        quantity: '',
        employeeId: employees[0]?.id || '',
        paymentMethod: 'PIX',
      });
      setIsMovementModalOpen(false);
    }
  };

  const handleDeleteMovement = (movementId: string) => {
    const movement = movements.find(m => m.id === movementId);
    if (movement && (movement.type === 'sale' || movement.type === 'purchase')) {
      const { records } = useFinanceStore.getState();
      const record = records.find(r => r.movementId === movementId);
      if (record) {
        deleteRecord(record.id);
      }
    }
    deleteMovement(movementId);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Controle de Estoque</h1>
          <p className="text-gray-500">Gestão de produtos e movimentações de inventário.</p>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-gray-200 w-fit rounded-lg">
        <button
          onClick={() => setActiveTab('products')}
          className={cn(
            'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
            activeTab === 'products' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          )}
        >
          Produtos
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={cn(
            'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
            activeTab === 'movements' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          )}
        >
          Movimentações
        </button>
      </div>

      {activeTab === 'products' ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setIsProductModalOpen(true)} className="flex items-center gap-2">
              <Plus size={18} /> Novo Produto
            </Button>
          </div>
          <Card className="overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Estoque</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Custo (R$)</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Venda (R$)</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{p.code}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{p.name}</td>
                    <td className="px-6 py-4 text-sm text-center font-bold text-gray-800">{p.stock}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">R$ {p.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 text-sm font-bold text-right text-green-600">R$ {p.sellingPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => deleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setIsMovementModalOpen(true)} className="flex items-center gap-2">
              <Plus size={18} /> Registrar Movimentação
            </Button>
          </div>
          <Card className="overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Qtd</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Responsável</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {movements.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{m.date}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {products.find(p => p.id === m.productId)?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        m.type === 'purchase' ? 'bg-green-100 text-green-700' :
                        m.type === 'sale' ? 'bg-blue-100 text-blue-700' :
                        m.type === 'return' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      )}>
                        {m.type === 'purchase' ? 'Compra' : m.type === 'sale' ? 'Venda' : m.type === 'return' ? 'Devolução' : 'Ajuste'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-800 font-bold">{m.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {employees.find(e => e.id === m.employeeId)?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleDeleteMovement(m.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title="Novo Produto">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Código Identificador" placeholder="Ex: PROD001" value={productForm.code}
              onChange={(e) => setProductForm({ ...productForm, code: e.target.value })} />
            <Input label="Nome do Produto" placeholder="Ex: Teclado Mecânico" value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Valor de Custo (R$)" type="number" min="0" value={productForm.cost}
              onChange={(e) => setProductForm({ ...productForm, cost: e.target.value })} />
            <Input label="Preço de Venda (R$)" type="number" min="0" value={productForm.sellingPrice}
              onChange={(e) => setProductForm({ ...productForm, sellingPrice: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Input label="Estoque Inicial" type="number" min="0" value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsProductModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddProduct}>Salvar Produto</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isMovementModalOpen} onClose={() => setIsMovementModalOpen(false)} title="Registrar Movimentação">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-gray-700">Produto</label>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={movementForm.productId}
                onChange={(e) => setMovementForm({ ...movementForm, productId: e.target.value })}
              >
                <option value="">Selecione um produto</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <Input label="Data" type="date" value={movementForm.date}
              onChange={(e) => setMovementForm({ ...movementForm, date: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-gray-700">Tipo de Movimento</label>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={movementForm.type}
                onChange={(e) => setMovementForm({ ...movementForm, type: e.target.value as MovementType })}
              >
                <option value="purchase">Compra (Entrada)</option>
                <option value="sale">Venda (Saída)</option>
                <option value="return">Devolução</option>
                <option value="adjustment">Ajuste (Perda)</option>
              </select>
            </div>
            <Input label="Quantidade" type="number" value={movementForm.quantity}
              onChange={(e) => setMovementForm({ ...movementForm, quantity: e.target.value })} />
          </div>

          {movementForm.type === 'sale' && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-700 mb-1">💡 Venda detectada — será lançada automaticamente no financeiro</p>
              {movementForm.productId && parseInt(movementForm.quantity) > 0 && (() => {
                const product = products.find(p => p.id === movementForm.productId);
                if (!product) return null;
                const qty = parseInt(movementForm.quantity) || 0;
                const total = product.sellingPrice * qty;
                return (
                  <p className="text-sm text-blue-600">
                    Valor a registrar: <strong>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                    &nbsp;({qty}x R$ {product.sellingPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                  </p>
                );
              })()}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-gray-700">Responsável</label>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={movementForm.employeeId}
                onChange={(e) => setMovementForm({ ...movementForm, employeeId: e.target.value })}
              >
                <option value="">Selecione o funcionário</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            {movementForm.type === 'sale' && (
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-gray-700">Forma de Pagamento</label>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={movementForm.paymentMethod}
                  onChange={(e) => setMovementForm({ ...movementForm, paymentMethod: e.target.value })}
                >
                  <option value="PIX">PIX</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Boleto">Boleto</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsMovementModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddMovement}>Registrar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
