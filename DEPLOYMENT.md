# Deployment Guide

## Web Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository (optional, bisa langsung upload)

### Steps

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd web
   vercel
   ```

4. **Set Environment Variables:**
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

5. **Redeploy** after setting environment variables

### Alternative: Deploy via GitHub

1. Push code to GitHub
2. Import project in Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables
6. Deploy

## Web Deployment (Netlify)

### Steps

1. **Build locally:**
   ```bash
   cd web
   npm run build
   ```

2. **Deploy:**
   - Option 1: Drag and drop `web/dist` folder to Netlify
   - Option 2: Connect GitHub repository

3. **Set Environment Variables:**
   - Go to Site Settings > Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Set Build Settings** (if using Git):
   - Build command: `npm run build`
   - Publish directory: `dist`

## Mobile Deployment (Expo)

### Development Build

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login:**
   ```bash
   eas login
   ```

3. **Configure:**
   ```bash
   cd mobile
   eas build:configure
   ```

4. **Build Android:**
   ```bash
   eas build --platform android
   ```

5. **Build iOS:**
   ```bash
   eas build --platform ios
   ```

### Production Build

1. **Update app.json:**
   - Set proper app name, slug, version
   - Configure app icons and splash screens

2. **Build:**
   ```bash
   eas build --platform all --profile production
   ```

3. **Submit to Stores:**
   ```bash
   eas submit --platform android
   eas submit --platform ios
   ```

## Supabase Setup

### 1. Create Project
- Go to [supabase.com](https://supabase.com)
- Create new project
- Wait for database to be ready

### 2. Run SQL Scripts
- Go to SQL Editor in Supabase dashboard
- Run scripts in order:
  1. `supabase/schema.sql`
  2. `supabase/rls_policies.sql`
  3. `supabase/functions.sql`

### 3. Configure Authentication
- Go to Authentication > Settings
- Enable Email provider
- Configure email templates (optional)
- Set redirect URLs:
  - Development: `http://localhost:5173` (web)
  - Production: Your deployed web URL

### 4. Get API Keys
- Go to Project Settings > API
- Copy:
  - Project URL
  - `anon` public key (for client apps)
  - `service_role` key (keep secret, server-side only)

## Environment Variables Checklist

### Web (.env)
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`

### Mobile (app.json)
- [ ] `expo.extra.supabaseUrl`
- [ ] `expo.extra.supabaseAnonKey`

## Post-Deployment Checklist

### Web
- [ ] Test authentication (login/register)
- [ ] Test transaction CRUD
- [ ] Test category management
- [ ] Test limits and targets
- [ ] Test CSV export/import
- [ ] Verify charts are loading
- [ ] Check responsive design

### Mobile
- [ ] Test on Android device/emulator
- [ ] Test on iOS device/simulator
- [ ] Test authentication flow
- [ ] Test all navigation
- [ ] Test charts rendering
- [ ] Test swipe gestures
- [ ] Verify offline behavior

### Database
- [ ] Verify RLS policies are working
- [ ] Test user data isolation
- [ ] Check database functions
- [ ] Monitor query performance

## Troubleshooting

### Web Issues

**Build fails:**
- Check Node.js version (18+)
- Clear `node_modules` and reinstall
- Check environment variables

**Charts not showing:**
- Verify Recharts is installed
- Check browser console for errors
- Ensure data is being fetched

### Mobile Issues

**Build fails:**
- Check Expo SDK version
- Update dependencies
- Clear cache: `expo start -c`

**Navigation issues:**
- Verify React Navigation is installed
- Check navigation setup in AppNavigator

### Supabase Issues

**Authentication not working:**
- Check redirect URLs
- Verify email provider is enabled
- Check RLS policies

**Database errors:**
- Verify schema is created
- Check RLS policies
- Review function definitions

## Monitoring

### Supabase
- Monitor database usage
- Check API request limits
- Review error logs

### Vercel/Netlify
- Monitor build logs
- Check function execution
- Review analytics

### Mobile
- Use Expo Analytics
- Monitor crash reports
- Track user engagement

## Security Notes

1. **Never commit** `.env` files
2. **Never expose** `service_role` key in client
3. **Use RLS** for all database tables
4. **Validate** all user inputs
5. **Sanitize** CSV imports
6. **Rate limit** API calls if needed

## Cost Estimation

### Free Tier (Development)
- Supabase: Free (500MB database, 2GB bandwidth)
- Vercel: Free (100GB bandwidth)
- Netlify: Free (100GB bandwidth)
- Expo: Free (development builds)

### Production (Estimated)
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Netlify Pro: $19/month
- Expo: Free (or $29/month for EAS)

## Support

For deployment issues:
1. Check logs in respective platforms
2. Review error messages
3. Check environment variables
4. Verify Supabase configuration
5. Open issue in repository

