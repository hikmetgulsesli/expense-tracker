import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import type { Transaction, Category } from '@/types';
import { CATEGORIES } from '@/types';
import { formatDateInput } from '@/utils/format';

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSubmit: (data: {
    amount: number;
    type: 'income' | 'expense';
    category: Category;
    description: string;
    date: string;
  }) => void;
  onCancel: () => void;
}

export function TransactionForm({ transaction, onSubmit, onCancel }: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<Category>('Other');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(formatDateInput(new Date().toISOString()));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setType(transaction.type);
      setCategory(transaction.category);
      setDescription(transaction.description);
      setDate(formatDateInput(transaction.date));
    }
  }, [transaction]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      amount: Number(amount),
      type,
      category,
      description: description.trim(),
      date,
    });

    if (!transaction) {
      // Reset form for new transaction
      setAmount('');
      setDescription('');
      setDate(formatDateInput(new Date().toISOString()));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-white">
          {transaction ? 'Edit Transaction' : 'Add Transaction'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-lg text-muted hover:text-white hover:bg-surface-hover transition-colors"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Type</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                type === 'expense'
                  ? 'bg-danger/20 text-danger border border-danger/50'
                  : 'bg-surface-hover text-muted border border-transparent hover:border-border'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                type === 'income'
                  ? 'bg-success/20 text-success border border-success/50'
                  : 'bg-surface-hover text-muted border border-transparent hover:border-border'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-muted mb-2">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">$</span>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className={`w-full bg-background border rounded-lg py-2.5 pl-8 pr-4 text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.amount ? 'border-danger' : 'border-border'
              }`}
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-danger">{errors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-muted mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-muted mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this for?"
            className={`w-full bg-background border rounded-lg py-2.5 px-4 text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              errors.description ? 'border-danger' : 'border-border'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-danger">{errors.description}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-muted mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full bg-background border rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer ${
              errors.date ? 'border-danger' : 'border-border'
            }`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-danger">{errors.date}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 px-4 rounded-lg font-medium text-muted bg-surface-hover hover:bg-border transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 px-4 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {transaction ? 'Update' : 'Add'} Transaction
        </button>
      </div>
    </form>
  );
}
