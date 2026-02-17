import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { Category } from '@/types';
import { CATEGORIES } from '@/types';

interface FiltersProps {
  onFilterChange: (filters: {
    search: string;
    type: 'all' | 'income' | 'expense';
    category: Category | 'all';
    startDate: string;
    endDate: string;
  }) => void;
}

export function Filters({ onFilterChange }: FiltersProps) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'all' | 'income' | 'expense'>('all');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (updates: Partial<Parameters<typeof onFilterChange>[0]>) => {
    const newFilters = {
      search,
      type,
      category,
      startDate,
      endDate,
      ...updates,
    };
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setSearch('');
    setType('all');
    setCategory('all');
    setStartDate('');
    setEndDate('');
    onFilterChange({
      search: '',
      type: 'all',
      category: 'all',
      startDate: '',
      endDate: '',
    });
  };

  const hasActiveFilters = search || type !== 'all' || category !== 'all' || startDate || endDate;

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleChange({ search: e.target.value });
            }}
            placeholder="Search transactions..."
            className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isExpanded || hasActiveFilters
              ? 'bg-primary/20 text-primary border border-primary/50'
              : 'bg-surface-hover text-muted border border-transparent hover:border-border'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-white rounded-full">
              Active
            </span>
          )}
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Type</label>
            <select
              value={type}
              onChange={(e) => {
                const value = e.target.value as typeof type;
                setType(value);
                handleChange({ type: value });
              }}
              className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => {
                const value = e.target.value as typeof category;
                setCategory(value);
                handleChange({ category: value });
              }}
              className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors cursor-pointer"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                handleChange({ startDate: e.target.value });
              }}
              className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors cursor-pointer"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                handleChange({ endDate: e.target.value });
              }}
              className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border flex justify-end">
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-muted hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
