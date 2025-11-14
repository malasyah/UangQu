# Arsitektur Aplikasi UangQu

## Overview

Aplikasi UangQu menggunakan **Supabase** sebagai Backend-as-a-Service (BaaS) yang berjalan di cloud/server online.

## Arsitektur Sistem

```
┌─────────────────┐         ┌─────────────────┐
│   Web App       │         │  Mobile App     │
│  (React + Vite) │         │ (React Native)  │
└────────┬────────┘         └────────┬────────┘
         │                            │
         │    HTTPS/REST API          │
         │    WebSocket (Realtime)    │
         │                            │
         └────────────┬───────────────┘
                      │
         ┌────────────▼────────────┐
         │   Supabase Cloud        │
         │   (Server Online)       │
         │                         │
         │  ┌──────────────────┐  │
         │  │  PostgreSQL DB   │  │
         │  │  (Database)      │  │
         │  └──────────────────┘  │
         │                         │
         │  ┌──────────────────┐  │
         │  │  Auth Service    │  │
         │  │  (Authentication)│  │
         │  └──────────────────┘  │
         │                         │
         │  ┌──────────────────┐  │
         │  │  Storage Service  │  │
         │  │  (File Storage)   │  │
         │  └──────────────────┘  │
         │                         │
         │  ┌──────────────────┐  │
         │  │  Realtime API     │  │
         │  │  (Live Updates)   │  │
         │  └──────────────────┘  │
         └─────────────────────────┘
```

## Komponen Server Online

### 1. Supabase (Backend Cloud)

**Apa itu Supabase?**
- Platform Backend-as-a-Service (BaaS) open-source
- Menyediakan database, authentication, storage, dan realtime API
- Berjalan di cloud (server online)
- Tidak perlu setup server sendiri

**Lokasi Server:**
- Server Supabase berada di cloud (bisa pilih region)
- Untuk Indonesia: Region **Southeast Asia (Singapore)**
- URL server: `https://xxxxx.supabase.co`

**Layanan yang Digunakan:**

#### a. PostgreSQL Database
- Database relasional di cloud
- Menyimpan: transactions, categories, limits, targets
- Akses via REST API atau langsung (dengan credentials)

#### b. Authentication Service
- Login/Register dengan email & password
- Password reset
- Session management
- JWT tokens untuk security

#### c. Row Level Security (RLS)
- Security layer di database
- Memastikan user hanya bisa akses data sendiri
- Tidak perlu backend server untuk validasi

#### d. Realtime API
- Update data secara real-time
- Bisa digunakan untuk live notifications
- WebSocket connection

### 2. Frontend Applications

**Web App (React):**
- Berjalan di browser user
- Terhubung ke Supabase via HTTPS
- Tidak perlu server sendiri
- Bisa di-deploy ke Vercel/Netlify (static hosting)

**Mobile App (React Native):**
- Berjalan di smartphone user
- Terhubung ke Supabase via HTTPS
- Tidak perlu server sendiri
- Build menjadi APK/IPA

## Alur Data

### Contoh: User Membuat Transaksi

1. **User input data** di web/mobile app
2. **App mengirim request** ke Supabase API:
   ```
   POST https://xxxxx.supabase.co/rest/v1/transactions
   Headers: {
     Authorization: Bearer <JWT_TOKEN>
   }
   Body: {
     amount: 50000,
     type: "expense",
     category_id: "xxx",
     date: "2024-01-15"
   }
   ```
3. **Supabase memvalidasi:**
   - Cek authentication (JWT token)
   - Cek RLS policies (user hanya bisa insert data sendiri)
   - Validasi data
4. **Supabase menyimpan** ke PostgreSQL database
5. **Supabase mengirim response** ke app
6. **App update UI** dengan data baru

## Keuntungan Menggunakan Server Online (Supabase)

### ✅ Tidak Perlu Setup Server Sendiri
- Tidak perlu beli VPS/server
- Tidak perlu install database
- Tidak perlu maintain server
- Tidak perlu handle scaling

### ✅ Gratis untuk Development
- Free tier cukup untuk development
- 500MB database
- 2GB bandwidth
- Unlimited API requests

### ✅ Security Built-in
- HTTPS otomatis
- Row Level Security
- Authentication ready
- Auto backups

### ✅ Scalable
- Auto-scaling
- Bisa upgrade ke paid plan jika perlu
- Handle traffic tinggi otomatis

### ✅ Real-time Updates
- WebSocket support
- Live data sync
- Instant notifications

## Biaya

### Free Tier (Development)
- ✅ Database: 500MB
- ✅ Bandwidth: 2GB/month
- ✅ API requests: Unlimited
- ✅ Authentication: Unlimited users
- **Cocok untuk:** Development, testing, small apps

### Paid Plans (Production)
- **Pro Plan:** $25/month
  - Database: 8GB
  - Bandwidth: 250GB/month
  - Better performance
  - Priority support

## Alternatif (Jika Tidak Mau Pakai Server Online)

### Option 1: Self-Hosted Supabase
- Install Supabase di server sendiri
- Butuh VPS/server
- Butuh maintenance
- Lebih kompleks

### Option 2: Backend Sendiri
- Buat API server sendiri (Node.js, Python, dll)
- Setup database sendiri
- Handle authentication sendiri
- Lebih banyak kerja

### Option 3: Local Database (Tidak Disarankan)
- SQLite untuk mobile
- LocalStorage untuk web
- Data tidak sync antar device
- Tidak bisa real-time

## Kesimpulan

**Ya, aplikasi ini menggunakan server online (Supabase).**

**Kenapa?**
- ✅ Lebih mudah (tidak perlu setup server)
- ✅ Lebih aman (security built-in)
- ✅ Lebih cepat development
- ✅ Gratis untuk development
- ✅ Data sync otomatis antar device
- ✅ Real-time updates

**Apakah data aman?**
- ✅ Ya, dengan Row Level Security
- ✅ Setiap user hanya bisa akses data sendiri
- ✅ HTTPS encryption
- ✅ JWT authentication

**Apakah bisa offline?**
- ⚠️ Saat ini belum support offline mode
- Data hanya tersimpan di Supabase
- Bisa ditambahkan offline support nanti dengan:
  - Local caching
  - Sync queue
  - Service workers

## Setup Server Online

Untuk setup Supabase (server online), ikuti panduan di:
- **[SETUP-GUIDE.md](./SETUP-GUIDE.md)** - Section 2: Setup Supabase
- **[supabase/README.md](./supabase/README.md)** - Detail setup

## Monitoring & Management

Setelah setup, Anda bisa:
- Monitor usage di Supabase Dashboard
- Lihat database di Table Editor
- Cek API logs
- Manage users
- Backup/restore data

---

**TL;DR:** Aplikasi ini menggunakan **Supabase sebagai server online di cloud**. Tidak perlu setup server sendiri, cukup buat project di Supabase dan dapatkan API keys. Data disimpan di PostgreSQL database di cloud Supabase.

