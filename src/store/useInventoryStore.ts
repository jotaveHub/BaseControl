import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      products: [],
      movements: [],
      employees: [],
      addProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: crypto.randomUUID() }]
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
      addMovement: (movement) => set((state) => {
        const { type, quantity, productId } = movement;
        let stockChange = 0;
        if (type === 'purchase' || type === 'return') stockChange = quantity;
        else if (type === 'sale' || type === 'adjustment') stockChange = -quantity;

        const newMovement = { ...movement, id: (movement as any).id || crypto.randomUUID() };

        return {
          movements: [...state.movements, newMovement],
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
    }),
    {
      name: 'inventory-storage',
    }
  )
);
