# Frontend Deployment - Web & Mobile

Dokumen ini menjelaskan bagaimana frontend aplikasi UangQu di-deploy dan dijalankan.

## Overview

Aplikasi UangQu memiliki **2 frontend**:
1. **Web App** (React) - untuk browser
2. **Mobile App** (React Native) - untuk smartphone

**Keduanya TIDAK perlu server sendiri!** Berikut penjelasannya:

---

## 1. Web App (React)

### Apa itu Web App?
- Aplikasi React yang berjalan di browser
- Setelah di-build, menjadi **static files** (HTML, CSS, JavaScript)
- Tidak perlu server backend untuk menjalankannya
- Hanya perlu **static hosting** (seperti hosting file biasa)

### Development (Lokal)

**Harus running di lokal untuk development:**

```bash
cd web
npm install
npm run dev
```

**Hasil:**
- App berjalan di: `http://localhost:5173`
- Hanya bisa diakses dari komputer yang menjalankan
- Hot reload otomatis saat edit code
- **Ini hanya untuk development/testing**

### Production (Online)

**TIDAK perlu server sendiri!** Bisa di-deploy ke hosting **GRATIS**:

#### Option 1: Vercel (Paling Mudah) ⭐

**Gratis & Otomatis:**
1. Push code ke GitHub
2. Import ke Vercel
3. Set environment variables
4. **Selesai!** App langsung online

**URL yang didapat:**
- `https://uangqu.vercel.app` (atau custom domain)

**Keuntungan:**
- ✅ Gratis
- ✅ Auto-deploy dari GitHub
- ✅ HTTPS otomatis
- ✅ CDN global (cepat di mana saja)
- ✅ Tidak perlu setup server

#### Option 2: Netlify (Alternatif)

**Juga Gratis:**
1. Build: `npm run build`
2. Upload folder `dist` ke Netlify
3. Set environment variables
4. **Selesai!**

**URL yang didapat:**
- `https://uangqu.netlify.app`

#### Option 3: GitHub Pages (Gratis)

**Untuk static sites:**
1. Build: `npm run build`
2. Deploy folder `dist` ke GitHub Pages
3. URL: `https://username.github.io/UangQu`

### Cara Kerja Web App

```
User membuka browser
    ↓
Ketik URL: https://uangqu.vercel.app
    ↓
Vercel mengirimkan static files (HTML, CSS, JS)
    ↓
Browser download & jalankan files
    ↓
App berjalan di browser user
    ↓
App connect ke Supabase (server online)
    ↓
Data ditampilkan
```

**Yang terjadi:**
- Static files (HTML, CSS, JS) di-host di Vercel/Netlify
- App berjalan di **browser user** (client-side)
- App connect langsung ke Supabase (tidak melalui server sendiri)
- **Tidak ada server backend yang perlu dijalankan!**

### Build Process

```bash
cd web
npm run build
```

**Hasil:**
- Folder `dist/` berisi static files
- File-file ini yang di-upload ke hosting
- Tidak perlu Node.js di server hosting
- Cukup static file hosting (seperti hosting gambar)

---

## 2. Mobile App (React Native)

### Apa itu Mobile App?
- Aplikasi native untuk Android & iOS
- Di-build menjadi **APK** (Android) atau **IPA** (iOS)
- Diinstall langsung di smartphone user
- Berjalan di device user (tidak perlu server)

### Development (Lokal)

**Harus running di lokal untuk development:**

**Option 1: Expo Go (Paling Mudah)**
```bash
cd mobile
npm install
npm start
```
- Scan QR code dengan Expo Go app
- App berjalan di smartphone
- **Ini hanya untuk development/testing**

**Option 2: Emulator**
```bash
npm run android  # Android emulator
npm run ios      # iOS simulator (Mac only)
```

### Production (Build & Install)

**TIDAK perlu server!** App di-build menjadi file install:

#### Android (APK)

**Build:**
```bash
cd mobile
eas build --platform android
```

**Hasil:**
- File `.apk` atau `.aab`
- Download dari EAS dashboard
- Install di Android device
- **App berjalan di device, tidak perlu server**

**Distribusi:**
- Install langsung (sideload)
- Upload ke Google Play Store
- Share file APK

#### iOS (IPA)

**Build:**
```bash
cd mobile
eas build --platform ios
```

**Hasil:**
- File `.ipa`
- Install via Xcode/TestFlight
- Upload ke App Store
- **App berjalan di device, tidak perlu server**

### Cara Kerja Mobile App

```
User install app di smartphone
    ↓
Buka app
    ↓
App berjalan di device (native)
    ↓
App connect ke Supabase (server online)
    ↓
Data ditampilkan
```

