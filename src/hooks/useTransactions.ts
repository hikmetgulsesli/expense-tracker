import { useState, useEffect, useCallback } from 'react';
import type { Transaction } from '@/types';
import { getTransactions, addTransaction as add, updateTransaction as update, deleteTransaction as remove } from '@/utils/storage';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTransactions(getTransactions());
    setIsLoading(false);
  }, []);

  const refresh = useCallback(() => {
    setTransactions(getTransactions());
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction = add(transaction);
    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => {
    const updated = update(id, updates);
    if (updated) {
      setTransactions(prev => prev.map(t => (t.id === id ? updated : t)));
    }
    return updated;
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    const success = remove(id);
    if (success) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
    return success;
  }, []);

  return {
    transactions,
    isLoading,
    refresh,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
