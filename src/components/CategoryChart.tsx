import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { CategorySummary } from '@/types';

interface CategoryChartProps {
  data: CategorySummary[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 h-80 flex items-center justify-center">
        <p className="text-muted">No expense data for this month</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-lg font-heading font-semibold text-white mb-4">
        Expenses by Category
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="amount"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#12121a',
                border: '1px solid #2a2a3a',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number, _name: string, props) => {
                const payload = props?.payload as CategorySummary | undefined;
                return [`$${value.toFixed(2)} (${payload?.percentage || 0}%)`, payload?.category || ''];
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(_value, entry) => {
                const payload = entry?.payload as CategorySummary | undefined;
                return `${payload?.category || ''} (${payload?.percentage || 0}%)`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
