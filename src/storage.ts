import type { Expense } from './types';

const KEY = 'expenses_v1';

export function loadExpenses(): Expense[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem(KEY, JSON.stringify(expenses));
}

export function addExpense(expense: Expense): Expense[] {
  const list = loadExpenses();
  list.unshift(expense);
  saveExpenses(list);
  return list;
}

export function deleteExpense(id: string): Expense[] {
  const list = loadExpenses().filter(e => e.id !== id);
  saveExpenses(list);
  return list;
}
