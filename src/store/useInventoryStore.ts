import { create } from 'zustand';
import { Product, Movement, Employee } from '../types';

interface InventoryState {
  products: Product[];
  movements: Movement[];
  employees: Employee[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  addMovement: (movement: Omit<Movement, 'id'>) => void;
  deleteMovement: (id: string) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  deleteEmployee: (id: string) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  products: [
    { id: '1', code: 'PROD001', name: 'Teclado Mecânico', cost: 100.00, sellingPrice: 200.00 },
    { id: '2', code: 'PROD002', name: 'Mouse Gamer', cost: 50.00, sellingPrice: 120.00 },
  ],
  movements: [
    { id: '1', productId: '1', date: '2026-05-01', type: 'purchase', quantity: 10, employeeId: 'e1' },
    { id: '2', productId: '1', date: '2026-05-02', type: 'sale', quantity: 2, employeeId: 'e1' },
  ],
  employees: [
    { id: 'e1', name: 'João Silva', role: 'Almoxarife' },
    { id: 'e2', name: 'Maria Souza', role: 'Gerente de Estoque' },
  ],
  addProduct: (product) => set((state) => ({
    products: [...state.products, { ...product, id: crypto.randomUUID(), stock: 0 }]
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),
  addMovement: (movement) => set((state) => {
    const { type, quantity, productId } = movement;
    let stockChange = 0;
    if (type === 'purchase' || type === 'return') stockChange = quantity;
    else if (type === 'sale' || type === 'adjustment') stockChange = -quantity;

    return {
      movements: [...state.movements, { ...movement, id: crypto.randomUUID() }],
      products: state.products.map(p =>
        p.id === productId ? { ...p, stock: p.stock + stockChange } : p
      )
    };
  }),
  deleteMovement: (id) => set((state) => {
    const movement = state.movements.find(m => m.id === id);
    if (!movement) return state;

    const { type, quantity, productId } = movement;
    let stockChange = 0;
    if (type === 'purchase' || type === 'return') stockChange = -quantity;
    else if (type === 'sale' || type === 'adjustment') stockChange = quantity;

    return {
      movements: state.movements.filter(m => m.id !== id),
      products: state.products.map(p =>
        p.id === productId ? { ...p, stock: p.stock + stockChange } : p
      )
    };
  }),
  addEmployee: (employee) => set((state) => ({
    employees: [...state.employees, { ...employee, id: crypto.randomUUID() }]
  })),
  deleteEmployee: (id) => set((state) => ({
    employees: state.employees.filter(e => e.id !== id)
  })),
}));
