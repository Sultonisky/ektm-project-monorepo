# Script untuk Start Android Emulator
# Script ini membantu memulai Android emulator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Start Android Emulator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Android SDK
Write-Host "1. Memeriksa Android SDK..." -ForegroundColor Yellow

$androidHome = $env:ANDROID_HOME
if (-not $androidHome) {
    $androidHome = "$env:LOCALAPPDATA\Android\Sdk"
    Write-Host "   [!] ANDROID_HOME tidak di-set, menggunakan default: $androidHome" -ForegroundColor Yellow
}

if (-not (Test-Path $androidHome)) {
    Write-Host "   [X] Android SDK tidak ditemukan di: $androidHome" -ForegroundColor Red
    Write-Host "   Silakan install Android Studio terlebih dahulu" -ForegroundColor Yellow
    Write-Host "   Download: https://developer.android.com/studio" -ForegroundColor Gray
    exit 1
}

$emulatorPath = Join-Path $androidHome "emulator\emulator.exe"
if (-not (Test-Path $emulatorPath)) {
    Write-Host "   [X] Emulator tidak ditemukan" -ForegroundColor Red
    Write-Host "   Silakan install Android Emulator melalui Android Studio" -ForegroundColor Yellow
    exit 1
}

Write-Host "   [OK] Android SDK ditemukan: $androidHome" -ForegroundColor Green

# Check if emulator is already running
Write-Host ""
Write-Host "2. Memeriksa emulator yang berjalan..." -ForegroundColor Yellow

$adbPath = Join-Path $androidHome "platform-tools\adb.exe"
if (Test-Path $adbPath) {
    $runningDevices = & $adbPath devices | Select-String "emulator"
    if ($runningDevices) {
        Write-Host "   [OK] Emulator sudah berjalan" -ForegroundColor Green
        & $adbPath devices
        Write-Host ""
        Write-Host "   Anda bisa langsung menjalankan:" -ForegroundColor Cyan
        Write-Host "   cd apps\mobile\react" -ForegroundColor Gray
        Write-Host "   pnpm android" -ForegroundColor Gray
        exit 0
    }
} else {
    Write-Host "   [!] ADB tidak ditemukan, skip pengecekan" -ForegroundColor Yellow
}

# List available AVDs
Write-Host ""
Write-Host "3. Mencari Android Virtual Devices (AVD)..." -ForegroundColor Yellow

$avdManagerPath = Join-Path $androidHome "cmdline-tools\latest\bin\avdmanager.bat"
if (-not (Test-Path $avdManagerPath)) {
    # Try alternative path
    $avdManagerPath = Join-Path $androidHome "tools\bin\avdmanager.bat"
}

if (Test-Path $avdManagerPath) {
    $avds = & $avdManagerPath list avd 2>&1 | Select-String "Name:"
    if ($avds) {
        Write-Host "   [OK] AVD ditemukan:" -ForegroundColor Green
        $avds | ForEach-Object {
            $name = $_ -replace ".*Name: ", "" -replace ".*Path:.*", ""
            Write-Host "      - $name" -ForegroundColor Gray
        }
    } else {
        Write-Host "   [!] Tidak ada AVD yang ditemukan" -ForegroundColor Yellow
        Write-Host "   Silakan buat AVD melalui Android Studio:" -ForegroundColor Yellow
        Write-Host "   1. Buka Android Studio" -ForegroundColor Gray
        Write-Host "   2. More Actions > Virtual Device Manager" -ForegroundColor Gray
        Write-Host "   3. Create Device" -ForegroundColor Gray
        exit 1
    }
} else {
    Write-Host "   [!] AVD Manager tidak ditemukan" -ForegroundColor Yellow
    Write-Host "   Menggunakan emulator langsung..." -ForegroundColor Gray
}

# Start emulator
Write-Host ""
Write-Host "4. Memulai emulator..." -ForegroundColor Yellow

# Get first AVD name
if ($avds) {
    $firstAvd = ($avds[0] -replace ".*Name: ", "").Trim()
    Write-Host "   Menggunakan AVD: $firstAvd" -ForegroundColor Gray
    
    # Start emulator in background
    Write-Host "   Memulai emulator (ini mungkin memakan waktu beberapa menit)..." -ForegroundColor Yellow
    Start-Process -FilePath $emulatorPath -ArgumentList "-avd", $firstAvd -WindowStyle Minimized
    
    Write-Host "   [OK] Emulator sedang dimulai..." -ForegroundColor Green
    Write-Host ""
    Write-Host "   Tunggu sampai emulator siap (home screen muncul)" -ForegroundColor Yellow
    Write-Host "   Anda bisa cek status dengan: adb devices" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Setelah emulator siap, jalankan:" -ForegroundColor Cyan
    Write-Host "   cd apps\mobile\react" -ForegroundColor Gray
    Write-Host "   pnpm android" -ForegroundColor Gray
} else {
    Write-Host "   [!] Tidak bisa menentukan AVD" -ForegroundColor Yellow
    Write-Host "   Silakan start emulator secara manual:" -ForegroundColor Yellow
    Write-Host "   1. Buka Android Studio" -ForegroundColor Gray
    Write-Host "   2. Virtual Device Manager" -ForegroundColor Gray
    Write-Host "   3. Klik play button pada emulator yang diinginkan" -ForegroundColor Gray
}

Write-Host ""

