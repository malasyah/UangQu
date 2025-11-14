# Testing Checklist - UangQu

Dokumen ini berisi checklist lengkap untuk testing semua fitur aplikasi UangQu.

## Pre-Testing Setup

- [ ] Supabase project sudah dibuat dan dikonfigurasi
- [ ] SQL scripts sudah dijalankan (schema, RLS, functions)
- [ ] Environment variables sudah diset
- [ ] Web app berjalan di `http://localhost:5173`
- [ ] Mobile app berjalan di Expo Go/emulator
- [ ] Browser console tidak ada error (F12)

---

## 1. Authentication Testing

### 1.1 Registration (Web & Mobile)

**Web:**
- [ ] Halaman register bisa diakses
- [ ] Form validation bekerja (email format, password length)
- [ ] Error message muncul jika email sudah terdaftar
- [ ] Success message muncul setelah register
- [ ] Email verifikasi terkirim (jika enabled)
- [ ] Redirect ke login setelah register

**Mobile:**
- [ ] Screen register bisa diakses
- [ ] Form validation bekerja
- [ ] Error handling dengan Alert
- [ ] Navigation ke login setelah register

### 1.2 Login (Web & Mobile)

**Web:**
- [ ] Halaman login bisa diakses
- [ ] Login berhasil dengan email/password benar
- [ ] Error message muncul jika credentials salah
- [ ] Redirect ke dashboard setelah login sukses
- [ ] Session tetap aktif setelah refresh page

**Mobile:**
- [ ] Login screen bisa diakses
- [ ] Login berhasil
- [ ] Error handling dengan Alert
- [ ] Navigation ke dashboard setelah login
- [ ] Session tersimpan di AsyncStorage

### 1.3 Password Reset (Web)

- [ ] Link "Forgot password" bisa diakses
- [ ] Form email validation bekerja
- [ ] Email reset password terkirim
- [ ] Link di email mengarah ke halaman reset
- [ ] Password bisa direset dengan sukses
- [ ] Bisa login dengan password baru

### 1.4 Logout (Web & Mobile)

- [ ] Tombol logout ada di dashboard
- [ ] Logout berhasil
- [ ] Redirect ke login setelah logout
- [ ] Session dihapus
- [ ] Tidak bisa akses protected routes setelah logout

---

## 2. Category Management Testing

### 2.1 Create Category (Web & Mobile)

**Web:**
- [ ] Halaman categories bisa diakses
- [ ] Form "Add Category" muncul saat klik tombol
- [ ] Bisa input: name, type, icon, color
- [ ] Form validation bekerja
- [ ] Category tersimpan ke database
- [ ] Category muncul di list setelah create
- [ ] Default categories bisa ditambahkan dengan cepat

**Mobile:**
- [ ] Categories screen bisa diakses
- [ ] Form add category muncul
- [ ] Semua field bisa diisi
- [ ] Category tersimpan
- [ ] List update setelah create

### 2.2 Edit Category (Web & Mobile)

- [ ] Tombol "Edit" ada di setiap category
- [ ] Form edit muncul dengan data terisi
- [ ] Bisa ubah name, icon, color
- [ ] Update tersimpan ke database
- [ ] Perubahan terlihat di list
- [ ] Transaksi yang menggunakan category tidak terpengaruh

### 2.3 Delete Category (Web & Mobile)

- [ ] Tombol "Delete" ada
- [ ] Confirmation dialog muncul
- [ ] Delete berhasil
- [ ] Category hilang dari list
- [ ] Error handling jika category masih digunakan

### 2.4 Category List (Web & Mobile)

- [ ] List menampilkan semua categories
- [ ] Terpisah antara Income dan Expense
- [ ] Icon dan color ditampilkan dengan benar
- [ ] Sorting bekerja (alphabetical)
- [ ] Empty state muncul jika belum ada category

---

## 3. Transaction Management Testing

### 3.1 Create Transaction (Web & Mobile)

**Web:**
- [ ] Halaman transactions bisa diakses
- [ ] Form "Add Transaction" muncul
- [ ] Bisa input: type, category, amount, date, description
- [ ] Date picker bekerja
- [ ] Category selector hanya menampilkan kategori sesuai type
- [ ] Form validation bekerja (amount > 0, required fields)
- [ ] Transaction tersimpan ke database
- [ ] Transaction muncul di list setelah create
- [ ] Balance update di dashboard

**Mobile:**
- [ ] Transactions screen bisa diakses
- [ ] Form add transaction muncul
- [ ] Date picker native bekerja
- [ ] Category picker horizontal scroll
- [ ] Transaction tersimpan
- [ ] List update

