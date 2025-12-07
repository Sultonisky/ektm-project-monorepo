# Script untuk Setup Database PostgreSQL
# Script ini membantu setup database untuk EKTM Project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Database PostgreSQL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check PostgreSQL installation
Write-Host "1. Memeriksa instalasi PostgreSQL..." -ForegroundColor Yellow

$pgService = Get-Service -Name "*postgresql*" -ErrorAction SilentlyContinue | Select-Object -First 1

if (-not $pgService) {
    Write-Host "   [X] PostgreSQL service tidak ditemukan" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Silakan install PostgreSQL terlebih dahulu:" -ForegroundColor Yellow
    Write-Host "   - Download dari: https://www.postgresql.org/download/windows/" -ForegroundColor Gray
    Write-Host "   - Atau menggunakan Chocolatey: choco install postgresql" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "   [OK] PostgreSQL service ditemukan: $($pgService.Name)" -ForegroundColor Green

# Check if PostgreSQL is running
Write-Host ""
Write-Host "2. Memeriksa status PostgreSQL..." -ForegroundColor Yellow

if ($pgService.Status -ne 'Running') {
    Write-Host "   [!] PostgreSQL tidak berjalan. Mencoba memulai service..." -ForegroundColor Yellow
    try {
        Start-Service -Name $pgService.Name
        Start-Sleep -Seconds 3
        Write-Host "   [OK] PostgreSQL service berhasil dimulai" -ForegroundColor Green
    } catch {
        Write-Host "   [X] Gagal memulai PostgreSQL service" -ForegroundColor Red
        Write-Host "   Silakan jalankan secara manual:" -ForegroundColor Yellow
        Write-Host "   - Buka Services (services.msc)" -ForegroundColor Gray
        Write-Host "   - Cari 'PostgreSQL' service" -ForegroundColor Gray
        Write-Host "   - Klik kanan > Start" -ForegroundColor Gray
        Write-Host ""
        exit 1
    }
} else {
    Write-Host "   [OK] PostgreSQL sudah berjalan" -ForegroundColor Green
}

# Check connection
Write-Host ""
Write-Host "3. Memeriksa koneksi ke PostgreSQL..." -ForegroundColor Yellow

$connectionTest = Test-NetConnection -ComputerName localhost -Port 5432 -InformationLevel Quiet -WarningAction SilentlyContinue

if (-not $connectionTest) {
    Write-Host "   [X] Tidak dapat terhubung ke PostgreSQL di localhost:5432" -ForegroundColor Red
    Write-Host "   Pastikan PostgreSQL berjalan dan port 5432 tidak diblokir firewall" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "   [OK] Koneksi ke PostgreSQL berhasil" -ForegroundColor Green

# Get database info from .env
Write-Host ""
Write-Host "4. Membaca konfigurasi database dari .env..." -ForegroundColor Yellow

$envPath = "apps\backend\nestjs\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "   [X] File .env tidak ditemukan di $envPath" -ForegroundColor Red
    Write-Host "   Silakan buat file .env terlebih dahulu" -ForegroundColor Yellow
    exit 1
}

$envContent = Get-Content $envPath
$dbUrlLine = $envContent | Select-String -Pattern "DATABASE_URL"

if (-not $dbUrlLine) {
    Write-Host "   [X] DATABASE_URL tidak ditemukan di .env" -ForegroundColor Red
    exit 1
}

# Parse DATABASE_URL
# Format: postgresql://username:password@host:port/database?schema=public
$dbUrl = $dbUrlLine.ToString().Split('=')[1].Trim('"')
$dbUrlParts = $dbUrl -replace "postgresql://", "" -split "@"
$credentials = $dbUrlParts[0] -split ":"
$hostAndDb = $dbUrlParts[1] -split "/"
$hostAndPort = $hostAndDb[0] -split ":"
$database = ($hostAndDb[1] -split "\?")[0]

$username = $credentials[0]
$password = $credentials[1]
$host = $hostAndPort[0]
$port = if ($hostAndPort.Length -gt 1) { $hostAndPort[1] } else { "5432" }

Write-Host "   [OK] Konfigurasi database:" -ForegroundColor Green
Write-Host "     - Host: $host" -ForegroundColor Gray
Write-Host "     - Port: $port" -ForegroundColor Gray
Write-Host "     - Username: $username" -ForegroundColor Gray
Write-Host "     - Database: $database" -ForegroundColor Gray

# Check if database exists
Write-Host ""
Write-Host "5. Memeriksa database '$database'..." -ForegroundColor Yellow

# Try to connect and check database
$env:PGPASSWORD = $password
$checkDbQuery = "SELECT 1 FROM pg_database WHERE datname = '$database';"

try {
    $dbExists = & psql -h $host -p $port -U $username -d postgres -tAc $checkDbQuery 2>&1
    
    if ($dbExists -match "1") {
        Write-Host "   [OK] Database '$database' sudah ada" -ForegroundColor Green
    } else {
        Write-Host "   [!] Database '$database' belum ada. Membuat database..." -ForegroundColor Yellow
        
        $createDbQuery = "CREATE DATABASE $database;"
        & psql -h $host -p $port -U $username -d postgres -c $createDbQuery 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   [OK] Database '$database' berhasil dibuat" -ForegroundColor Green
        } else {
            Write-Host "   [X] Gagal membuat database" -ForegroundColor Red
            Write-Host "   Silakan buat database secara manual:" -ForegroundColor Yellow
            Write-Host "   psql -U $username -d postgres" -ForegroundColor Gray
            Write-Host "   CREATE DATABASE $database;" -ForegroundColor Gray
            Write-Host ""
            exit 1
        }
    }
} catch {
    Write-Host "   [!] Tidak dapat menggunakan psql command line" -ForegroundColor Yellow
    Write-Host "   Silakan buat database secara manual menggunakan pgAdmin atau psql:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Menggunakan psql:" -ForegroundColor Cyan
    Write-Host "   psql -U $username -d postgres" -ForegroundColor Gray
    Write-Host "   CREATE DATABASE $database;" -ForegroundColor Gray
    Write-Host '   \q' -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Atau menggunakan pgAdmin:" -ForegroundColor Cyan
    Write-Host "   1. Buka pgAdmin" -ForegroundColor Gray
    Write-Host "   2. Klik kanan pada Databases > Create > Database" -ForegroundColor Gray
    Write-Host "   3. Masukkan nama: $database" -ForegroundColor Gray
    Write-Host "   4. Klik Save" -ForegroundColor Gray
    Write-Host ""
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Database Selesai!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Langkah selanjutnya:" -ForegroundColor Yellow
Write-Host "1. Pastikan database '$database' sudah dibuat" -ForegroundColor White
Write-Host "2. Jalankan migration:" -ForegroundColor White
Write-Host "   cd apps\backend\nestjs" -ForegroundColor Gray
Write-Host "   pnpm run db:migrate" -ForegroundColor Gray
Write-Host ""
Write-Host "3. (Optional) Seed database:" -ForegroundColor White
Write-Host "   pnpm run prisma:seed" -ForegroundColor Gray
Write-Host ""

