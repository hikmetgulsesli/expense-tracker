import { useMemo } from 'react';
import type { Transaction, CategorySummary, Category } from '@/types';
import { CATEGORIES } from '@/types';

export function useMonthlySummary(transactions: Transaction[], month?: string) {
  return useMemo(() => {
    const targetMonth = month || new Date().toISOString().slice(0, 7); // YYYY-MM
    
    const monthTransactions = transactions.filter(t => t.date.startsWith(targetMonth));
    
    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      month: targetMonth,
      year: parseInt(targetMonth.slice(0, 4)),
      income,
      expenses,
      balance: income - expenses,
      transactionCount: monthTransactions.length,
    };
  }, [transactions, month]);
}

export function useCategorySummary(transactions: Transaction[], month?: string) {
  return useMemo(() => {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    
    const monthExpenses = transactions.filter(
      t => t.type === 'expense' && t.date.startsWith(targetMonth)
    );
    
    const totalExpenses = monthExpenses.reduce((sum, t) => sum + t.amount, 0);
    
    const categoryMap = new Map<Category, number>();
    
    monthExpenses.forEach(t => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });
    
    const summaries: CategorySummary[] = Array.from(categoryMap.entries())
      .map(([category, amount]) => {
        const categoryInfo = CATEGORIES.find(c => c.name === category);
        return {
          category,
          amount,
          percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
          color: categoryInfo?.color || '#6b7280',
        };
      })
      .sort((a, b) => b.amount - a.amount);
    
    return summaries;
  }, [transactions, month]);
}

export function useTrendData(transactions: Transaction[], months: number = 6) {
  return useMemo(() => {
    const now = new Date();
    const data = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthTransactions = transactions.filter(t => t.date.startsWith(monthKey));
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      data.push({
        month: monthName,
        income,
        expenses,
        balance: income - expenses,
      });
    }
    
    return data;
  }, [transactions, months]);
}