### 3.2 Edit Transaction (Web & Mobile)

- [ ] Tombol "Edit" ada di setiap transaction
- [ ] Form edit muncul dengan data terisi
- [ ] Bisa ubah semua field
- [ ] Update tersimpan
- [ ] Perubahan terlihat di list
- [ ] Balance update di dashboard

### 3.3 Delete Transaction (Web & Mobile)

**Web:**
- [ ] Tombol "Delete" ada
- [ ] Confirmation modal muncul
- [ ] Delete berhasil
- [ ] Transaction hilang dari list
- [ ] Balance update

**Mobile:**
- [ ] Swipe left untuk reveal actions
- [ ] Tombol Delete muncul
- [ ] Confirmation Alert muncul
- [ ] Delete berhasil
- [ ] List update

### 3.4 Transaction List & Filters (Web)

- [ ] List menampilkan semua transactions
- [ ] Sorting: newest first
- [ ] Filter by date range bekerja
- [ ] Filter by type (income/expense) bekerja
- [ ] Filter by category bekerja
- [ ] Multiple filters bisa dikombinasikan
- [ ] Empty state muncul jika tidak ada data
- [ ] Pagination atau infinite scroll (jika diimplementasi)

### 3.5 Transaction Display (Web & Mobile)

- [ ] Date format benar (MMM dd, yyyy)
- [ ] Amount format benar (currency IDR)
- [ ] Income ditampilkan dengan warna hijau
- [ ] Expense ditampilkan dengan warna merah
- [ ] Category name ditampilkan
- [ ] Description ditampilkan (jika ada)

---

## 4. Limits Testing

### 4.1 Create Limit (Web)

- [ ] Halaman limits bisa diakses
- [ ] Form "Add Limit" muncul
- [ ] Bisa input: period_type, amount, category (optional), start_date
- [ ] Form validation bekerja
- [ ] Limit tersimpan ke database
- [ ] Limit muncul di list dengan progress bar
- [ ] Current spending dihitung dengan benar

### 4.2 Edit Limit (Web)

- [ ] Tombol "Edit" ada
- [ ] Form edit muncul dengan data terisi
- [ ] Bisa ubah semua field
- [ ] Update tersimpan
- [ ] Progress bar update

### 4.3 Delete Limit (Web)

- [ ] Tombol "Delete" ada
- [ ] Confirmation muncul
- [ ] Delete berhasil
- [ ] Limit hilang dari list

### 4.4 Limit Violation Detection

- [ ] Buat limit harian: 10000
- [ ] Buat transaksi expense: 15000 (melebihi limit)
- [ ] Warning muncul di dashboard
- [ ] Warning muncul di halaman limits
- [ ] Limit card border merah
- [ ] Progress bar merah jika violated
- [ ] Warning animation muncul (web & mobile)

### 4.5 Limit Progress Calculation

- [ ] Daily limit: hitung transaksi hari ini
- [ ] Weekly limit: hitung transaksi minggu ini
- [ ] Monthly limit: hitung transaksi bulan ini
- [ ] Category-specific limit: hanya hitung kategori tersebut
- [ ] All categories limit: hitung semua kategori
- [ ] Progress percentage benar
- [ ] Progress bar visual benar

---

## 5. Targets Testing

### 5.1 Create Target (Web)

- [ ] Halaman targets bisa diakses
- [ ] Form "Add Target" muncul
- [ ] Bisa input: type, amount, period_type, deadline
- [ ] Form validation bekerja
- [ ] Target tersimpan ke database
- [ ] Target muncul di list dengan progress bar

### 5.2 Edit Target (Web)

- [ ] Tombol "Edit" ada
- [ ] Form edit muncul dengan data terisi
- [ ] Bisa ubah semua field
- [ ] Update tersimpan
- [ ] Progress bar update

### 5.3 Delete Target (Web)

- [ ] Tombol "Delete" ada
- [ ] Confirmation muncul
- [ ] Delete berhasil
- [ ] Target hilang dari list

### 5.4 Target Progress Calculation

- [ ] Savings target: hitung total income
- [ ] Spending target: hitung total expense
- [ ] Progress dihitung berdasarkan period_type
- [ ] Progress percentage benar
- [ ] Progress bar visual benar
- [ ] Completed target: border hijau, icon checkmark
- [ ] Overdue target: border merah, icon clock

---

## 6. Dashboard Testing

### 6.1 Summary Cards (Web & Mobile)

