export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: CategoryId;
  date: string; // ISO date yyyy-mm-dd
  createdAt: number;
}

export type CategoryId =
  | 'food' | 'home' | 'cafe' | 'fun' | 'transport' | 'car'
  | 'health' | 'beauty' | 'clothes' | 'mobile' | 'education'
  | 'pets' | 'cleaning' | 'gifts' | 'travel' | 'debt'
  | 'delivery' | 'sport' | 'subscriptions' | 'other';

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  color: string;
  keywords: string[];
}
