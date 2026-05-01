import { detectCategory } from './categories';
import type { CategoryId } from './types';

export interface ParsedExpense {
  description: string;
  amount: number;
  category: CategoryId;
}

// Парсит строку вида "хлеб 50", "такси 350р", "кино 800 руб", "1200 продукты"
export function parseInput(raw: string): ParsedExpense | null {
  const text = raw.trim();
  if (!text) return null;

  // Найти первое число (с опциональными пробелами и "р"/"руб"/"₽")
  const numMatch = text.match(/(\d+(?:[.,]\d+)?)/);
  if (!numMatch) return null;

  const amount = parseFloat(numMatch[1].replace(',', '.'));
  if (!amount || amount <= 0) return null;

  // Убрать число и суффиксы (р, руб, рублей, ₽) из строки — остаток = описание
  const description = text
    .replace(/\d+(?:[.,]\d+)?\s*(?:р(?:ублей?|уб)?|₽)?/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  const category = detectCategory(description || text);

  return {
    description: description || 'Без названия',
    amount,
    category,
  };
}