**Yang terjadi:**
- App sudah diinstall di device
- Berjalan sebagai aplikasi native
- Connect langsung ke Supabase
- **Tidak ada server yang perlu dijalankan!**

---

## Perbandingan: Development vs Production

### Web App

| Aspek | Development | Production |
|-------|------------|------------|
| **Lokasi** | Local (localhost:5173) | Online (Vercel/Netlify) |
| **Akses** | Hanya dari komputer sendiri | Dari mana saja (internet) |
| **Server** | Vite dev server (lokal) | Static hosting (gratis) |
| **URL** | http://localhost:5173 | https://uangqu.vercel.app |
| **Biaya** | Gratis | Gratis (free tier) |

### Mobile App

| Aspek | Development | Production |
|-------|------------|------------|
| **Lokasi** | Expo Go / Emulator | Device user |
| **Akses** | Hanya device yang terhubung | Semua device yang install |
| **Server** | Expo dev server (lokal) | Tidak perlu (app di device) |
| **Distribusi** | QR code scan | APK/IPA file |
| **Biaya** | Gratis | Gratis (build) / $99/year (App Store) |

---

## Arsitektur Lengkap

```
┌─────────────────────────────────────────┐
│         FRONTEND (Tidak Perlu Server)  │
├─────────────────────────────────────────┤
│                                         │
│  Web App (React)                       │
│  ├─ Development: localhost:5173        │
│  └─ Production: Vercel/Netlify (gratis)│
│                                         │
│  Mobile App (React Native)             │
│  ├─ Development: Expo Go / Emulator     │
│  └─ Production: APK/IPA (di device)    │
│                                         │
└──────────────┬──────────────────────────┘
               │
               │ HTTPS API Calls
               │
┌──────────────▼──────────────────────────┐
│      BACKEND (Server Online)            │
│                                         │
│  Supabase Cloud                         │
│  ├─ PostgreSQL Database                │
│  ├─ Authentication                      │
│  └─ API Endpoints                       │
│                                         │
└─────────────────────────────────────────┘
```

---

## Kesimpulan

### Web App
- ✅ **Development:** Harus running di lokal (`npm run dev`)
- ✅ **Production:** Deploy ke Vercel/Netlify (gratis, tidak perlu server sendiri)
- ✅ **Tidak perlu server backend** - hanya static hosting

### Mobile App
- ✅ **Development:** Harus running di lokal (Expo Go/emulator)
- ✅ **Production:** Build menjadi APK/IPA, install di device
- ✅ **Tidak perlu server** - app berjalan di device user

### Backend
- ✅ **Selalu online:** Supabase (server cloud)
- ✅ **Tidak perlu setup server sendiri**

---

## FAQ

### Q: Apakah perlu beli server untuk frontend?
**A:** Tidak! Web app bisa di-deploy ke Vercel/Netlify (gratis). Mobile app di-build dan diinstall di device.

### Q: Apakah web app bisa diakses dari internet?
**A:** Ya, setelah di-deploy ke Vercel/Netlify. URL akan seperti: `https://uangqu.vercel.app`

### Q: Apakah mobile app perlu internet?
**A:** Ya, untuk connect ke Supabase. Tapi app sendiri berjalan di device (tidak perlu server untuk app).

### Q: Apakah bisa pakai server sendiri?
**A:** Bisa, tapi tidak perlu. Untuk web app, bisa pakai VPS + Nginx. Tapi Vercel/Netlify lebih mudah dan gratis.

### Q: Berapa biaya hosting frontend?
**A:** 
- Web app: **Gratis** (Vercel/Netlify free tier)
- Mobile app: **Gratis** (build gratis, App Store $99/year jika mau publish)

---

## Langkah Deployment

### Web App ke Vercel (5 menit)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd web
   vercel
   ```

4. **Set Environment Variables:**
   - Vercel Dashboard > Settings > Environment Variables
   - Add: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`

5. **Selesai!** App online di `https://your-app.vercel.app`

### Mobile App Build (10-20 menit)

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login:**
   ```bash
   eas login
   ```

3. **Build:**
   ```bash
   cd mobile
   eas build --platform android
   ```

4. **Download APK** dari EAS dashboard
5. **Install** di Android device

---

**TL;DR:** 
- **Web App:** Development di lokal, Production di Vercel/Netlify (gratis, tidak perlu server)
- **Mobile App:** Development di lokal, Production di-build jadi APK/IPA (tidak perlu server)
- **Backend:** Supabase (server online, tidak perlu setup sendiri)

