# Script untuk Memulai PostgreSQL Service
# Script ini membantu memulai PostgreSQL service di Windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Memulai PostgreSQL Service" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check PostgreSQL service
Write-Host "1. Mencari PostgreSQL service..." -ForegroundColor Yellow

$pgServices = Get-Service -Name "*postgresql*" -ErrorAction SilentlyContinue

if (-not $pgServices) {
    Write-Host "   [X] PostgreSQL service tidak ditemukan" -ForegroundColor Red
    Write-Host ""
    Write-Host "   PostgreSQL mungkin belum terinstall." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Opsi untuk install PostgreSQL:" -ForegroundColor Cyan
    Write-Host "   1. Download installer dari: https://www.postgresql.org/download/windows/" -ForegroundColor Gray
    Write-Host "   2. Menggunakan Chocolatey: choco install postgresql" -ForegroundColor Gray
    Write-Host "   3. Menggunakan Docker: docker run --name postgres-ektm -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:13" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "   [OK] PostgreSQL service ditemukan:" -ForegroundColor Green
$pgServices | ForEach-Object {
    Write-Host "      - $($_.Name) ($($_.DisplayName)): $($_.Status)" -ForegroundColor Gray
}

Write-Host ""

# Find running service
$runningService = $pgServices | Where-Object { $_.Status -eq 'Running' }

if ($runningService) {
    Write-Host "2. Status: PostgreSQL sudah berjalan" -ForegroundColor Green
    Write-Host "   Service: $($runningService.Name)" -ForegroundColor Gray
    Write-Host ""
    
    # Test connection
    Write-Host "3. Memeriksa koneksi..." -ForegroundColor Yellow
    $connectionTest = Test-NetConnection -ComputerName localhost -Port 5432 -InformationLevel Quiet -WarningAction SilentlyContinue
    
    if ($connectionTest) {
        Write-Host "   [OK] Koneksi ke PostgreSQL berhasil!" -ForegroundColor Green
        Write-Host ""
        Write-Host "   Anda sekarang bisa menjalankan:" -ForegroundColor Cyan
        Write-Host "   cd apps\backend\nestjs" -ForegroundColor Gray
        Write-Host "   pnpm run db:migrate" -ForegroundColor Gray
    } else {
        Write-Host "   [!] Service berjalan tapi port 5432 tidak dapat dijangkau" -ForegroundColor Yellow
        Write-Host "   Mungkin firewall memblokir atau port berbeda" -ForegroundColor Yellow
    }
    exit 0
}

# Start service
Write-Host "2. Memulai PostgreSQL service..." -ForegroundColor Yellow

$stoppedService = $pgServices | Where-Object { $_.Status -ne 'Running' } | Select-Object -First 1

if ($stoppedService) {
    try {
        Write-Host "   Mencoba memulai: $($stoppedService.Name)..." -ForegroundColor Gray
        Start-Service -Name $stoppedService.Name
        Start-Sleep -Seconds 3
        
        $status = (Get-Service -Name $stoppedService.Name).Status
        if ($status -eq 'Running') {
            Write-Host "   [OK] PostgreSQL service berhasil dimulai!" -ForegroundColor Green
            Write-Host ""
            
            # Test connection
            Write-Host "3. Memeriksa koneksi..." -ForegroundColor Yellow
            Start-Sleep -Seconds 2
            $connectionTest = Test-NetConnection -ComputerName localhost -Port 5432 -InformationLevel Quiet -WarningAction SilentlyContinue
            
            if ($connectionTest) {
                Write-Host "   [OK] Koneksi ke PostgreSQL berhasil!" -ForegroundColor Green
                Write-Host ""
                Write-Host "   Anda sekarang bisa menjalankan:" -ForegroundColor Cyan
                Write-Host "   cd apps\backend\nestjs" -ForegroundColor Gray
                Write-Host "   pnpm run db:migrate" -ForegroundColor Gray
            } else {
                Write-Host "   [!] Service dimulai tapi port 5432 belum siap" -ForegroundColor Yellow
                Write-Host "   Tunggu beberapa detik dan coba lagi" -ForegroundColor Yellow
            }
        } else {
            Write-Host "   [X] Gagal memulai service. Status: $status" -ForegroundColor Red
            Write-Host ""
            Write-Host "   Coba jalankan sebagai Administrator:" -ForegroundColor Yellow
            Write-Host "   Start-Service -Name '$($stoppedService.Name)'" -ForegroundColor Gray
        }
    } catch {
        Write-Host "   [X] Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "   Coba jalankan PowerShell sebagai Administrator:" -ForegroundColor Yellow
        Write-Host "   1. Klik kanan PowerShell > Run as Administrator" -ForegroundColor Gray
        Write-Host "   2. Jalankan: Start-Service -Name '$($stoppedService.Name)'" -ForegroundColor Gray
        Write-Host ""
        Write-Host "   Atau buka Services (services.msc) dan start secara manual" -ForegroundColor Gray
    }
} else {
    Write-Host "   [!] Semua service sudah berjalan atau tidak ada service yang bisa dimulai" -ForegroundColor Yellow
}

Write-Host ""

