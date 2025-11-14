# Script Helper untuk Setup .env
# Jalankan: .\setup-env.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Setup Environment Variables (.env)" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

$envFile = ".env"

# Cek apakah file .env sudah ada
if (-not (Test-Path $envFile)) {
    Write-Host "Membuat file .env..." -ForegroundColor Yellow
    "VITE_SUPABASE_URL=your_supabase_project_url_here`nVITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here" | Out-File -FilePath $envFile -Encoding utf8
    Write-Host "File .env sudah dibuat!`n" -ForegroundColor Green
}

Write-Host "Langkah 1: Buka Supabase Dashboard" -ForegroundColor Yellow
Write-Host "  URL: https://app.supabase.com" -ForegroundColor White
Write-Host "  Login dengan akun Supabase Anda`n" -ForegroundColor Gray

Write-Host "Langkah 2: Ambil Project URL" -ForegroundColor Yellow
Write-Host "  1. Pilih project Anda" -ForegroundColor White
Write-Host "  2. Klik Settings (ikon gear) > API" -ForegroundColor White
Write-Host "  3. Copy 'Project URL' (format: https://xxxxx.supabase.co)`n" -ForegroundColor White

$supabaseUrl = Read-Host "Masukkan Supabase Project URL"

Write-Host "`nLangkah 3: Ambil Anon Key" -ForegroundColor Yellow
Write-Host "  1. Masih di halaman Settings > API" -ForegroundColor White
Write-Host "  2. Di bagian 'Project API keys'" -ForegroundColor White
Write-Host "  3. Copy 'anon' 'public' key (key yang sangat panjang)`n" -ForegroundColor White

$supabaseKey = Read-Host "Masukkan Supabase Anon Key"

# Validasi
if ($supabaseUrl -eq "" -or $supabaseUrl -eq "your_supabase_project_url_here") {
    Write-Host "`nError: Supabase URL tidak boleh kosong!" -ForegroundColor Red
    exit 1
}

if ($supabaseKey -eq "" -or $supabaseKey -eq "your_supabase_anon_key_here") {
    Write-Host "`nError: Supabase Key tidak boleh kosong!" -ForegroundColor Red
    exit 1
}

if (-not $supabaseUrl.StartsWith("https://")) {
    Write-Host "`nError: URL harus dimulai dengan https://" -ForegroundColor Red
    exit 1
}

# Tulis ke file .env
$content = @"
VITE_SUPABASE_URL=$supabaseUrl
VITE_SUPABASE_ANON_KEY=$supabaseKey
"@

$content | Out-File -FilePath $envFile -Encoding utf8 -NoNewline

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  File .env berhasil diisi!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Isi file .env:" -ForegroundColor Yellow
Get-Content $envFile
Write-Host ""

Write-Host "Langkah selanjutnya:" -ForegroundColor Yellow
Write-Host "  1. Verifikasi: npm run dev" -ForegroundColor White
Write-Host "  2. Jika tidak ada error, berarti sudah benar!`n" -ForegroundColor White

