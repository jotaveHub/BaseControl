export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  content: string;
  status: TaskStatus;
}

export interface FinanceRecord {
  id: string;
  date: string;
  description: string;
  value: number;
  product: string;
  paymentMethod: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  cost: number;
  sellingPrice: number;
  stock: number;
}

export type MovementType = 'purchase' | 'sale' | 'return' | 'adjustment';

export interface Movement {
  id: string;
  productId: string;
  date: string;
  type: MovementType;
  quantity: number;
  employeeId: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
}
