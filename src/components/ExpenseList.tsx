import { useState } from 'react';
import type { Expense } from '../types';
import { CATEGORY_MAP } from '../categories';
import { Trash2 } from 'lucide-react';

interface Props {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

function groupByDate(expenses: Expense[]) {
  const groups: Record<string, Expense[]> = {};
  for (const e of expenses) {
    if (!groups[e.date]) groups[e.date] = [];
    groups[e.date].push(e);
  }
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
}

function localDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (iso === localDateStr(today)) return 'Сегодня';
  if (iso === localDateStr(yesterday)) return 'Вчера';
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

export default function ExpenseList({ expenses, onDelete }: Props) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const groups = groupByDate(expenses);

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-white/25">
        <div className="text-4xl mb-3">🌸</div>
        <p className="text-sm">Пока нет записей.<br />Добавьте первую трату выше!</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {groups.map(([date, items]) => {
        const dayTotal = items.reduce((s, e) => s + e.amount, 0);
        return (
          <div key={date}>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wide">
                {formatDate(date)}
              </span>
              <span className="text-xs text-white/40">
                {dayTotal.toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <div className="space-y-1.5">
              {items.map(e => {
                const cat = CATEGORY_MAP[e.category];
                return (
                  <div
                    key={e.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors group"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: cat.color + '22' }}
                    >
                      {cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{e.description}</div>
                      <div className="text-xs mt-0.5" style={{ color: cat.color + 'cc' }}>{cat.label}</div>
                    </div>
                    <div className="text-sm font-semibold text-white flex-shrink-0">
                      {e.amount.toLocaleString('ru-RU')} ₽
                    </div>
                    {confirmId === e.id ? (
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => { onDelete(e.id); setConfirmId(null); }}
                          className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-lg hover:bg-red-500/30"
                        >Да</button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="text-xs bg-white/10 text-white/50 px-2 py-1 rounded-lg hover:bg-white/15"
                        >Нет</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(e.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-red-400 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
