import { useState } from 'react';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import type { Transaction } from '@/types';
import { CATEGORY_MAP } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (deletingId === id) {
      onDelete(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
      // Increased timeout from 3s to 5s for better accessibility
      setTimeout(() => setDeletingId(null), 5000);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-hover flex items-center justify-center">
          <Plus className="w-8 h-8 text-muted" aria-hidden="true" />
        </div>
        <p className="text-muted">No transactions yet</p>
        <p className="text-sm text-muted mt-1">Add your first transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-hover">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted">Date</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted">Description</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted">Category</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted">Type</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted">Amount</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((transaction) => {
              // O(1) lookup using CATEGORY_MAP instead of O(n) find
              const categoryInfo = CATEGORY_MAP.get(transaction.category);
              return (
                <tr
                  key={transaction.id}
                  className="hover:bg-surface-hover/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-white">{formatDate(transaction.date)}</td>
                  <td className="px-4 py-3 text-sm text-white">{transaction.description}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${categoryInfo?.color}20`,
                        color: categoryInfo?.color,
                      }}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'income'
                          ? 'bg-success/10 text-success'
                          : 'bg-danger/10 text-danger'
                      }`}
                    >
                      {transaction.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium text-right ${
                    transaction.type === 'income' ? 'text-success' : 'text-danger'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(transaction)}
                        className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-surface-hover transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        aria-label={`Edit ${transaction.description}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className={`p-1.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                          deletingId === transaction.id
                            ? 'text-danger bg-danger/10'
                            : 'text-muted hover:text-danger hover:bg-danger/10'
                        }`}
                        aria-label={deletingId === transaction.id ? 'Confirm delete' : `Delete ${transaction.description}`}
                      >
                        {deletingId === transaction.id ? (
                          <X className="w-4 h-4" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
