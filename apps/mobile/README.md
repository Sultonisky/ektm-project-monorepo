# 📱 Mobile App (React Native)

Aplikasi mobile React Native untuk EKTM UBSI yang terintegrasi dengan monorepo.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- Android Studio (untuk Android)
- Xcode (untuk iOS, macOS only)

### Install Dependencies

```bash
# Dari root monorepo
pnpm install

# Atau dari directory mobile
cd apps/mobile/react
pnpm install
```

### Development

**Jalankan Metro Bundler:**
```bash
# Dari root
pnpm --filter @monorepo-ektm/mobile start

# Atau dari directory mobile
cd apps/mobile/react
pnpm start
```

**Jalankan di Android:**
```bash
pnpm --filter @monorepo-ektm/mobile android
```

**Jalankan di iOS:**
```bash
pnpm --filter @monorepo-ektm/mobile ios
```

## 📦 Workspace Packages

Mobile app sudah dikonfigurasi untuk menggunakan shared packages:

- `@monorepo-ektm/types` - Shared TypeScript types
- `@monorepo-ektm/utils` - Shared utilities
- `@monorepo-ektm/database` - Prisma Client (jika perlu untuk type definitions)

**Contoh penggunaan:**
```typescript
import { User, Payment } from '@monorepo-ektm/types';
import { formatCurrency } from '@monorepo-ektm/utils';
```

## ⚙️ Configuration

### Metro Config

Metro sudah dikonfigurasi dengan:
- `watchFolders` untuk monorepo packages
- Resolver alias untuk workspace packages

### Babel Config

Babel menggunakan `babel-plugin-module-resolver` dengan alias:
- Local aliases: `@videos`, `@images`, `@icons`
- Workspace packages: `@monorepo-ektm/*`

### TypeScript

Path mapping sudah dikonfigurasi di `tsconfig.json` untuk workspace packages.

## 🛠️ Scripts

- `pnpm start` - Start Metro bundler
- `pnpm android` - Run on Android
- `pnpm ios` - Run on iOS
- `pnpm test` - Run tests
- `pnpm lint` - Lint code
- `pnpm clean` - Clean build artifacts (Windows-friendly)

## 🔧 Setup Environment (Android di Windows)

### 1. Install Java Development Kit (JDK)

Download dan install **JDK 17** (disarankan untuk React Native):
- [Oracle JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) atau
- [Microsoft OpenJDK 17](https://learn.microsoft.com/en-us/java/openjdk/download#openjdk-17)

Setelah install, set environment variable:

**PowerShell (temporary untuk session ini):**
```powershell
$env:JAVA_HOME="C:\Program Files\Java\jdk-17"  # Ganti dengan path JDK Anda
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
```

**Permanent (System Environment Variables):**
1. Buka **System Properties** > **Environment Variables**
2. Tambahkan **JAVA_HOME** = `C:\Program Files\Java\jdk-17` (sesuaikan path)
3. Edit **PATH**, tambahkan: `%JAVA_HOME%\bin`

Verifikasi:
```powershell
java -version
javac -version
```

### 2. Install Android Studio

1. Download [Android Studio](https://developer.android.com/studio)
2. Install Android Studio dengan default settings
3. Buka Android Studio > **More Actions** > **SDK Manager**
4. Install:
   - Android SDK Platform 33 (atau versi terbaru)
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools (termasuk `adb`)

### 3. Set Android Environment Variables

Tambahkan ke **System Environment Variables**:

1. **ANDROID_HOME** = `C:\Users\YourUsername\AppData\Local\Android\Sdk`
   (atau lokasi instalasi Android SDK Anda)

2. Edit **PATH**, tambahkan:
   - `%ANDROID_HOME%\platform-tools` (untuk `adb`)
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`
   - `%ANDROID_HOME%\emulator`

Verifikasi:
```powershell
adb version
```

### 4. Setup Android Emulator

1. Buka Android Studio > **More Actions** > **Virtual Device Manager**
2. Click **Create Device**
3. Pilih device (misal: Pixel 5)
4. Download system image (misal: Android 13 - API 33)
5. Finish setup

### 5. Verifikasi Setup

Jalankan React Native doctor:
```bash
cd apps/mobile/react
npx react-native doctor
```

Ini akan mengecek apakah semua requirement sudah terpenuhi.

## 📝 Notes

- **Android**: 
  - Pastikan JAVA_HOME dan ANDROID_HOME sudah diset dengan benar
  - Restart terminal/PowerShell setelah set environment variables
  - Jika masih error, jalankan `npx react-native doctor` untuk diagnosa
- **iOS**: 
  - Hanya tersedia di macOS dengan Xcode terinstall
  - Setelah `pnpm install`, jalankan `cd ios && pod install` (hanya di macOS)
  - Di Windows, iOS development tidak didukung (butuh macOS)
- Jika ada masalah dengan workspace packages, restart Metro bundler dengan `pnpm start --reset-cache`
- Untuk development di Windows, fokus ke Android saja

## 🐛 Troubleshooting

### Error: JAVA_HOME not set
- Pastikan JDK sudah terinstall
- Set JAVA_HOME environment variable
- Restart terminal

### Error: adb not found
- Pastikan Android SDK Platform-Tools sudah terinstall
- Tambahkan `%ANDROID_HOME%\platform-tools` ke PATH
- Restart terminal

### Error: No emulators found
- Buat emulator via Android Studio Virtual Device Manager
- Atau jalankan emulator manual sebelum `pnpm android`
- Atau gunakan physical device via USB debugging

## 🔗 Related

- [Backend API](../backend/README.md)
- [Admin Dashboard](../admin/README.md)

