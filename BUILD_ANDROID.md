# 📱 Build dan Install Aplikasi ke Android Emulator

Panduan lengkap untuk build dan install aplikasi EKTM ke Android emulator.

## 📋 Prerequisites

Sebelum memulai, pastikan Anda sudah menginstall:

1. **Android Studio** - Download dari https://developer.android.com/studio
2. **JDK 17** - Java Development Kit 17
3. **Android SDK** - Install melalui Android Studio
4. **Android Emulator** - Buat melalui Android Studio AVD Manager

## 🛠️ Setup Awal

### 1. Install Android Studio

1. Download Android Studio dari https://developer.android.com/studio
2. Install dengan default settings
3. Buka Android Studio dan ikuti setup wizard:
   - Install Android SDK
   - Install Android SDK Platform
   - Install Android Virtual Device (AVD)

### 2. Setup Environment Variables

Tambahkan ke System Environment Variables:

```powershell
# JAVA_HOME
JAVA_HOME=C:\Program Files\Java\jdk-17

# ANDROID_HOME
ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk

# PATH - Tambahkan:
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
%JAVA_HOME%\bin
```

**Cara menambahkan di Windows:**
1. Tekan `Win + R`, ketik `sysdm.cpl`
2. Tab "Advanced" > "Environment Variables"
3. Tambahkan variable di atas

### 3. Verifikasi Setup

```powershell
# Cek Java
java -version

# Cek Android SDK
adb version

# Cek Android SDK path
echo $env:ANDROID_HOME
```

## 📱 Membuat Android Emulator

### Opsi 1: Menggunakan Android Studio (GUI)

1. Buka Android Studio
2. Klik "More Actions" > "Virtual Device Manager"
3. Klik "Create Device"
4. Pilih device (contoh: Pixel 5)
5. Pilih system image (disarankan: API 33 atau 34)
6. Klik "Finish"

### Opsi 2: Menggunakan Command Line

```powershell
# List available system images
sdkmanager --list | Select-String "system-images"

# Install system image (contoh: API 33)
sdkmanager "system-images;android-33;google_apis;x86_64"

# Create AVD
avdmanager create avd -n Pixel_5_API_33 -k "system-images;android-33;google_apis;x86_64" -d "pixel_5"
```

## 🚀 Build dan Install Aplikasi

### Langkah 1: Start Android Emulator

**Opsi A: Dari Android Studio**
1. Buka Android Studio
2. Klik "More Actions" > "Virtual Device Manager"
3. Klik play button (▶) pada emulator yang ingin digunakan

**Opsi B: Dari Command Line**
```powershell
# List emulators
emulator -list-avds

# Start emulator
emulator -avd Pixel_5_API_33
```

**Opsi C: Menggunakan Script**
```powershell
powershell -ExecutionPolicy Bypass -File ./scripts/start-android-emulator.ps1
```

### Langkah 2: Verifikasi Emulator Berjalan

```powershell
# Cek connected devices
adb devices

# Output yang diharapkan:
# List of devices attached
# emulator-5554   device
```

### Langkah 3: Install Dependencies (Jika Belum)

```powershell
cd apps/mobile/react
pnpm install
```

### Langkah 4: Start Metro Bundler

Buka terminal baru dan jalankan:

```powershell
cd apps/mobile/react
pnpm start
```

Metro bundler akan berjalan di `http://localhost:8081`

### Langkah 5: Build dan Install ke Emulator

**Opsi A: Build dan Install Sekaligus (Recommended)**

```powershell
cd apps/mobile/react
pnpm android
```

Perintah ini akan:
- Build aplikasi
- Install ke emulator yang sedang berjalan
- Launch aplikasi

**Opsi B: Build Manual**

```powershell
cd apps/mobile/react

# Build debug APK
cd android
.\gradlew assembleDebug

# Install APK ke emulator
adb install app\build\outputs\apk\debug\app-debug.apk
```

### Langkah 6: Verifikasi Aplikasi Terinstall

```powershell
# Cek aplikasi yang terinstall
adb shell pm list packages | Select-String "ektm"

# Launch aplikasi
adb shell am start -n com.ektm/.MainActivity
```

## 🔧 Troubleshooting

### Error: "SDK location not found"

Tambahkan `local.properties` di `apps/mobile/react/android/`:

```properties
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

Atau jalankan:
```powershell
cd apps/mobile/react/android
echo "sdk.dir=$env:LOCALAPPDATA\Android\Sdk" | Out-File -FilePath local.properties -Encoding ASCII
```

### Error: "Java version tidak sesuai"

Pastikan menggunakan JDK 17:

```powershell
# Cek Java version
java -version

# Set JAVA_HOME jika belum
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
```

### Error: "Metro bundler tidak bisa connect"

1. Pastikan emulator berjalan
2. Restart Metro bundler:
   ```powershell
   cd apps/mobile/react
   pnpm start --reset-cache
   ```

### Error: "Gradle build failed"

1. Clean build:
   ```powershell
   cd apps/mobile/react/android
   .\gradlew clean
   ```

2. Rebuild:
   ```powershell
   cd apps/mobile/react
   pnpm android
   ```

### Emulator Lambat

1. Enable Hardware Acceleration di BIOS
2. Alokasikan lebih banyak RAM untuk emulator
3. Gunakan x86_64 system image (lebih cepat dari ARM)

### Port 8081 Sudah Digunakan

```powershell
# Cek process yang menggunakan port 8081
netstat -ano | findstr :8081

# Kill process (ganti PID dengan process ID)
taskkill /PID <PID> /F
```

## 📝 Script Helper

Saya sudah membuat script helper untuk memudahkan proses:

```powershell
# Start emulator
powershell -ExecutionPolicy Bypass -File ./scripts/start-android-emulator.ps1

# Build dan install
powershell -ExecutionPolicy Bypass -File ./scripts/build-android.ps1
```

## 🎯 Quick Start

```powershell
# 1. Start emulator (dari Android Studio atau command line)
emulator -avd Pixel_5_API_33

# 2. Tunggu sampai emulator siap (tunggu sampai home screen muncul)

# 3. Install dan jalankan aplikasi
cd apps/mobile/react
pnpm android
```

## 📱 Testing di Physical Device

Jika ingin test di physical device:

1. **Enable Developer Options** di Android device:
   - Settings > About Phone
   - Tap "Build Number" 7 kali

2. **Enable USB Debugging**:
   - Settings > Developer Options
   - Enable "USB Debugging"

3. **Connect Device**:
   ```powershell
   # Connect via USB
   adb devices
   
   # Atau via WiFi (Android 11+)
   adb pair <IP_ADDRESS>:<PORT>
   adb connect <IP_ADDRESS>:<PORT>
   ```

4. **Install Aplikasi**:
   ```powershell
   cd apps/mobile/react
   pnpm android
   ```

## 🔄 Update Aplikasi

Setelah melakukan perubahan kode:

1. **Hot Reload** (otomatis):
   - Shake device/emulator
   - Tekan `R` untuk reload
   - Atau tekan `Ctrl + M` (Windows) di emulator

2. **Rebuild** (jika ada perubahan native):
   ```powershell
   cd apps/mobile/react
   pnpm android
   ```

## 📚 Referensi

- React Native Android Setup: https://reactnative.dev/docs/environment-setup
- Android Studio: https://developer.android.com/studio
- ADB Commands: https://developer.android.com/studio/command-line/adb

---

**Tips:** Untuk development yang lebih cepat, gunakan Fast Refresh yang sudah diaktifkan secara default di React Native.

