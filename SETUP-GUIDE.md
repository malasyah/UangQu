# Panduan Setup Lengkap UangQu

Dokumen ini berisi langkah-langkah detail untuk setup, testing, dan deployment aplikasi UangQu.

## Daftar Isi

1. [Persiapan Awal](#1-persiapan-awal)
2. [Setup Supabase](#2-setup-supabase)
3. [Setup Web Application](#3-setup-web-application)
4. [Setup Mobile Application](#4-setup-mobile-application)
5. [Testing Aplikasi](#5-testing-aplikasi)
6. [Deployment Web](#6-deployment-web)
7. [Deployment Mobile](#7-deployment-mobile)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Persiapan Awal

### 1.1 Install Tools yang Diperlukan

**Node.js dan npm:**
```bash
# Download dan install Node.js dari https://nodejs.org/
# Pilih versi LTS (Long Term Support)
# Setelah install, verifikasi:
node --version  # Harus v18 atau lebih tinggi
npm --version   # Harus v9 atau lebih tinggi
```

**Git (jika belum ada):**
```bash
# Download dari https://git-scm.com/
git --version
```

**Code Editor:**
- Visual Studio Code (disarankan): https://code.visualstudio.com/
- Atau editor lain yang mendukung TypeScript

### 1.2 Verifikasi Struktur Project

Pastikan struktur folder sudah lengkap:
```
UangQu/
├── web/
│   ├── src/
│   ├── package.json
│   └── ...
├── mobile/
│   ├── src/
│   ├── package.json
│   └── ...
├── supabase/
│   ├── schema.sql
│   ├── rls_policies.sql
│   └── functions.sql
├── README.md
├── DEPLOYMENT.md
└── SETUP-GUIDE.md (file ini)
```

---

## 2. Setup Supabase

### 2.1 Membuat Akun Supabase

1. **Buka browser** dan kunjungi: https://supabase.com
2. **Klik "Start your project"** atau "Sign Up"
3. **Pilih metode sign up:**
   - GitHub (disarankan)
   - Email
   - Google
4. **Verifikasi email** jika menggunakan email

### 2.2 Membuat Project Baru

1. **Setelah login**, klik **"New Project"**
2. **Isi form:**
   - **Organization:** Pilih atau buat baru
   - **Name:** `UangQu` (atau nama lain)
   - **Database Password:** Buat password kuat (simpan dengan aman!)
     - Minimal 12 karakter
     - Kombinasi huruf, angka, simbol
     - Contoh: `MySecurePass123!@#`
   - **Region:** Pilih yang terdekat dengan pengguna
     - Untuk Indonesia: `Southeast Asia (Singapore)`
   - **Pricing Plan:** Pilih **Free** untuk development
3. **Klik "Create new project"**
4. **Tunggu 2-3 menit** sampai project siap

### 2.3 Menjalankan SQL Scripts

1. **Buka SQL Editor:**
   - Di dashboard Supabase, klik menu **"SQL Editor"** di sidebar kiri
   - Atau langsung: https://app.supabase.com/project/_/sql/new

2. **Jalankan schema.sql:**
   - Buka file `supabase/schema.sql` di editor
   - Copy semua isinya
   - Paste ke SQL Editor di Supabase
   - Klik **"Run"** atau tekan `Ctrl+Enter`
   - Pastikan muncul pesan sukses: "Success. No rows returned"

3. **Jalankan rls_policies.sql:**
   - Buka file `supabase/rls_policies.sql`
   - Copy semua isinya
   - Paste ke SQL Editor (buat query baru)
   - Klik **"Run"**
   - Verifikasi: Harus ada pesan sukses

4. **Jalankan functions.sql:**
   - Buka file `supabase/functions.sql`
   - Copy semua isinya
   - Paste ke SQL Editor (buat query baru)
   - Klik **"Run"**
   - Verifikasi: Harus ada pesan sukses

5. **Verifikasi Tables:**
   - Klik menu **"Table Editor"** di sidebar
   - Pastikan ada 4 tabel:
     - `categories`
     - `transactions`
     - `limits`
     - `targets`

### 2.4 Konfigurasi Authentication

1. **Buka Authentication Settings:**
   - Klik menu **"Authentication"** > **"Settings"**

2. **Enable Email Provider:**
   - Scroll ke bagian **"Auth Providers"**
   - Pastikan **"Email"** sudah enabled (default enabled)
   - Jika belum, toggle ON

3. **Konfigurasi Email Templates (Opsional):**
   - Klik **"Email Templates"**
   - Bisa custom template untuk:
     - Confirm signup
     - Reset password
     - Magic link
   - Untuk development, default sudah cukup

4. **Set Redirect URLs:**
   - Scroll ke **"URL Configuration"**
   - **Site URL:** `http://localhost:5173` (untuk development)
   - **Redirect URLs:** Tambahkan:
     ```
     http://localhost:5173/**
     http://localhost:5173/dashboard
     http://localhost:5173/login
     ```
   - Klik **"Save"**

### 2.5 Mengambil API Keys

1. **Buka Project Settings:**
   - Klik ikon **gear** (⚙️) di sidebar kiri
   - Pilih **"API"**

2. **Copy Keys:**
   - **Project URL:** Copy (contoh: `https://xxxxx.supabase.co`)
   - **anon public key:** Copy (panjang, mulai dengan `eyJ...`)
   - **service_role key:** JANGAN copy ke client! Hanya untuk server-side

3. **Simpan dengan aman:**
   - Buat file `web/.env` (akan dibuat di langkah berikutnya)
   - Jangan commit file `.env` ke Git!

---

## 3. Setup Web Application

### 3.1 Install Dependencies

1. **Buka terminal/command prompt**
2. **Masuk ke folder web:**
   ```bash
   cd web
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
   - Proses ini akan memakan waktu 1-2 menit
   - Pastikan tidak ada error

4. **Verifikasi install:**
   ```bash
   npm list --depth=0
   ```
   - Harus menampilkan semua package yang terinstall

### 3.2 Konfigurasi Environment Variables

1. **Buat file `.env` di folder `web/`:**
   ```bash
   # Di Windows (PowerShell)
   New-Item -Path .env -ItemType File
   
   # Di Mac/Linux
   touch .env
   ```

2. **Edit file `.env`** dengan editor:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   - Ganti dengan URL dan key yang sudah di-copy dari Supabase
   - Jangan ada spasi sebelum/sesudah `=`
   - Jangan pakai tanda kutip

3. **Verifikasi file `.env`:**
   - Pastikan file ada di `web/.env`
   - Pastikan tidak ter-commit ke Git (cek `.gitignore`)

### 3.3 Menjalankan Development Server

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Buka browser:**
   - Akan muncul URL seperti: `http://localhost:5173`
   - Buka URL tersebut di browser
   - Harus muncul halaman UangQu

3. **Test basic functionality:**
   - Klik "Sign up" atau "Sign in"
   - Coba register akun baru
   - Cek email untuk verifikasi (jika enabled)

### 3.4 Verifikasi Setup Web

**Checklist:**
- [ ] Dependencies terinstall tanpa error
- [ ] File `.env` sudah dibuat dan berisi keys
- [ ] Dev server berjalan di `http://localhost:5173`
- [ ] Halaman login/register muncul
- [ ] Tidak ada error di browser console (F12)

**Jika ada error:**
- Cek terminal untuk error messages
- Cek browser console (F12 > Console)
- Pastikan environment variables sudah benar
- Pastikan Supabase project sudah aktif

---

## 4. Setup Mobile Application

### 4.1 Install Dependencies

1. **Buka terminal baru** (biarkan web server tetap jalan)
2. **Masuk ke folder mobile:**
   ```bash
   cd mobile
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
   - Proses ini lebih lama (2-3 menit)
   - Pastikan tidak ada error

### 4.2 Install Expo CLI (jika belum)

```bash
npm install -g expo-cli
# atau
npm install -g @expo/cli
```

### 4.3 Konfigurasi Environment Variables

1. **Edit file `mobile/app.json`:**
   ```json
   {
     "expo": {
       "name": "UangQu",
       "slug": "uangqu",
       "extra": {
         "supabaseUrl": "https://xxxxx.supabase.co",
         "supabaseAnonKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
       }
     }
   }
   ```
   - Ganti dengan URL dan key dari Supabase
   - Simpan file

### 4.4 Menjalankan Mobile App

**Opsi 1: Menggunakan Expo Go (Paling Mudah)**

1. **Install Expo Go di smartphone:**
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Start Expo server:**
   ```bash
   cd mobile
   npm start
   # atau
   expo start
   ```

3. **Scan QR Code:**
   - Akan muncul QR code di terminal
   - Buka Expo Go di smartphone
   - Scan QR code
   - Tunggu app loading

**Opsi 2: Menggunakan Emulator**

**Android:**
1. Install Android Studio
2. Setup Android Virtual Device (AVD)
3. Jalankan:
   ```bash
   npm run android
   ```

**iOS (hanya Mac):**
1. Install Xcode
2. Setup iOS Simulator
3. Jalankan:
   ```bash
   npm run ios
   ```

### 4.5 Verifikasi Setup Mobile

**Checklist:**
- [ ] Dependencies terinstall tanpa error
- [ ] `app.json` sudah dikonfigurasi
- [ ] Expo server berjalan
- [ ] App bisa dibuka di Expo Go/emulator
- [ ] Halaman login muncul
- [ ] Tidak ada error di terminal

---

## 5. Testing Aplikasi

### 5.1 Testing Web Application

**Test Authentication:**
1. **Register akun baru:**
   - Buka `http://localhost:5173`
   - Klik "Sign up"
   - Isi email dan password
   - Submit
   - Cek email untuk verifikasi (jika enabled)

2. **Login:**
   - Klik "Sign in"
   - Masukkan email dan password
   - Harus redirect ke dashboard

3. **Forgot Password:**
   - Klik "Forgot your password?"
   - Masukkan email
   - Cek email untuk reset link

**Test Transaction Management:**
1. **Buat kategori:**
   - Klik menu "Categories"
   - Klik "Add Category"
   - Isi form dan submit
   - Verifikasi kategori muncul di list

2. **Buat transaksi:**
   - Klik menu "Transactions"
   - Klik "Add Transaction"
   - Isi form:
     - Type: Expense
     - Category: Pilih kategori
     - Amount: 50000
     - Date: Pilih tanggal
   - Submit
   - Verifikasi transaksi muncul di list

3. **Edit transaksi:**
   - Klik "Edit" pada transaksi
   - Ubah amount
   - Submit
   - Verifikasi perubahan

4. **Delete transaksi:**
   - Klik "Delete" pada transaksi
   - Confirm
   - Verifikasi transaksi hilang

**Test Dashboard:**
1. **Buat beberapa transaksi:**
   - Buat 3-5 transaksi income
   - Buat 3-5 transaksi expense
   - Dengan kategori berbeda

2. **Cek dashboard:**
   - Klik menu "Dashboard"
   - Verifikasi:
     - Balance summary muncul
     - Charts menampilkan data
     - Recent transactions muncul

**Test Limits & Targets:**
1. **Buat limit:**
   - Klik menu "Limits"
   - Klik "Add Limit"
   - Isi form:
     - Period: Monthly
     - Amount: 1000000
     - Category: (optional)
   - Submit

2. **Buat target:**
   - Klik menu "Targets"
   - Klik "Add Target"
   - Isi form:
     - Type: Savings
     - Amount: 5000000
     - Period: Monthly
     - Deadline: Pilih tanggal
   - Submit

**Test CSV Export/Import:**
1. **Export:**
   - Klik menu "Export"
   - Pilih date range
   - Klik "Export to CSV"
   - File harus terdownload

2. **Import:**
   - Klik menu "Import"
   - Pilih file CSV
   - Verifikasi parsing
   - Klik "Import Transactions"
   - Verifikasi data masuk

### 5.2 Testing Mobile Application

**Test Navigation:**
1. **Login/Register:**
   - Buka app
   - Test register akun baru
   - Test login

2. **Bottom Tabs:**
   - Dashboard tab
   - Transactions tab
   - Categories tab

**Test Features:**
1. **Transactions:**
   - Swipe untuk edit/delete
   - Add transaction
   - Filter by type

2. **Dashboard:**
   - Scroll untuk lihat semua
   - Pull to refresh
   - Charts harus render

3. **Categories:**
   - Add category
   - Edit category
   - Delete category

### 5.3 Testing Warning Animations

1. **Setup limit yang mudah dilanggar:**
   - Buat limit harian: 10000
   - Buat transaksi expense: 15000
   - Warning animation harus muncul

2. **Verifikasi:**
   - Web: Warning muncul di pojok kanan atas
   - Mobile: Warning muncul di atas screen
   - Animation harus smooth

---

## 6. Deployment Web

### 6.1 Deployment ke Vercel

**Persiapan:**
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```
   - Pilih login method (GitHub/Email)
   - Follow instructions

**Deploy:**
1. **Masuk ke folder web:**
   ```bash
   cd web
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow prompts:**
   - Set up and deploy? **Y**
   - Which scope? Pilih akun
   - Link to existing project? **N**
   - Project name? `uangqu-web` (atau nama lain)
   - Directory? `./` (current directory)
   - Override settings? **N**

4. **Set Environment Variables:**
   - Buka Vercel Dashboard: https://vercel.com/dashboard
   - Pilih project
   - Settings > Environment Variables
   - Add:
     - Name: `VITE_SUPABASE_URL`
     - Value: (URL dari Supabase)
   - Add:
     - Name: `VITE_SUPABASE_ANON_KEY`
     - Value: (Key dari Supabase)
   - Save

5. **Redeploy:**
   - Klik "Redeploy" di dashboard
   - Atau:
     ```bash
     vercel --prod
     ```

6. **Update Supabase Redirect URLs:**
   - Buka Supabase Dashboard
   - Authentication > URL Configuration
   - Tambahkan production URL dari Vercel
   - Save

### 6.2 Deployment ke Netlify

**Persiapan:**
1. **Build aplikasi:**
   ```bash
   cd web
   npm run build
   ```

2. **Verifikasi folder `dist` terbuat**

**Deploy via Drag & Drop:**
1. Buka: https://app.netlify.com/drop
2. Drag folder `web/dist` ke browser
3. Tunggu upload dan deploy

**Deploy via Git:**
1. Push code ke GitHub
2. Buka: https://app.netlify.com
3. "Add new site" > "Import an existing project"
4. Connect GitHub
5. Pilih repository
6. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Deploy

**Set Environment Variables:**
1. Site settings > Environment variables
2. Add variables (sama seperti Vercel)
3. Redeploy

---

## 7. Deployment Mobile

### 7.1 Setup EAS (Expo Application Services)

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login:**
   ```bash
   eas login
   ```

3. **Configure project:**
   ```bash
   cd mobile
   eas build:configure
   ```
   - Pilih platform: `all`
   - Build profile: `production`

### 7.2 Build Android APK

1. **Update app.json:**
   ```json
   {
     "expo": {
       "version": "1.0.0",
       "android": {
         "package": "com.yourname.uangqu",
         "versionCode": 1
       }
     }
   }
   ```

2. **Build:**
   ```bash
   eas build --platform android --profile production
   ```

3. **Tunggu build selesai** (10-20 menit)
4. **Download APK** dari EAS dashboard

### 7.3 Build iOS

1. **Update app.json:**
   ```json
   {
     "expo": {
       "ios": {
         "bundleIdentifier": "com.yourname.uangqu",
         "buildNumber": "1"
       }
     }
   }
   ```

2. **Build:**
   ```bash
   eas build --platform ios --profile production
   ```

3. **Tunggu build selesai**
4. **Download IPA** dari EAS dashboard

### 7.4 Submit ke App Stores

**Android (Google Play):**
1. Buat akun Google Play Developer ($25 one-time)
2. Upload APK/AAB
3. Isi store listing
4. Submit for review

**iOS (App Store):**
1. Buat akun Apple Developer ($99/year)
2. Upload IPA via Xcode/Transporter
3. Isi App Store Connect
4. Submit for review

---

## 8. Troubleshooting

### 8.1 Web Issues

**Error: "Cannot find module"**
```bash
# Solution:
cd web
rm -rf node_modules package-lock.json
npm install
```

**Error: "Environment variables not found"**
- Pastikan file `.env` ada di folder `web/`
- Pastikan format benar (tidak ada spasi, tidak pakai kutip)
- Restart dev server

**Charts tidak muncul:**
- Cek browser console untuk error
- Pastikan data sudah ada
- Cek Recharts sudah terinstall

### 8.2 Mobile Issues

**Error: "Expo CLI not found"**
```bash
npm install -g @expo/cli
```

**App tidak load di Expo Go:**
- Pastikan smartphone dan komputer di network yang sama
- Cek firewall tidak block port 19000
- Restart Expo server

**Build error:**
- Update dependencies: `npm update`
- Clear cache: `expo start -c`
- Check app.json format

### 8.3 Supabase Issues

**Authentication tidak bekerja:**
- Cek redirect URLs sudah benar
- Verifikasi email provider enabled
- Cek RLS policies

**Database error:**
- Verifikasi semua SQL scripts sudah dijalankan
- Cek table structure di Table Editor
- Review error logs di Supabase dashboard

### 8.4 Deployment Issues

**Vercel build fails:**
- Cek build logs di dashboard
- Pastikan environment variables sudah set
- Verifikasi Node.js version

**Netlify build fails:**
- Cek build command benar
- Pastikan publish directory: `dist`
- Review build logs

---

## Checklist Final

Sebelum production, pastikan:

**Security:**
- [ ] Environment variables tidak ter-commit
- [ ] RLS policies aktif
- [ ] API keys aman
- [ ] Password kuat untuk database

**Functionality:**
- [ ] Semua fitur ter-test
- [ ] Tidak ada error di console
- [ ] Responsive design OK
- [ ] Mobile app stabil

**Performance:**
- [ ] Loading cepat
- [ ] Charts render dengan baik
- [ ] Tidak ada memory leaks

**Documentation:**
- [ ] README updated
- [ ] Setup guide clear
- [ ] Deployment steps documented

---

## Support

Jika mengalami masalah:
1. Cek error messages dengan detail
2. Review logs (browser console, terminal, Supabase logs)
3. Cek dokumentasi resmi:
   - [Supabase Docs](https://supabase.com/docs)
   - [React Docs](https://react.dev)
   - [Expo Docs](https://docs.expo.dev)
4. Buat issue di repository dengan detail error

---

**Selamat! Aplikasi UangQu siap digunakan! 🎉**

