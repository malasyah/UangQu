# Payday Period Feature Guide

## Overview

Fitur Payday Period memungkinkan setiap user untuk mengatur tanggal gajian mereka sendiri (1-31). Semua perhitungan keuangan, laporan, batasan, dan target akan menggunakan periode gajian sebagai dasar, bukan kalender bulan.

## Cara Kerja

### Contoh:
- **User A**: Gajian tanggal 25
  - Periode: 25 Jan - 24 Feb, 25 Feb - 24 Mar, dst.
  
- **User B**: Gajian tanggal 1
  - Periode: 1 Jan - 31 Jan, 1 Feb - 28 Feb, dst.
  
- **User C**: Gajian tanggal 5
  - Periode: 5 Jan - 4 Feb, 5 Feb - 4 Mar, dst.

## Setup

### 1. Database Migration

Jalankan SQL migration di Supabase:

1. Buka Supabase Dashboard > SQL Editor
2. Copy isi file `supabase/migrations/add_payday_date.sql`
3. Paste dan jalankan di SQL Editor
4. Verifikasi: `SELECT * FROM user_settings;`

### 2. Set Payday Date

1. Login ke aplikasi
2. Buka menu **⚙️ Settings**
3. Masukkan tanggal gajian (1-31)
4. Klik **Save Settings**

## Fitur yang Menggunakan Payday Period

### 1. Dashboard
- **Current Period**: Periode gajian saat ini
- **Last Period**: Periode gajian sebelumnya
- Semua statistik (income, expense, balance) dihitung berdasarkan periode gajian
- Chart menampilkan data per periode gajian (bukan per bulan kalender)

### 2. Limits (Batas Pengeluaran)
- Limit dengan period_type "monthly" menggunakan periode gajian
- Start date otomatis di-set ke awal periode gajian saat ini
- Pengecekan violation menggunakan periode gajian

### 3. Targets (Target Tabungan)
- Target dengan period_type "monthly" menggunakan periode gajian
- Progress dihitung berdasarkan periode gajian saat ini

### 4. Transactions
- Filter Start Date & End Date tetap manual (user bisa pilih sendiri)
- Tapi default period di Dashboard menggunakan payday period

### 5. Export/Import
- Tetap menggunakan date range yang dipilih user
- Tidak terpengaruh payday period

## Perhitungan Periode

### Formula:
```
Jika hari ini < tanggal gajian:
  Periode dimulai: tanggal gajian bulan lalu
  Periode berakhir: tanggal gajian - 1 hari ini

Jika hari ini >= tanggal gajian:
  Periode dimulai: tanggal gajian bulan ini
  Periode berakhir: tanggal gajian - 1 bulan depan
```

### Contoh Praktis:

**Tanggal Gajian: 25**
- Jika hari ini: 15 Januari
  - Periode: 25 Des - 24 Jan (masih periode sebelumnya)
  
- Jika hari ini: 30 Januari
  - Periode: 25 Jan - 24 Feb (periode saat ini)

## Default Behavior

- Jika user belum set payday_date, default = **1** (tanggal 1 setiap bulan)
- Semua perhitungan akan menggunakan tanggal 1 sebagai gajian

## Benefits

1. **Fleksibel**: Setiap user bisa set tanggal gajian sesuai kebutuhan
2. **Akurat**: Laporan sesuai dengan siklus gajian user
3. **Relevan**: Limits dan targets lebih berarti karena sesuai periode gajian
4. **Konsisten**: Semua fitur menggunakan periode yang sama

## Technical Details

### Files Created:
- `supabase/migrations/add_payday_date.sql` - Database migration
- `web/src/utils/paydayPeriod.ts` - Utility functions untuk perhitungan periode
- `web/src/services/userSettingsService.ts` - Service untuk manage user settings
- `web/src/pages/Settings.tsx` - Halaman untuk set payday date

### Files Modified:
- `web/src/pages/Dashboard.tsx` - Menggunakan payday period
- `web/src/pages/Limits.tsx` - Menggunakan payday period untuk monthly limits
- `web/src/pages/Targets.tsx` - Menggunakan payday period untuk monthly targets
- `web/src/components/Navigation.tsx` - Tambah link Settings
- `web/src/App.tsx` - Tambah route Settings

## Troubleshooting

### Q: Periode tidak sesuai?
**A:** Pastikan sudah set payday_date di Settings dan refresh halaman.

### Q: Database error saat set payday?
**A:** Pastikan sudah menjalankan migration SQL `add_payday_date.sql`.

### Q: Limit violation tidak akurat?
**A:** Pastikan limit menggunakan period_type "monthly" dan start_date sesuai periode gajian.

## Future Enhancements

- [ ] Support untuk gajian 2x sebulan (bi-weekly)
- [ ] Notifikasi saat mendekati akhir periode gajian
- [ ] Auto-reset limits di awal periode gajian baru
- [ ] Summary email per periode gajian

