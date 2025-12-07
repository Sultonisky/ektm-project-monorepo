# Script untuk Build dan Install Aplikasi ke Android
# Script ini membantu build dan install aplikasi React Native ke Android emulator/device

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Build dan Install Android App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
$mobilePath = "apps\mobile\react"
if (-not (Test-Path $mobilePath)) {
    Write-Host "   [X] Directory mobile app tidak ditemukan" -ForegroundColor Red
    Write-Host "   Pastikan script dijalankan dari root project" -ForegroundColor Yellow
    exit 1
}

Set-Location $mobilePath

# Check Android SDK
Write-Host "1. Memeriksa Android SDK..." -ForegroundColor Yellow

$androidHome = $env:ANDROID_HOME
if (-not $androidHome) {
    $androidHome = "$env:LOCALAPPDATA\Android\Sdk"
    Write-Host "   [!] ANDROID_HOME tidak di-set, menggunakan default: $androidHome" -ForegroundColor Yellow
}

if (-not (Test-Path $androidHome)) {
    Write-Host "   [X] Android SDK tidak ditemukan" -ForegroundColor Red
    Write-Host "   Silakan install Android Studio: https://developer.android.com/studio" -ForegroundColor Yellow
    exit 1
}

Write-Host "   [OK] Android SDK ditemukan" -ForegroundColor Green

# Check local.properties
Write-Host ""
Write-Host "2. Memeriksa local.properties..." -ForegroundColor Yellow

$localPropertiesPath = "android\local.properties"
if (-not (Test-Path $localPropertiesPath)) {
    Write-Host "   [!] local.properties tidak ditemukan, membuat file..." -ForegroundColor Yellow
    $sdkDir = $androidHome -replace "\\", "\\"
    "sdk.dir=$sdkDir" | Out-File -FilePath $localPropertiesPath -Encoding ASCII
    Write-Host "   [OK] local.properties berhasil dibuat" -ForegroundColor Green
} else {
    Write-Host "   [OK] local.properties sudah ada" -ForegroundColor Green
}

# Check connected devices
Write-Host ""
Write-Host "3. Memeriksa device yang terhubung..." -ForegroundColor Yellow

$adbPath = Join-Path $androidHome "platform-tools\adb.exe"
if (Test-Path $adbPath) {
    $devices = & $adbPath devices | Select-String "device$"
    if ($devices) {
        Write-Host "   [OK] Device/Emulator terhubung:" -ForegroundColor Green
        $devices | ForEach-Object {
            Write-Host "      $_" -ForegroundColor Gray
        }
    } else {
        Write-Host "   [!] Tidak ada device/emulator yang terhubung" -ForegroundColor Yellow
        Write-Host "   Pastikan emulator sudah berjalan atau device terhubung via USB" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   Untuk start emulator:" -ForegroundColor Cyan
        Write-Host "   powershell -ExecutionPolicy Bypass -File ..\..\..\scripts\start-android-emulator.ps1" -ForegroundColor Gray
        Write-Host ""
        $continue = Read-Host "   Lanjutkan build? (y/n)"
        if ($continue -ne "y") {
            exit 0
        }
    }
} else {
    Write-Host "   [!] ADB tidak ditemukan" -ForegroundColor Yellow
}

# Install dependencies
Write-Host ""
Write-Host "4. Memeriksa dependencies..." -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Host "   [!] node_modules tidak ditemukan, menginstall dependencies..." -ForegroundColor Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   [X] Gagal menginstall dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "   [OK] Dependencies berhasil diinstall" -ForegroundColor Green
} else {
    Write-Host "   [OK] Dependencies sudah terinstall" -ForegroundColor Green
}

# Build and install
Write-Host ""
Write-Host "5. Build dan install aplikasi..." -ForegroundColor Yellow
Write-Host "   Ini mungkin memakan waktu beberapa menit..." -ForegroundColor Gray
Write-Host ""

pnpm android

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Build dan Install Berhasil!" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Aplikasi sudah terinstall di emulator/device" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tips:" -ForegroundColor Yellow
    Write-Host "  - Shake device untuk membuka developer menu" -ForegroundColor Gray
    Write-Host "  - Tekan R untuk reload aplikasi" -ForegroundColor Gray
    Write-Host "  - Tekan Ctrl+M (Windows) untuk developer menu" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "   [X] Build atau install gagal" -ForegroundColor Red
    Write-Host "   Periksa error di atas untuk detail" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

