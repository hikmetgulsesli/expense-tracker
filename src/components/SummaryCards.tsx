import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import type { MonthlySummary } from '@/types';
import { formatCurrency } from '@/utils/format';

interface SummaryCardsProps {
  summary: MonthlySummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Balance',
      amount: summary.balance,
      icon: Wallet,
      color: summary.balance >= 0 ? 'text-success' : 'text-danger',
      bgColor: summary.balance >= 0 ? 'bg-success/10' : 'bg-danger/10',
    },
    {
      title: 'Income',
      amount: summary.income,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Expenses',
      amount: summary.expenses,
      icon: TrendingDown,
      color: 'text-danger',
      bgColor: 'bg-danger/10',
    },
    {
      title: 'Total Transactions',
      displayValue: String(summary.transactionCount),
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-surface border border-border rounded-xl p-5 transition-all duration-200 hover:border-primary/30 hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted text-sm font-body mb-1">{card.title}</p>
              <p className={`text-2xl font-heading font-bold ${card.color}`}>
                {card.displayValue || formatCurrency(card.amount || 0)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} aria-hidden="true" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