**Web:**
- [ ] Balance card menampilkan saldo (income - expense)
- [ ] Income card menampilkan total income
- [ ] Expense card menampilkan total expense
- [ ] Warna: balance (hijau/merah), income (hijau), expense (merah)
- [ ] Format currency benar (IDR)
- [ ] Update real-time saat ada transaksi baru

**Mobile:**
- [ ] Summary cards muncul di atas
- [ ] 3 cards: Balance, Income, Expense
- [ ] Warna dan format benar
- [ ] Responsive layout

### 6.2 Charts (Web)

**Income vs Expense Chart:**
- [ ] Chart muncul dengan data
- [ ] Menampilkan 6 bulan terakhir
- [ ] Bar chart dengan 2 bars (income, expense)
- [ ] Legend bekerja
- [ ] Tooltip muncul saat hover
- [ ] Responsive (adjust ke screen size)
- [ ] Period selector bekerja (current/last month)

**Category Breakdown:**
- [ ] Pie chart muncul
- [ ] Menampilkan top 6 categories
- [ ] Warna berbeda untuk setiap slice
- [ ] Label dengan percentage
- [ ] Tooltip dengan detail
- [ ] Empty state jika tidak ada expense

### 6.3 Charts (Mobile)

**Income vs Expense:**
- [ ] Line chart muncul
- [ ] 2 lines: income (hijau), expense (merah)
- [ ] 6 bulan data
- [ ] Responsive ke screen width

**Category Breakdown:**
- [ ] Pie chart muncul
- [ ] Top 5 categories
- [ ] Warna berbeda
- [ ] Legend readable

### 6.4 Recent Transactions (Web & Mobile)

- [ ] Menampilkan 5 transaksi terbaru
- [ ] Sorted by date (newest first)
- [ ] Format date benar
- [ ] Format amount benar
- [ ] Category name ditampilkan
- [ ] Link "View All" mengarah ke transactions page
- [ ] Empty state jika tidak ada transaksi

### 6.5 Period Comparison (Web)

- [ ] Period selector muncul
- [ ] Bisa pilih "Current Month" atau "Last Month"
- [ ] Data update sesuai period
- [ ] Summary cards update
- [ ] Charts update
- [ ] Recent transactions update

---

## 7. CSV Export/Import Testing

### 7.1 Export (Web)

- [ ] Halaman export bisa diakses
- [ ] Date range picker bekerja
- [ ] Default: current month
- [ ] Bisa pilih custom range
- [ ] Menampilkan jumlah transactions yang akan diexport
- [ ] Tombol "Export to CSV" bekerja
- [ ] File terdownload dengan nama: `uangqu-transactions-YYYY-MM-DD-to-YYYY-MM-DD.csv`
- [ ] File format benar:
  - Header: Date,Category,Type,Amount,Description
  - Data sesuai format
  - Encoding UTF-8

### 7.2 Import (Web)

- [ ] Halaman import bisa diakses
- [ ] File picker bekerja (accept .csv)
- [ ] File validation:
  - [ ] Error jika format salah
  - [ ] Error jika kolom tidak lengkap
  - [ ] Error jika data invalid
- [ ] Preview parsed data
- [ ] Validation errors ditampilkan
- [ ] Tombol "Import" disabled jika ada error
- [ ] Import berhasil
- [ ] Progress indicator (imported, skipped)
- [ ] Transactions muncul di list setelah import
- [ ] Duplicate detection (optional)

### 7.3 CSV Format Validation

**Valid Format:**
```csv
Date,Category,Type,Amount,Description
2024-01-15,Food & Dining,expense,50000,Lunch
2024-01-16,Salary,income,5000000,Monthly salary
```

**Test Cases:**
- [ ] Valid CSV: import sukses
- [ ] Missing columns: error message
- [ ] Invalid date format: error message
- [ ] Invalid type (bukan income/expense): error message
- [ ] Invalid amount (bukan number): error message
- [ ] Category tidak ada: skip dengan message
- [ ] Empty rows: di-skip

---

## 8. Warning Animations Testing

### 8.1 Web (Framer Motion)

- [ ] Warning muncul saat limit violated
- [ ] Animation: scale + fade in
- [ ] Shake animation pada icon
- [ ] Position: top-right corner
- [ ] Auto-dismiss setelah 5 detik
- [ ] Bisa close manual dengan tombol X
- [ ] Message jelas dan informatif
- [ ] Tidak overlap dengan elemen lain
- [ ] Multiple violations: tampilkan yang pertama

### 8.2 Mobile (React Native Reanimated)

- [ ] Warning muncul saat limit violated
- [ ] Animation: scale + shake
- [ ] Position: top of screen
- [ ] Auto-dismiss setelah 5 detik
- [ ] Bisa close manual
- [ ] Message jelas
- [ ] Tidak block UI
- [ ] Smooth animation (60fps)

