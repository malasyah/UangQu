# Panduan Setup GitHub untuk UangQu

Dokumen ini menjelaskan cara menghubungkan project UangQu ke GitHub dan melakukan initial commit.

## Status Saat Ini

✅ **Git sudah diinisialisasi** (branch: master)  
❌ **Belum terhubung ke GitHub**  
⚠️ **Ada beberapa file yang belum di-commit**

---

## Langkah 1: Buat Repository di GitHub

### 1.1 Login ke GitHub

1. Buka browser dan kunjungi: https://github.com
2. Login dengan akun GitHub Anda
3. Jika belum punya akun, buat di: https://github.com/signup

### 1.2 Buat Repository Baru

1. Klik tombol **"+"** di pojok kanan atas
2. Pilih **"New repository"**

3. **Isi form:**
   - **Repository name:** `UangQu` (atau nama lain)
   - **Description:** `Personal Finance Management App - React Web & React Native Mobile`
   - **Visibility:**
     - ✅ **Public** (bisa dilihat semua orang, gratis)
     - ✅ **Private** (hanya Anda yang bisa lihat, gratis untuk personal)
   - **JANGAN centang:**
     - ❌ Add a README file (kita sudah punya)
     - ❌ Add .gitignore (kita sudah punya)
     - ❌ Choose a license (bisa ditambah nanti)

4. Klik **"Create repository"**

5. **Copy URL repository:**
   - Akan muncul halaman dengan URL seperti:
   - `https://github.com/username/UangQu.git`
   - Atau SSH: `git@github.com:username/UangQu.git`
   - **Copy URL ini** (akan digunakan di langkah berikutnya)

---

## Langkah 2: Hubungkan Local Repository ke GitHub

### 2.1 Buka Terminal/Command Prompt

Pastikan Anda berada di folder project:
```bash
cd C:\Gemalery\Apps\UangQu
```

### 2.2 Tambahkan Remote GitHub

**Jika menggunakan HTTPS:**
```bash
git remote add origin https://github.com/username/UangQu.git
```
*(Ganti `username` dengan username GitHub Anda)*

**Jika menggunakan SSH:**
```bash
git remote add origin git@github.com:username/UangQu.git
```

### 2.3 Verifikasi Remote

```bash
git remote -v
```

Harus muncul:
```
origin  https://github.com/username/UangQu.git (fetch)
origin  https://github.com/username/UangQu.git (push)
```

---

## Langkah 3: Commit File yang Belum Ter-commit

### 3.1 Cek Status

```bash
git status
```

Akan muncul daftar file yang:
- **Modified:** File yang sudah di-track tapi ada perubahan
- **Untracked:** File baru yang belum di-track

### 3.2 Add Semua File

```bash
# Add semua file
git add .

# Atau add spesifik:
git add web/
git add mobile/
git add supabase/
git add *.md
git add .gitignore
```

### 3.3 Commit

```bash
git commit -m "Initial commit: UangQu - Personal Finance Management App

- Web app (React + TypeScript + Vite)
- Mobile app (React Native + Expo)
- Supabase backend setup
- Complete feature set:
  * Authentication
  * Transaction management
  * Category management
  * Limits & Targets
  * Dashboard with charts
  * CSV import/export
  * Warning animations"
```

### 3.4 Verifikasi Commit

```bash
git log --oneline
```

Harus muncul commit yang baru saja dibuat.

---

## Langkah 4: Push ke GitHub

### 4.1 Push ke GitHub

**Untuk pertama kali:**
```bash
git push -u origin master
```

**Untuk push selanjutnya:**
```bash
git push
```

### 4.2 Masukkan Credentials

Jika diminta:
- **Username:** Username GitHub Anda
- **Password:** **JANGAN pakai password GitHub!**
  - Gunakan **Personal Access Token** (lihat langkah 4.3)

### 4.3 Buat Personal Access Token (Jika Perlu)

Jika GitHub meminta token:

1. **Buka GitHub Settings:**
   - Klik foto profil > **Settings**
   - Atau: https://github.com/settings/profile

2. **Buat Token:**
   - Scroll ke bawah, klik **"Developer settings"**
   - Klik **"Personal access tokens"** > **"Tokens (classic)"**
   - Klik **"Generate new token"** > **"Generate new token (classic)"**

3. **Konfigurasi Token:**
   - **Note:** `UangQu Development`
   - **Expiration:** Pilih durasi (90 days, atau custom)
   - **Scopes:** Centang:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)

