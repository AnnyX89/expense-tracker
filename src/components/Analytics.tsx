import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { Expense } from '../types';
import { CATEGORIES, CATEGORY_MAP } from '../categories';

interface Props {
  expenses: Expense[];
  monthLabel: string;
}

function fmt(n: number) { return n.toLocaleString('ru-RU'); }

export default function Analytics({ expenses, monthLabel }: Props) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  // По категориям
  const byCat: Record<string, number> = {};
  for (const e of expenses) {
    byCat[e.category] = (byCat[e.category] ?? 0) + e.amount;
  }

  const chartData = CATEGORIES
    .filter(c => byCat[c.id])
    .map(c => ({ id: c.id, name: c.label, icon: c.icon, value: byCat[c.id], color: c.color }))
    .sort((a, b) => b.value - a.value);

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-white/25">
        <div className="text-4xl mb-3">📊</div>
        <p className="text-sm">Нет данных за {monthLabel}</p>
      </div>
    );
  }

  // Топ-3 траты
  const top3 = [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Итог месяца */}
      <div className="text-center">
        <div className="text-white/40 text-sm mb-1">Итого за {monthLabel}</div>
        <div className="text-4xl font-bold text-white">{fmt(total)} ₽</div>
        <div className="text-white/30 text-xs mt-1">{expenses.length} трат{expenses.length === 1 ? 'а' : expenses.length < 5 ? 'ы' : ''}</div>
      </div>

      {/* Пирог */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map(entry => (
                <Cell key={entry.id} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff22', borderRadius: 10, fontSize: 12 }}
              formatter={(value) => [`${fmt(Number(value))} ₽`, '']}
              labelFormatter={() => ''}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Список категорий */}
      <div className="space-y-2">
        {chartData.map(cat => {
          const pct = Math.round(cat.value / total * 100);
          return (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{cat.icon}</span>
                  <span className="text-sm text-white/80">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/40">{pct}%</span>
                  <span className="text-sm font-semibold text-white">{fmt(cat.value)} ₽</span>
                </div>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: cat.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Топ-3 траты */}
      <div>
        <div className="text-xs text-white/30 uppercase tracking-wide mb-3">Самые крупные</div>
        <div className="space-y-2">
          {top3.map((e, i) => {
            const cat = CATEGORY_MAP[e.category];
            return (
              <div key={e.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
                <div className="text-white/20 text-xs font-bold w-4">#{i + 1}</div>
                <div className="text-base">{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{e.description}</div>
                  <div className="text-xs" style={{ color: cat.color + 'aa' }}>
                    {new Date(e.date + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <div className="text-sm font-bold text-white">{fmt(e.amount)} ₽</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
