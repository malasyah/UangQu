// This file will be generated from Supabase CLI
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
// Or use the Supabase dashboard to generate types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'income' | 'expense';
          icon: string | null;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: 'income' | 'expense';
          icon?: string | null;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: 'income' | 'expense';
          icon?: string | null;
          color?: string | null;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          amount: number;
          type: 'income' | 'expense';
          date: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          amount: number;
          type: 'income' | 'expense';
          date: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          amount?: number;
          type?: 'income' | 'expense';
          date?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      limits: {
        Row: {
          id: string;
          user_id: string;
          period_type: 'daily' | 'weekly' | 'monthly';
          amount: number;
          category_id: string | null;
          start_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          period_type: 'daily' | 'weekly' | 'monthly';
          amount: number;
          category_id?: string | null;
          start_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          period_type?: 'daily' | 'weekly' | 'monthly';
          amount?: number;
          category_id?: string | null;
          start_date?: string;
          created_at?: string;
        };
      };
      targets: {
        Row: {
          id: string;
          user_id: string;
          type: 'savings' | 'spending';
          amount: number;
          period_type: 'daily' | 'weekly' | 'monthly';
          deadline: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'savings' | 'spending';
          amount: number;
          period_type: 'daily' | 'weekly' | 'monthly';
          deadline: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'savings' | 'spending';
          amount?: number;
          period_type?: 'daily' | 'weekly' | 'monthly';
          deadline?: string;
          created_at?: string;
        };
      };
    };
    Functions: {
      get_period_balance: {
        Args: {
          p_user_id: string;
          p_period_type: string;
          p_start_date?: string;
        };
        Returns: number;
      };
      check_limit_violations: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          limit_id: string;
          limit_amount: number;
          current_spending: number;
          period_type: string;
          category_id: string | null;
          is_violated: boolean;
        }[];
      };
    };
    Views: {
      transaction_summaries: {
        Row: {
          user_id: string;
          period_start: string;
          period_type: string;
          total_income: number;
          total_expense: number;
          balance: number;
          transaction_count: number;
        };
      };
    };
  };
}

