export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: Category;
  description: string;
  date: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export type Category = 
  | 'Food' 
  | 'Transport' 
  | 'Bills' 
  | 'Entertainment' 
  | 'Shopping' 
  | 'Health' 
  | 'Other';

export interface CategoryInfo {
  name: Category;
  color: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { name: 'Food', color: '#f97316', icon: 'UtensilsCrossed' },
  { name: 'Transport', color: '#3b82f6', icon: 'Car' },
  { name: 'Bills', color: '#ef4444', icon: 'Receipt' },
  { name: 'Entertainment', color: '#a855f7', icon: 'Film' },
  { name: 'Shopping', color: '#ec4899', icon: 'ShoppingBag' },
  { name: 'Health', color: '#22c55e', icon: 'Heart' },
  { name: 'Other', color: '#6b7280', icon: 'MoreHorizontal' },
];

export interface MonthlySummary {
  month: string;
  year: number;
  income: number;
  expenses: number;
  balance: number;
}

export interface CategorySummary {
  category: Category;
  amount: number;
  percentage: number;
  color: string;
}
