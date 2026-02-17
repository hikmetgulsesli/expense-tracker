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
}

export const CATEGORIES: CategoryInfo[] = [
  { name: 'Food', color: '#f97316' },
  { name: 'Transport', color: '#3b82f6' },
  { name: 'Bills', color: '#ef4444' },
  { name: 'Entertainment', color: '#a855f7' },
  { name: 'Shopping', color: '#ec4899' },
  { name: 'Health', color: '#22c55e' },
  { name: 'Other', color: '#6b7280' },
];

export interface MonthlySummary {
  month: string;
  year: number;
  income: number;
  expenses: number;
  balance: number;
  transactionCount: number;
}

export interface CategorySummary {
  category: Category;
  amount: number;
  percentage: number;
  color: string;
}
