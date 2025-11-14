import { supabase } from './supabase';
import type { Transaction, TransactionType } from '../types';

export async function getTransactions(userId: string, filters?: {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: TransactionType;
}) {
  let query = supabase
    .from('transactions')
    .select('*, categories(*)')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters?.startDate) {
    query = query.gte('date', filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte('date', filters.endDate);
  }
  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getTransactionById(id: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, categories(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createTransaction(transaction: {
  user_id: string;
  category_id: string;
  amount: number;
  type: TransactionType;
  date: string;
  description?: string;
}) {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select('*, categories(*)')
    .single();

  if (error) throw error;
  return data;
}

export async function updateTransaction(
  id: string,
  updates: {
    category_id?: string;
    amount?: number;
    type?: TransactionType;
    date?: string;
    description?: string;
  }
) {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select('*, categories(*)')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw error;
}

