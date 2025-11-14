# Supabase Setup Instructions

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: UangQu
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
5. Wait for project to be created (2-3 minutes)

## 2. Run Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the following files in order:
   - `schema.sql` - Creates all tables
   - `rls_policies.sql` - Sets up Row Level Security
   - `functions.sql` - Creates helper functions and views

## 3. Configure Authentication

1. Go to Authentication > Settings
2. Enable "Email" provider
3. Configure email templates if needed
4. Set up email redirect URLs:
   - Development: `http://localhost:5173` (web)
   - Production: Your production URL

## 4. Get API Keys

1. Go to Project Settings > API
2. Copy the following:
   - Project URL
   - `anon` public key (for client-side)
   - `service_role` key (keep secret, for server-side only)

## 5. Setup Environment Variables

### Web Project
Create `web/.env` file:
```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Mobile Project
For Expo, you can use `app.json` with `extra` field or use `expo-constants`:
```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "your_project_url_here",
      "supabaseAnonKey": "your_anon_key_here"
    }
  }
}
```

Or create `mobile/.env` and use a library like `react-native-dotenv`.

## 6. Test Connection

After setting up, test the connection by running the apps and checking if Supabase client initializes correctly.

## Notes

- Never commit `.env` files to version control
- Use `anon` key for client-side operations
- Use `service_role` key only for server-side operations (not in client apps)
- RLS policies ensure users can only access their own data

