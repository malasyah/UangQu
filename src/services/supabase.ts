import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import type { Database } from '../types/database';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please configure in app.json or .env');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

