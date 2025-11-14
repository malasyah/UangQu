import { supabase } from './supabase';

export interface UserSettings {
  id: string;
  user_id: string;
  payday_date: number; // 1-31
  created_at: string;
  updated_at: string;
}

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No settings found, return default
      return null;
    }
    throw error;
  }

  return data;
}

export async function createOrUpdateUserSettings(
  userId: string,
  paydayDate: number
): Promise<UserSettings> {
  // Check if settings exist
  const existing = await getUserSettings(userId);

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('user_settings')
      .update({
        payday_date: paydayDate,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Create new
    const { data, error } = await supabase
      .from('user_settings')
      .insert({
        user_id: userId,
        payday_date: paydayDate,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export async function getPaydayDate(userId: string): Promise<number> {
  const settings = await getUserSettings(userId);
  return settings?.payday_date || 1; // Default to 1st if not set
}

