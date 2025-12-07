# Setup Script untuk EKTM Project Monorepo
# Script ini akan membantu setup awal project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EKTM Project Monorepo - Setup Awal" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "1. Memeriksa prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "   ✓ Node.js terdeteksi: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Node.js tidak ditemukan. Silakan install Node.js 18+ terlebih dahulu." -ForegroundColor Red
    exit 1
}

# Check pnpm
try {
    $pnpmVersion = pnpm --version
    Write-Host "   ✓ pnpm terdeteksi: v$pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ pnpm tidak ditemukan. Menginstall pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Check PostgreSQL (optional check)
Write-Host "   ⚠ PostgreSQL: Pastikan PostgreSQL sudah terinstall dan database 'ektm_ubsi' sudah dibuat" -ForegroundColor Yellow
Write-Host ""

# Install dependencies
Write-Host "2. Menginstall dependencies..." -ForegroundColor Yellow
pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ✗ Gagal menginstall dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "   ✓ Dependencies berhasil diinstall" -ForegroundColor Green
Write-Host ""

# Create .env files from .env.example
Write-Host "3. Membuat file .env dari template..." -ForegroundColor Yellow

# Backend .env
$backendEnvPath = "apps\backend\nestjs\.env"
$backendEnvExamplePath = "apps\backend\nestjs\.env.example"
if (-not (Test-Path $backendEnvPath)) {
    if (Test-Path $backendEnvExamplePath) {
        Copy-Item $backendEnvExamplePath $backendEnvPath
        Write-Host "   ✓ File .env untuk backend dibuat" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ File .env.example untuk backend tidak ditemukan" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠ File .env untuk backend sudah ada, dilewati" -ForegroundColor Yellow
}

# Admin .env
$adminEnvPath = "apps\admin\sveltekit\.env"
$adminEnvExamplePath = "apps\admin\sveltekit\.env.example"
if (-not (Test-Path $adminEnvPath)) {
    if (Test-Path $adminEnvExamplePath) {
        Copy-Item $adminEnvExamplePath $adminEnvPath
        Write-Host "   ✓ File .env untuk admin dashboard dibuat" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ File .env.example untuk admin dashboard tidak ditemukan" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠ File .env untuk admin dashboard sudah ada, dilewati" -ForegroundColor Yellow
}

# Mobile .env
$mobileEnvPath = "apps\mobile\react\.env"
$mobileEnvExamplePath = "apps\mobile\react\.env.example"
if (-not (Test-Path $mobileEnvPath)) {
    if (Test-Path $mobileEnvExamplePath) {
        Copy-Item $mobileEnvExamplePath $mobileEnvPath
        Write-Host "   ✓ File .env untuk mobile app dibuat" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ File .env.example untuk mobile app tidak ditemukan" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠ File .env untuk mobile app sudah ada, dilewati" -ForegroundColor Yellow
}

Write-Host ""

# Generate Prisma Client
Write-Host "4. Generate Prisma Client..." -ForegroundColor Yellow
Set-Location "apps\backend\nestjs"
pnpm run db:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ⚠ Gagal generate Prisma Client. Pastikan DATABASE_URL sudah benar di .env" -ForegroundColor Yellow
} else {
    Write-Host "   ✓ Prisma Client berhasil di-generate" -ForegroundColor Green
}
Set-Location "..\..\.."
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Selesai!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Langkah selanjutnya:" -ForegroundColor Yellow
Write-Host "1. Edit file .env di setiap aplikasi dan sesuaikan konfigurasi:" -ForegroundColor White
Write-Host "   - apps\backend\nestjs\.env (Database, JWT, Midtrans)" -ForegroundColor Gray
Write-Host "   - apps\admin\sveltekit\.env (API Base URL)" -ForegroundColor Gray
Write-Host "   - apps\mobile\react\.env (API Base URL)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Setup database:" -ForegroundColor White
Write-Host "   cd apps\backend\nestjs" -ForegroundColor Gray
Write-Host "   pnpm run db:migrate" -ForegroundColor Gray
Write-Host "   pnpm run prisma:seed  # (optional)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Jalankan development server:" -ForegroundColor White
Write-Host "   pnpm run dev  # Dari root directory" -ForegroundColor Gray
Write-Host ""
Write-Host "Atau jalankan secara terpisah:" -ForegroundColor White
Write-Host "   - Backend: cd apps\backend\nestjs && pnpm run dev" -ForegroundColor Gray
Write-Host "   - Admin: cd apps\admin\sveltekit && pnpm run dev" -ForegroundColor Gray
Write-Host "   - Mobile: cd apps\mobile\react && pnpm start" -ForegroundColor Gray
Write-Host ""

