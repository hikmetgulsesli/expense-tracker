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

// Module-level constant for max amount validation
const MAX_AMOUNT = 1_000_000_000;

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
    } else {
      // Reset form fields when no transaction is provided (new transaction mode)
      setAmount('');
      setType('expense');
      setCategory('Other');
      setDescription('');
      setDate(formatDateInput(new Date().toISOString()));
    }
    // Clear any previous validation errors when switching transactions or modes
    setErrors({});
  }, [transaction]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const amountNumber = Number(amount);
    if (!amount || isNaN(amountNumber) || amountNumber <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else {
      if (amountNumber > MAX_AMOUNT) {
        newErrors.amount = `Amount must be less than or equal to ${MAX_AMOUNT}`;
      } else {
        const parts = amount.trim().split('.');
        if (parts.length === 2 && parts[1].length > 2) {
          newErrors.amount = 'Amount cannot have more than 2 decimal places';
        }
      }
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    } else {
      // Fix timezone bug: parse date in local timezone
      const parsedDate = new Date(`${date}T00:00:00`);
      if (isNaN(parsedDate.getTime())) {
        newErrors.date = 'Please enter a valid date';
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (parsedDate > today) {
          newErrors.date = 'Date cannot be in the future';
        }
      }
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
        <fieldset>
          <legend className="block text-sm font-medium text-muted mb-2">Type</legend>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
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
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                type === 'income'
                  ? 'bg-success/20 text-success border border-success/50'
                  : 'bg-surface-hover text-muted border border-transparent hover:border-border'
              }`}
            >
              Income
            </button>
          </div>
        </fieldset>

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
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
              className={`w-full bg-background border rounded-lg py-2.5 pl-8 pr-4 text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                errors.amount ? 'border-danger' : 'border-border'
              }`}
            />
          </div>
          {errors.amount && (
            <p id="amount-error" className="mt-1 text-sm text-danger" role="alert" aria-live="polite">
              {errors.amount}
            </p>
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
            className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors cursor-pointer"
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
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'description-error' : undefined}
            className={`w-full bg-background border rounded-lg py-2.5 px-4 text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
              errors.description ? 'border-danger' : 'border-border'
            }`}
          />
          {errors.description && (
            <p id="description-error" className="mt-1 text-sm text-danger" role="alert" aria-live="polite">
              {errors.description}
            </p>
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
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? 'date-error' : undefined}
            className={`w-full bg-background border rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors cursor-pointer ${
              errors.date ? 'border-danger' : 'border-border'
            }`}
          />
          {errors.date && (
            <p id="date-error" className="mt-1 text-sm text-danger" role="alert" aria-live="polite">
              {errors.date}
            </p>
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
