import { supabase } from './supabase';
import type { Target, PeriodType, TargetType } from '../types';

export async function getTargets(userId: string) {
  const { data, error } = await supabase
    .from('targets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createTarget(target: {
  user_id: string;
  type: TargetType;
  amount: number;
  period_type: PeriodType;
  deadline: string;
}) {
  const { data, error } = await supabase
    .from('targets')
    .insert(target)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTarget(id: string, updates: Partial<Target>) {
  const { data, error } = await supabase
    .from('targets')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTarget(id: string) {
  const { error } = await supabase.from('targets').delete().eq('id', id);
  if (error) throw error;
}

