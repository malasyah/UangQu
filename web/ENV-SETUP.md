# Cara Mengisi File .env

## Lokasi File
File `.env` harus ada di: `web/.env`

## Format File

Buka file `web/.env` dengan text editor (Notepad, VS Code, dll) dan isi dengan format berikut:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Cara Mendapatkan Nilai-Nilai

### 1. VITE_SUPABASE_URL

**Langkah:**
1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Klik **Settings** (ikon gear ⚙️) di sidebar kiri
4. Klik **API** di menu Settings
5. Di bagian **Project URL**, copy URL-nya
   - Format: `https://xxxxx.supabase.co`
6. Paste ke file `.env` setelah `VITE_SUPABASE_URL=`

**Contoh:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
```

### 2. VITE_SUPABASE_ANON_KEY

**Langkah:**
1. Masih di halaman yang sama (Settings > API)
2. Di bagian **Project API keys**
3. Cari **`anon` `public`** key
4. Klik ikon **copy** di sebelah key
5. Paste ke file `.env` setelah `VITE_SUPABASE_ANON_KEY=`

**Contoh:**
```env
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Contoh File .env yang Benar

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Penting!

1. **Jangan ada spasi** sebelum atau sesudah tanda `=`
2. **Jangan pakai tanda kutip** (tidak perlu `"` atau `'`)
3. **Jangan commit** file `.env` ke Git (sudah ada di .gitignore)
4. **Satu baris** untuk setiap variable

## Verifikasi

Setelah mengisi, verifikasi dengan:

```bash
cd web
npm run dev
```

Jika tidak ada error tentang "Missing Supabase environment variables", berarti sudah benar!

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Pastikan file `.env` ada di folder `web/`
- Pastikan format benar (tidak ada spasi, tidak pakai kutip)
- Restart dev server setelah edit `.env`

### Error: "Invalid API key"
- Pastikan key yang di-copy lengkap (biasanya sangat panjang)
- Pastikan copy **anon public** key, bukan service_role key
- Pastikan tidak ada spasi di awal/akhir key

### File .env tidak terbaca
- Pastikan file ada di `web/.env` (bukan di root)
- Pastikan nama file tepat `.env` (bukan `.env.txt`)
- Restart terminal setelah membuat file

## Jika Belum Punya Supabase Project

Ikuti panduan di:
- **SETUP-GUIDE.md** - Bagian 2: Setup Supabase
- **supabase/README.md** - Detail setup Supabase

Setelah membuat project Supabase, baru isi file `.env` dengan credentials yang didapat.

