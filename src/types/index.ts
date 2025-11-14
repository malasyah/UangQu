export type TransactionType = 'income' | 'expense';

export type PeriodType = 'daily' | 'weekly' | 'monthly';

export type TargetType = 'savings' | 'spending';

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
  created_at?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  type: TransactionType;
  date: string;
  description?: string;
  created_at?: string;
}

export interface Limit {
  id: string;
  user_id: string;
  period_type: PeriodType;
  amount: number;
  category_id?: string | null;
  start_date: string;
  created_at?: string;
}

export interface Target {
  id: string;
  user_id: string;
  type: TargetType;
  amount: number;
  period_type: PeriodType;
  deadline: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  created_at?: string;
}