### 8.3 Real-time Detection

- [ ] Warning muncul otomatis saat limit exceeded
- [ ] Check setiap 30 detik (background)
- [ ] Warning hilang saat limit tidak violated lagi
- [ ] Tidak spam notifications

---

## 9. Mobile-Specific Testing

### 9.1 Navigation

- [ ] Bottom tabs bekerja
- [ ] Stack navigation bekerja
- [ ] Back button bekerja
- [ ] Deep linking (jika diimplementasi)

### 9.2 Gestures

- [ ] Swipe to delete transaction
- [ ] Pull to refresh
- [ ] Scroll smooth
- [ ] No janky animations

### 9.3 Performance

- [ ] App load cepat (< 3 detik)
- [ ] Navigation smooth
- [ ] Charts render cepat
- [ ] No memory leaks
- [ ] Battery usage reasonable

### 9.4 Responsive Design

- [ ] Layout adapt ke berbagai screen size
- [ ] Text readable
- [ ] Buttons mudah di-tap
- [ ] No horizontal scroll
- [ ] Safe area respected (notch, etc)

---

## 10. Cross-Platform Testing

### 10.1 Data Sync

- [ ] Create transaction di web → muncul di mobile
- [ ] Create transaction di mobile → muncul di web
- [ ] Update di web → update di mobile
- [ ] Delete di web → delete di mobile
- [ ] Real-time sync (jika enabled)

### 10.2 Feature Parity

- [ ] Semua fitur web ada di mobile
- [ ] UI/UX konsisten
- [ ] Behavior sama

---

## 11. Error Handling Testing

### 11.1 Network Errors

- [ ] Offline: error message jelas
- [ ] Slow connection: loading indicator
- [ ] Timeout: retry option
- [ ] Server error: user-friendly message

### 11.2 Validation Errors

- [ ] Form validation: error message jelas
- [ ] Required fields: error message
- [ ] Invalid format: error message
- [ ] Business logic errors: error message

### 11.3 Edge Cases

- [ ] Empty data: empty state muncul
- [ ] Very long text: truncate atau wrap
- [ ] Very large numbers: format benar
- [ ] Special characters: handled dengan benar
- [ ] Date edge cases (leap year, etc)

---

## 12. Security Testing

### 12.1 Authentication

- [ ] Password tidak terlihat di UI
- [ ] Session timeout bekerja
- [ ] Protected routes tidak bisa diakses tanpa login
- [ ] Logout clear semua data

### 12.2 Data Isolation

- [ ] User A tidak bisa lihat data User B
- [ ] RLS policies bekerja
- [ ] API calls hanya untuk user sendiri

### 12.3 Input Sanitization

- [ ] SQL injection: prevented
- [ ] XSS: prevented
- [ ] CSRF: handled (Supabase)

---

## 13. Performance Testing

### 13.1 Load Time

- [ ] Initial load < 3 detik
- [ ] Page navigation < 1 detik
- [ ] Chart render < 2 detik

### 13.2 Large Data

- [ ] 100+ transactions: list performa OK
- [ ] 50+ categories: list performa OK
- [ ] Charts dengan banyak data: render OK

### 13.3 Memory

- [ ] No memory leaks
- [ ] Memory usage reasonable
- [ ] Garbage collection bekerja

---

## 14. Browser Compatibility (Web)

- [ ] Chrome: semua fitur bekerja
- [ ] Firefox: semua fitur bekerja
- [ ] Safari: semua fitur bekerja
- [ ] Edge: semua fitur bekerja
- [ ] Mobile browsers: responsive OK

---

## 15. Final Checklist

### Functionality
- [ ] Semua fitur utama bekerja
- [ ] Tidak ada critical bugs
- [ ] Error handling proper

### UI/UX
- [ ] Design konsisten
- [ ] Responsive di semua device
- [ ] Animations smooth
- [ ] Loading states ada
- [ ] Empty states informatif

### Documentation
- [ ] README updated
- [ ] Setup guide clear
- [ ] Code comments adequate

### Deployment Ready
- [ ] Environment variables documented
- [ ] Build process works
- [ ] No hardcoded values
- [ ] Error logging setup

---

## Testing Notes

**Date Tested:** _______________
**Tester:** _______________
**Environment:** Development / Staging / Production
**Browser/Device:** _______________

**Issues Found:**
1. 
2. 
3. 

**Status:** ✅ Pass / ❌ Fail / ⚠️ Needs Fix

---

**Testing Complete!** 🎉