4. **Generate dan Copy:**
   - Klik **"Generate token"**
   - **COPY TOKEN SEKARANG!** (hanya muncul sekali)
   - Simpan dengan aman

5. **Gunakan Token:**
   - Saat push, password = token yang sudah di-copy

---

## Langkah 5: Verifikasi

### 5.1 Cek di GitHub

1. Buka repository di browser: `https://github.com/username/UangQu`
2. Pastikan semua file sudah muncul
3. Pastikan README.md ter-render dengan baik

### 5.2 Test Pull

```bash
# Buat perubahan kecil di GitHub (via web)
# Lalu pull:
git pull origin master
```

---

## Langkah 6: Setup Branch Protection (Opsional)

Untuk melindungi branch master:

1. Buka repository di GitHub
2. **Settings** > **Branches**
3. **Add rule** untuk branch `master`
4. Centang:
   - ✅ Require pull request reviews
   - ✅ Require status checks
   - ✅ Require conversation resolution

---

## Workflow Development Selanjutnya

### Daily Workflow

```bash
# 1. Cek status
git status

# 2. Add perubahan
git add .

# 3. Commit dengan pesan jelas
git commit -m "Deskripsi perubahan yang dilakukan"

# 4. Push ke GitHub
git push
```

### Best Practices

1. **Commit Message yang Jelas:**
   ```bash
   # Good
   git commit -m "Add CSV export feature with date range filter"
   git commit -m "Fix: Transaction form validation error"
   git commit -m "Update: Improve dashboard chart performance"
   
   # Bad
   git commit -m "fix"
   git commit -m "update"
   git commit -m "asdf"
   ```

2. **Commit Sering:**
   - Commit setiap fitur selesai
   - Jangan tunggu sampai banyak perubahan

3. **Jangan Commit:**
   - File `.env`
   - `node_modules/`
   - File build (`dist/`, `build/`)
   - File temporary

4. **Gunakan Branch untuk Fitur Besar:**
   ```bash
   # Buat branch baru
   git checkout -b feature/new-feature
   
   # Develop di branch
   # ... buat perubahan ...
   git add .
   git commit -m "Add new feature"
   
   # Merge ke master
   git checkout master
   git merge feature/new-feature
   git push
   ```

---

## Troubleshooting

### Error: "remote origin already exists"

```bash
# Hapus remote yang lama
git remote remove origin

# Tambah lagi dengan URL yang benar
git remote add origin https://github.com/username/UangQu.git
```

### Error: "failed to push some refs"

```bash
# Pull dulu untuk sync
git pull origin master --allow-unrelated-histories

# Lalu push lagi
git push -u origin master
```

### Error: "authentication failed"

1. Cek username dan token benar
2. Regenerate token jika perlu
3. Atau gunakan SSH instead of HTTPS

### File .env Ter-commit

```bash
# Hapus dari Git (tapi tetap di local)
git rm --cached web/.env
git rm --cached mobile/.env

# Commit perubahan
git commit -m "Remove .env files from Git"

# Pastikan .gitignore sudah benar
# Push
git push
```

---

## Setup GitHub Actions (Opsional)

Untuk CI/CD otomatis, bisa setup GitHub Actions:

1. Buat folder: `.github/workflows/`
2. Buat file: `ci.yml`
3. Setup automated testing dan deployment

*(Detail bisa ditambahkan nanti jika diperlukan)*

---

## Checklist

- [ ] Repository GitHub sudah dibuat
- [ ] Remote origin sudah ditambahkan
- [ ] Semua file sudah di-commit
- [ ] Push ke GitHub berhasil
- [ ] File muncul di GitHub web
- [ ] .gitignore sudah benar (tidak ada .env ter-commit)
- [ ] Personal Access Token dibuat (jika perlu)

---

## Next Steps

Setelah terhubung ke GitHub:

1. **Setup GitHub Pages** (jika ingin host web app gratis)
2. **Setup GitHub Actions** untuk CI/CD
3. **Invite collaborators** (jika bekerja tim)
4. **Setup branch protection** untuk production
5. **Add topics/tags** di repository untuk discoverability

---

**Selamat! Project UangQu sudah terhubung ke GitHub! 🎉**

Sekarang Anda bisa:
- ✅ Backup code ke cloud
- ✅ Collaborate dengan tim
- ✅ Track changes dengan version control
- ✅ Deploy otomatis dengan GitHub Actions
- ✅ Showcase project di portfolio

