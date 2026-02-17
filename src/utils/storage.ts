import type { Transaction, Category } from '@/types';

const STORAGE_KEY = 'expense-tracker-data';

export function getTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load transactions from localStorage:', error);
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions:', error);
  }
}

export function addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
  const now = new Date().toISOString();
  const newTransaction: Transaction = {
    ...transaction,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  
  const transactions = getTransactions();
  transactions.push(newTransaction);
  saveTransactions(transactions);
  
  return newTransaction;
}

export function updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>): Transaction | null {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  transactions[index] = {
    ...transactions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveTransactions(transactions);
  return transactions[index];
}

export function deleteTransaction(id: string): boolean {
  const transactions = getTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  
  if (filtered.length === transactions.length) return false;
  
  saveTransactions(filtered);
  return true;
}

// Refactored to be a pure function that accepts transactions as a parameter
export function filterTransactions(
  transactions: Transaction[],
  options: {
    type?: 'income' | 'expense';
    category?: Category;
    startDate?: string;
    endDate?: string;
    search?: string;
  }
): Transaction[] {
  let filtered = [...transactions];
  
  if (options.type) {
    filtered = filtered.filter(t => t.type === options.type);
  }
  
  if (options.category) {
    filtered = filtered.filter(t => t.category === options.category);
  }
  
  if (options.startDate) {
    const start = new Date(options.startDate);
    filtered = filtered.filter(t => new Date(t.date).getTime() >= start.getTime());
  }
  
  if (options.endDate) {
    const end = new Date(options.endDate);
    filtered = filtered.filter(t => new Date(t.date).getTime() <= end.getTime());
  }
  
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filtered = filtered.filter(t => 
      t.description.toLowerCase().includes(searchLower) ||
      t.category.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by date descending
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
