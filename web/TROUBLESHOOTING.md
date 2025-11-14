# Troubleshooting - Layar Putih

## Masalah: Layar Putih di Browser

Jika Anda melihat layar putih saat membuka `http://localhost:5174`, ikuti langkah-langkah berikut:

### 1. Cek Browser Console (PENTING!)

**Langkah:**
1. Buka browser (Chrome/Firefox/Edge)
2. Tekan **F12** atau **Ctrl+Shift+I** (Windows) / **Cmd+Option+I** (Mac)
3. Buka tab **Console**
4. Lihat apakah ada error merah

**Error yang mungkin muncul:**
- `Missing Supabase environment variables` → File .env belum diisi atau salah format
- `Failed to fetch` → Supabase URL/key salah atau network error
- `Cannot read property of undefined` → Error di kode
- `Module not found` → File import tidak ditemukan

### 2. Cek Network Tab

1. Di Developer Tools, buka tab **Network**
2. Refresh halaman (F5)
3. Lihat apakah ada request yang **failed** (merah)
4. Cek request ke Supabase apakah berhasil

### 3. Verifikasi Environment Variables

**Cek file `.env`:**
```bash
cd web
cat .env
# atau di Windows:
type .env
```

**Pastikan format benar:**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Tidak boleh:**
- Ada spasi sebelum/sesudah `=`
- Pakai tanda kutip (`"` atau `'`)
- Ada baris kosong di antara variable

### 4. Test Supabase Connection

Buka browser console dan jalankan:
```javascript
// Test connection
fetch('YOUR_SUPABASE_URL/rest/v1/', {
  headers: {
    'apikey': 'YOUR_ANON_KEY'
  }
})
.then(r => console.log('Connection OK:', r.status))
.catch(e => console.error('Connection Error:', e))
```

### 5. Clear Cache dan Restart

```bash
# Stop dev server (Ctrl+C)
# Clear cache
cd web
rm -rf node_modules/.vite
# atau di Windows:
Remove-Item -Recurse -Force node_modules\.vite

# Restart
npm run dev
```

### 6. Cek File yang Di-import

Pastikan semua file yang di-import ada:
- `src/App.tsx` ✓
- `src/contexts/AuthContext.tsx` ✓
- `src/services/supabase.ts` ✓
- `src/pages/Login.tsx` ✓
- dll

### 7. Common Issues

#### Issue: "Missing Supabase environment variables"
**Solusi:**
- Pastikan file `.env` ada di folder `web/`
- Pastikan format benar (tidak ada spasi, tidak pakai kutip)
- Restart dev server setelah edit `.env`

#### Issue: "Failed to fetch" atau CORS error
**Solusi:**
- Cek Supabase URL benar
- Cek Supabase project masih aktif
- Cek network connection

#### Issue: "Cannot read property 'user' of null"
**Solusi:**
- Error di AuthContext
- Cek apakah Supabase client initialize dengan benar
- Cek browser console untuk detail error

#### Issue: React tidak render
**Solusi:**
- Cek apakah `main.tsx` benar
- Pastikan tidak ada file `main.ts` yang konflik
- Cek `index.html` merujuk ke `main.tsx`

### 8. Debug Mode

Tambahkan console.log untuk debug:

**Di `src/main.tsx`:**
```tsx
console.log('App starting...')
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
```

**Di `src/App.tsx`:**
```tsx
console.log('App component rendering...')
```

**Di `src/contexts/AuthContext.tsx`:**
```tsx
console.log('AuthContext initializing...')
```

### 9. Minimal Test

Buat file test sederhana untuk memastikan React bekerja:

**Temporary `src/App.tsx`:**
```tsx
export default function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test - React is working!</h1>
      <p>If you see this, React is rendering correctly.</p>
    </div>
  )
}
```

Jika ini muncul, berarti React OK, masalahnya di komponen lain.

### 10. Check Terminal Output

Lihat terminal tempat `npm run dev` berjalan:
- Apakah ada error/warning?
- Apakah build berhasil?
- Apakah ada file yang tidak ditemukan?

## Quick Fix Checklist

- [ ] Browser console dibuka (F12)
- [ ] Error di console dicatat
- [ ] File `.env` sudah benar
- [ ] Dev server di-restart setelah edit `.env`
- [ ] Cache dibersihkan
- [ ] Network tab dicek
- [ ] Supabase project masih aktif

## Still Not Working?

Jika masih layar putih setelah semua langkah di atas:

1. **Copy error message** dari browser console
2. **Screenshot** browser console
3. **Cek terminal** untuk error messages
4. **Share detail** untuk debugging lebih lanjut

## Expected Behavior

Setelah semua benar, Anda harus melihat:
- Halaman login UangQu
- Form login dengan email & password
- Link "Sign up" dan "Forgot password"
- Tidak ada error di console

