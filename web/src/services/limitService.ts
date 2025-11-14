import { supabase } from './supabase';
import type { Limit, PeriodType } from '../types';

export async function getLimits(userId: string) {
  const { data, error } = await supabase
    .from('limits')
    .select('*, categories(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createLimit(limit: {
  user_id: string;
  period_type: PeriodType;
  amount: number;
  category_id?: string | null;
  start_date: string;
}) {
  const { data, error } = await supabase
    .from('limits')
    .insert(limit)
    .select('*, categories(*)')
    .single();

  if (error) throw error;
  return data;
}

export async function updateLimit(id: string, updates: Partial<Limit>) {
  const { data, error } = await supabase
    .from('limits')
    .update(updates)
    .eq('id', id)
    .select('*, categories(*)')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLimit(id: string) {
  const { error } = await supabase.from('limits').delete().eq('id', id);
  if (error) throw error;
}

export async function checkLimitViolations(userId: string) {
  const { data, error } = await supabase.rpc('check_limit_violations', {
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
}

