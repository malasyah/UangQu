# Database Migrations

## Migration: Add Payday Date Support

File: `add_payday_date.sql`

### What it does:
- Creates `user_settings` table to store user-specific settings
- Adds `payday_date` field (1-31) for each user
- Sets up Row Level Security (RLS) policies

### How to apply:
1. Go to Supabase Dashboard > SQL Editor
2. Run the SQL from `add_payday_date.sql`
3. Verify the table was created: `SELECT * FROM user_settings;`

### Notes:
- Default payday_date is 1 (first of month) if not set
- Users can update their payday_date in Settings page
- All monthly calculations will use payday period instead of calendar month

