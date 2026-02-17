import { useState, useMemo } from 'react';
import { Plus, Wallet } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { useMonthlySummary, useCategorySummary, useTrendData } from '@/hooks/useSummary';
import { SummaryCards } from '@/components/SummaryCards';
import { CategoryChart } from '@/components/CategoryChart';
import { TrendChart } from '@/components/TrendChart';
import { TransactionList } from '@/components/TransactionList';
import { TransactionForm } from '@/components/TransactionForm';
import { Filters } from '@/components/Filters';
import type { Transaction, Category } from '@/types';
import { filterTransactions } from '@/utils/storage';

function App() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all' as 'all' | 'income' | 'expense',
    category: 'all' as Category | 'all',
    startDate: '',
    endDate: '',
  });

  const summary = useMonthlySummary(transactions);
  const categoryData = useCategorySummary(transactions);
  const trendData = useTrendData(transactions);

  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, {
      search: filters.search,
      type: filters.type === 'all' ? undefined : filters.type,
      category: filters.category === 'all' ? undefined : filters.category,
      startDate: filters.startDate,
      endDate: filters.endDate,
    });
  }, [transactions, filters]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleSubmit = (data: Parameters<typeof addTransaction>[0]) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
      setEditingTransaction(null);
    } else {
      addTransaction(data);
    }
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-background text-white font-body">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Wallet className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <h1 className="text-xl font-heading font-bold">Expense Tracker</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Summary Cards */}
          <SummaryCards summary={summary} />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryChart data={categoryData} />
            <TrendChart data={trendData} />
          </div>

          {/* Transaction Form (Conditional) */}
          {showForm && (
            <TransactionForm
              transaction={editingTransaction}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}

          {/* Filters */}
          <Filters onFilterChange={setFilters} />

          {/* Transaction List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold">Transactions</h2>
              <span className="text-sm text-muted">
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
              </span>
            </div>
            <TransactionList
              transactions={filteredTransactions}
              onEdit={handleEdit}
              onDelete={deleteTransaction}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-muted">
            Expense Tracker · Built with React + Vite
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
