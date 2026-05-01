import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BarChart2, List } from 'lucide-react';
import QuickAdd from './components/QuickAdd';
import ExpenseList from './components/ExpenseList';
import Analytics from './components/Analytics';
import { loadExpenses, addExpense, deleteExpense } from './storage';
import type { Expense } from './types';
import './index.css';

function monthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function monthLabel(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
}

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses());
  const [tab, setTab] = useState<'list' | 'analytics'>('list');

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const key = monthKey(viewYear, viewMonth);
  const monthExpenses = expenses.filter(e => e.date.startsWith(key));
  const total = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const currentKey = monthKey(now.getFullYear(), now.getMonth());
  const isCurrentMonth = key === currentKey;

  useEffect(() => { document.title = 'Мои расходы 💸'; }, []);

  function handleAdd(description: string, amount: number, categoryId: string) {
    const today = new Date().toISOString().slice(0, 10);
    const expense: Expense = {
      id: crypto.randomUUID(),
      description,
      amount,
      category: categoryId as Expense['category'],
      date: today,
      createdAt: Date.now(),
    };
    setExpenses(addExpense(expense));
  }

  function handleDelete(id: string) {
    setExpenses(deleteExpense(id));
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    const nm = viewMonth === 11 ? 0 : viewMonth + 1;
    const ny = viewMonth === 11 ? viewYear + 1 : viewYear;
    if (monthKey(ny, nm) <= currentKey) {
      if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
      else setViewMonth(m => m + 1);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col max-w-lg mx-auto">

      {/* Шапка */}
      <header className="px-5 pt-10 pb-5 flex flex-col items-center">
        <div className="text-white/30 text-[11px] tracking-widest uppercase font-medium">Мои расходы</div>

        <div className="flex items-center gap-2 mt-3">
          <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-white font-semibold text-lg capitalize min-w-44 text-center">
            {monthLabel(viewYear, viewMonth)}
          </div>
          <button
            onClick={nextMonth}
            disabled={isCurrentMonth}
            className="w-9 h-9 flex items-center justify-center rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Большая сумма */}
        <div className="mt-4 text-center">
          <div className="text-[52px] font-bold text-white tracking-tight leading-none">
            {total.toLocaleString('ru-RU')}
            <span className="text-3xl text-white/30 ml-2 font-normal">₽</span>
          </div>
          <div className="text-white/30 text-xs mt-2">
            {monthExpenses.length === 0
              ? 'нет записей'
              : `${monthExpenses.length} запис${monthExpenses.length === 1 ? 'ь' : monthExpenses.length < 5 ? 'и' : 'ей'}`}
          </div>
        </div>
      </header>

      {/* Быстрое добавление */}
      {isCurrentMonth && (
        <div className="px-5 pb-5">
          <QuickAdd onAdd={handleAdd} />
        </div>
      )}

      {/* Таб-переключатель */}
      <div className="px-5 mb-4">
        <div className="flex bg-white/5 rounded-2xl p-1 gap-1">
          <button
            onClick={() => setTab('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-white/35 hover:text-white/60'}`}
          >
            <List className="w-4 h-4" /> Список
          </button>
          <button
            onClick={() => setTab('analytics')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'analytics' ? 'bg-white/10 text-white shadow-sm' : 'text-white/35 hover:text-white/60'}`}
          >
            <BarChart2 className="w-4 h-4" /> Аналитика
          </button>
        </div>
      </div>

      {/* Контент */}
      <main className="flex-1 px-5 pb-10">
        {tab === 'list'
          ? <ExpenseList expenses={monthExpenses} onDelete={handleDelete} />
          : <Analytics expenses={monthExpenses} monthLabel={monthLabel(viewYear, viewMonth)} />
        }
      </main>
    </div>
  );
}
