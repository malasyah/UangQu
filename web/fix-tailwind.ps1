# Script untuk memperbaiki Tailwind CSS
# Opsi 1: Tetap pakai v4 (sudah diupdate)
# Opsi 2: Downgrade ke v3 (lebih stabil)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Fix Tailwind CSS Configuration" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Pilih opsi:" -ForegroundColor Yellow
Write-Host "1. Tetap pakai Tailwind v4 (sudah diupdate)" -ForegroundColor White
Write-Host "2. Downgrade ke Tailwind v3 (lebih stabil, recommended)`n" -ForegroundColor White

$choice = Read-Host "Pilihan (1/2)"

if ($choice -eq "2") {
    Write-Host "`nDowngrading ke Tailwind CSS v3..." -ForegroundColor Yellow
    
    # Uninstall v4
    npm uninstall tailwindcss @tailwindcss/postcss
    
    # Install v3
    npm install -D tailwindcss@^3.4.0 postcss autoprefixer
    
    # Update postcss.config.js
    @"
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"@ | Out-File -FilePath postcss.config.js -Encoding utf8
    
    # Update style.css
    $styleContent = Get-Content src/style.css -Raw
    $styleContent = $styleContent -replace '@import "tailwindcss";', "@tailwind base;`n@tailwind components;`n@tailwind utilities;"
    $styleContent | Out-File -FilePath src/style.css -Encoding utf8 -NoNewline
    
    Write-Host "`n✓ Downgrade ke Tailwind v3 selesai!" -ForegroundColor Green
    Write-Host "✓ postcss.config.js sudah diupdate" -ForegroundColor Green
    Write-Host "✓ style.css sudah diupdate`n" -ForegroundColor Green
} else {
    Write-Host "`nTetap menggunakan Tailwind v4" -ForegroundColor Yellow
    Write-Host "Konfigurasi sudah diupdate untuk v4`n" -ForegroundColor Green
}

Write-Host "Sekarang coba jalankan:" -ForegroundColor Yellow
Write-Host "  npm run dev`n" -ForegroundColor White

