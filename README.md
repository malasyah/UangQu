# UangQu - Personal Finance Management App

UangQu adalah aplikasi manajemen keuangan pribadi yang membantu pengguna mencatat, mengontrol, dan menganalisa keuangan dengan cara sederhana. Aplikasi ini tersedia untuk web (React) dan mobile (React Native + Expo).

## Fitur Utama

- ✅ **Pencatatan Transaksi** - Pemasukan dan pengeluaran dengan kategori
- ✅ **Manajemen Kategori** - Kustomisasi kategori dengan icon dan warna
- ✅ **Batasan Pengeluaran** - Set limit harian/mingguan/bulanan
- ✅ **Target Tabungan** - Tracking target tabungan dan pengeluaran
- ✅ **Dashboard Analytics** - Grafik pendapatan vs pengeluaran, breakdown kategori
- ✅ **Warning Animations** - Notifikasi lucu saat melebihi batas
- ✅ **CSV Import/Export** - Ekspor dan impor data transaksi
- ✅ **Autentikasi** - Login/Register dengan email dan password

## Teknologi

### Web
- React + TypeScript
- Vite
- Tailwind CSS
- Recharts (charts)
- React Router
- Supabase (backend)
- Framer Motion (animations)

### Mobile
- React Native + Expo
- TypeScript
- React Navigation
- React Native Chart Kit
- Supabase (backend)
- React Native Reanimated (animations)

### Backend
- Supabase (PostgreSQL, Auth, Realtime)

## Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Supabase account (gratis)

### 1. Clone Repository
```bash
git clone <repository-url>
cd UangQu
```

### 2. Setup Supabase

1. Buat project di [Supabase](https://supabase.com)
2. Jalankan SQL scripts di folder `supabase/`:
   - `schema.sql` - Membuat tabel
   - `rls_policies.sql` - Setup Row Level Security
   - `functions.sql` - Membuat fungsi database
3. Ambil API keys dari Project Settings > API

### 3. Setup Web App

```bash
cd web
npm install
```

Buat file `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Jalankan development server:
```bash
npm run dev
```

### 4. Setup Mobile App

```bash
cd mobile
npm install
```

Konfigurasi Supabase di `app.json`:
```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "your_supabase_url",
      "supabaseAnonKey": "your_supabase_anon_key"
    }
  }
}
```

Jalankan:
```bash
npm start
```

## Project Structure

```
UangQu/
├── web/                 # React web app
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── hooks/      # Custom hooks
│   │   ├── contexts/   # React contexts
│   │   ├── types/      # TypeScript types
│   │   └── utils/      # Utility functions
├── mobile/             # React Native app
│   ├── src/
│   │   ├── screens/    # Screen components
│   │   ├── components/ # Reusable components
│   │   ├── services/   # API services
│   │   ├── hooks/      # Custom hooks
│   │   ├── contexts/   # React contexts
│   │   ├── types/      # TypeScript types
│   │   └── navigation/ # Navigation setup
└── supabase/           # Database scripts
    ├── schema.sql
    ├── rls_policies.sql
    └── functions.sql
```

## Deployment

### Web (Vercel/Netlify)

1. **Vercel:**
   ```bash
   cd web
   npm install -g vercel
   vercel
   ```
   Set environment variables di Vercel dashboard

2. **Netlify:**
   ```bash
   cd web
   npm run build
   ```
   Deploy folder `dist` ke Netlify dan set environment variables

### Mobile (Expo)

1. Build untuk development:
   ```bash
   cd mobile
   expo build:android
   expo build:ios
   ```

2. Atau gunakan EAS Build:
   ```bash
   npm install -g eas-cli
   eas build --platform android
   eas build --platform ios
   ```

## Development

### Web
```bash
cd web
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

### Mobile
```bash
cd mobile
npm start        # Start Expo dev server
npm run android  # Run on Android
npm run ios      # Run on iOS
```

## Environment Variables

### Web (.env)
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Mobile (app.json)
```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "your_supabase_project_url",
      "supabaseAnonKey": "your_supabase_anon_key"
    }
  }
}
```

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.

## Dokumentasi Lengkap

- **[SETUP-GUIDE.md](./SETUP-GUIDE.md)** - Panduan setup lengkap step-by-step
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Penjelasan arsitektur dan server online
- **[FRONTEND-DEPLOYMENT.md](./FRONTEND-DEPLOYMENT.md)** - **Penjelasan frontend: development vs production**
- **[GITHUB-SETUP.md](./GITHUB-SETUP.md)** - Panduan menghubungkan project ke GitHub
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Panduan deployment detail
- **[TESTING-CHECKLIST.md](./TESTING-CHECKLIST.md)** - Checklist testing lengkap
- **[supabase/README.md](./supabase/README.md)** - Setup Supabase

## Support

Untuk pertanyaan atau dukungan, silakan buat issue di repository ini.

## Roadmap

- [ ] Multi-currency support
- [ ] Recurring transactions
- [ ] Budget templates
- [ ] Financial goals tracking
- [ ] Reports & insights
- [ ] Dark mode improvements
- [ ] Offline mode support

