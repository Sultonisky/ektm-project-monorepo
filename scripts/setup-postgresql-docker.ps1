# Script untuk Setup PostgreSQL dengan Docker
# Script ini akan menjalankan PostgreSQL container untuk development

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup PostgreSQL dengan Docker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker
Write-Host "1. Memeriksa Docker..." -ForegroundColor Yellow

try {
    $dockerVersion = docker --version
    Write-Host "   [OK] Docker ditemukan: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "   [X] Docker tidak ditemukan" -ForegroundColor Red
    Write-Host "   Pastikan Docker Desktop sudah berjalan" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
try {
    docker ps | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker daemon tidak berjalan"
    }
    Write-Host "   [OK] Docker daemon berjalan" -ForegroundColor Green
} catch {
    Write-Host "   [X] Docker daemon tidak berjalan" -ForegroundColor Red
    Write-Host "   Silakan buka Docker Desktop dan tunggu sampai siap" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if container already exists
Write-Host "2. Memeriksa container PostgreSQL..." -ForegroundColor Yellow

$existingContainer = docker ps -a --filter "name=postgres-ektm" --format "{{.Names}}" 2>&1

if ($existingContainer -eq "postgres-ektm") {
    $containerStatus = docker ps --filter "name=postgres-ektm" --format "{{.Status}}" 2>&1
    
    if ($containerStatus -match "Up") {
        Write-Host "   [OK] Container postgres-ektm sudah berjalan" -ForegroundColor Green
        Write-Host "   Status: $containerStatus" -ForegroundColor Gray
    } else {
        Write-Host "   [!] Container postgres-ektm ada tapi tidak berjalan" -ForegroundColor Yellow
        Write-Host "   Mencoba memulai container..." -ForegroundColor Gray
        docker start postgres-ektm | Out-Null
        Start-Sleep -Seconds 3
        Write-Host "   [OK] Container berhasil dimulai" -ForegroundColor Green
    }
} else {
    Write-Host "   [!] Container postgres-ektm belum ada" -ForegroundColor Yellow
    Write-Host "   Membuat container baru..." -ForegroundColor Gray
    
    # Create and run PostgreSQL container
    docker run --name postgres-ektm `
        -e POSTGRES_PASSWORD=postgres `
        -e POSTGRES_DB=ektm_db `
        -p 5432:5432 `
        -d postgres:13 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] Container postgres-ektm berhasil dibuat dan dijalankan" -ForegroundColor Green
        Write-Host "   Menunggu PostgreSQL siap..." -ForegroundColor Gray
        Start-Sleep -Seconds 5
    } else {
        Write-Host "   [X] Gagal membuat container" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Test connection
Write-Host "3. Memeriksa koneksi ke PostgreSQL..." -ForegroundColor Yellow

$connectionTest = Test-NetConnection -ComputerName localhost -Port 5432 -InformationLevel Quiet -WarningAction SilentlyContinue

if ($connectionTest) {
    Write-Host "   [OK] Koneksi ke PostgreSQL berhasil!" -ForegroundColor Green
} else {
    Write-Host "   [!] Port 5432 belum siap, tunggu beberapa detik..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    $connectionTest = Test-NetConnection -ComputerName localhost -Port 5432 -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($connectionTest) {
        Write-Host "   [OK] Koneksi ke PostgreSQL berhasil!" -ForegroundColor Green
    } else {
        Write-Host "   [X] Masih tidak bisa terhubung" -ForegroundColor Red
        Write-Host "   Cek log container: docker logs postgres-ektm" -ForegroundColor Yellow
    }
}

Write-Host ""

# Update .env file
Write-Host "4. Memeriksa file .env..." -ForegroundColor Yellow

$envPath = "apps\backend\nestjs\.env"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    $expectedUrl = 'postgresql://postgres:postgres@localhost:5432/ektm_db?schema=public'
    
    if ($envContent -match "DATABASE_URL.*postgresql://postgres:postgres@localhost:5432/ektm_db") {
        Write-Host "   [OK] File .env sudah dikonfigurasi dengan benar" -ForegroundColor Green
    } else {
        Write-Host "   [!] File .env perlu diupdate" -ForegroundColor Yellow
        Write-Host "   Mengupdate DATABASE_URL..." -ForegroundColor Gray
        
        # Update DATABASE_URL
        $newContent = $envContent -replace 'DATABASE_URL="[^"]*"', "DATABASE_URL=`"$expectedUrl`""
        Set-Content -Path $envPath -Value $newContent -NoNewline
        
        Write-Host "   [OK] File .env berhasil diupdate" -ForegroundColor Green
        Write-Host "   DATABASE_URL: $expectedUrl" -ForegroundColor Gray
    }
} else {
    Write-Host "   [!] File .env tidak ditemukan" -ForegroundColor Yellow
    Write-Host "   Membuat file .env dari template..." -ForegroundColor Gray
    
    $envExamplePath = "apps\backend\nestjs\.env.example"
    if (Test-Path $envExamplePath) {
        Copy-Item $envExamplePath $envPath
        # Update DATABASE_URL
        $content = Get-Content $envPath -Raw
        $content = $content -replace 'DATABASE_URL="[^"]*"', 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ektm_db?schema=public"'
        Set-Content -Path $envPath -Value $content -NoNewline
        Write-Host "   [OK] File .env berhasil dibuat" -ForegroundColor Green
    } else {
        Write-Host "   [X] Template .env.example tidak ditemukan" -ForegroundColor Red
    }
}

Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup PostgreSQL dengan Docker Selesai!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Informasi Container:" -ForegroundColor Yellow
Write-Host "  - Nama: postgres-ektm" -ForegroundColor Gray
Write-Host "  - Database: ektm_db" -ForegroundColor Gray
Write-Host "  - Username: postgres" -ForegroundColor Gray
Write-Host "  - Password: postgres" -ForegroundColor Gray
Write-Host "  - Port: 5432" -ForegroundColor Gray
Write-Host ""
Write-Host "Langkah selanjutnya:" -ForegroundColor Yellow
Write-Host "1. Jalankan migration:" -ForegroundColor White
Write-Host "   cd apps\backend\nestjs" -ForegroundColor Gray
Write-Host "   pnpm run db:migrate" -ForegroundColor Gray
Write-Host ""
Write-Host "2. (Optional) Seed database:" -ForegroundColor White
Write-Host "   pnpm run prisma:seed" -ForegroundColor Gray
Write-Host ""
Write-Host "Perintah Docker yang berguna:" -ForegroundColor Yellow
Write-Host "  - Stop container: docker stop postgres-ektm" -ForegroundColor Gray
Write-Host "  - Start container: docker start postgres-ektm" -ForegroundColor Gray
Write-Host "  - View logs: docker logs postgres-ektm" -ForegroundColor Gray
Write-Host "  - Remove container: docker rm -f postgres-ektm" -ForegroundColor Gray
Write-Host ""

