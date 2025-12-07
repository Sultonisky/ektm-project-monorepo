# 🚀 Setup Awal Project EKTM

Panduan lengkap untuk setup awal project EKTM Monorepo.

## 📋 Prerequisites

Sebelum memulai, pastikan Anda sudah menginstall:

- **Node.js**: 18.0.0 atau lebih tinggi (20+ untuk mobile)
- **pnpm**: 8.0.0 atau lebih tinggi
- **PostgreSQL**: 13+ dengan database `ektm_db` (atau sesuai konfigurasi di `.env`)
- **Git**: untuk cloning repository

**Untuk Mobile Development (Windows):**
- **Android Studio**: untuk Android development
- **JDK 17**: Java Development Kit

## 🛠️ Langkah Setup

### 1. Clone Repository

```bash
git clone https://github.com/Sultonisky/ektm-project-monorepo.git
cd ektm-project-monorepo
```

### 2. Install Dependencies

Install semua dependencies untuk root dan semua workspaces:

```bash
pnpm install
```

### 3. Setup Environment Variables

#### Opsi A: Menggunakan Script Setup (Recommended)

Jalankan script setup otomatis:

```powershell
powershell -ExecutionPolicy Bypass -File ./scripts/setup.ps1
```

Script ini akan:
- Memeriksa prerequisites (Node.js, pnpm)
- Menginstall dependencies
- Membuat file `.env` dari template `.env.example`
- Generate Prisma Client

#### Opsi B: Manual Setup

**Backend** (`apps/backend/nestjs/.env`):

Buat file `.env` dari template:

```bash
cd apps/backend/nestjs
copy .env.example .env
```

Edit file `.env` dan sesuaikan:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/ektm_ubsi?schema=public"

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Midtrans Configuration
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
MIDTRANS_IS_PRODUCTION=false
```

**Admin Dashboard** (`apps/admin/sveltekit/.env`):

```bash
cd apps/admin/sveltekit
copy .env.example .env
```

Edit file `.env`:

```env
PUBLIC_API_BASE_URL=http://localhost:3000
```

**Mobile App** (`apps/mobile/react/.env`):

```bash
cd apps/mobile/react
copy .env.example .env
```

Edit file `.env` sesuai kebutuhan:

```env
# Untuk Android emulator
API_BASE_URL=http://10.0.2.2:3000

# Untuk iOS simulator
# API_BASE_URL=http://localhost:3000

# Untuk physical device (ganti dengan IP komputer Anda)
# API_BASE_URL=http://192.168.1.100:3000
```

### 4. Setup Database

#### 4.1. Buat Database PostgreSQL

Buat database sesuai dengan nama di `DATABASE_URL` di file `.env` (default: `ektm_db`).

**Opsi A: Menggunakan Script Setup Database (Recommended)**

```powershell
powershell -ExecutionPolicy Bypass -File ./scripts/setup-database.ps1
```

**Opsi B: Manual Setup**

Menggunakan psql:

```bash
psql -U postgres
CREATE DATABASE ektm_db;
\q
```

Atau menggunakan SQL:

```sql
CREATE DATABASE ektm_db;
```

#### 4.2. Generate Prisma Client

```bash
cd apps/backend/nestjs
pnpm run db:generate
```

#### 4.3. Run Migrations

```bash
pnpm run db:migrate
```

Ini akan menjalankan semua migration dan membuat tabel di database.

#### 4.4. Seed Database (Optional)

Untuk mengisi data awal:

```bash
pnpm run prisma:seed
```

### 5. Verifikasi Setup

#### Test Backend

```bash
cd apps/backend/nestjs
pnpm run dev
```

Backend akan berjalan di `http://localhost:3000`

#### Test Admin Dashboard

```bash
cd apps/admin/sveltekit
pnpm run dev
```

Admin dashboard akan berjalan di `http://localhost:5173`

#### Test Mobile App

```bash
cd apps/mobile/react
pnpm start
```

Kemudian di terminal lain:

```bash
# Untuk Android
pnpm android

# Untuk iOS (macOS only)
pnpm ios
```

## 🚀 Menjalankan Semua Aplikasi

Dari root directory, jalankan semua aplikasi sekaligus:

```bash
pnpm run dev
```

Perintah ini akan menjalankan semua apps secara bersamaan menggunakan Turborepo.

## 📝 Konfigurasi Tambahan

### Midtrans Configuration

Untuk menggunakan Midtrans payment gateway:

1. Daftar di [Midtrans](https://midtrans.com/)
2. Dapatkan Server Key dan Client Key
3. Update di `apps/backend/nestjs/.env`:
   ```env
   MIDTRANS_SERVER_KEY="your-actual-server-key"
   MIDTRANS_CLIENT_KEY="your-actual-client-key"
   MIDTRANS_IS_PRODUCTION=false  # true untuk production
   ```

### Database Connection

Pastikan `DATABASE_URL` di `.env` backend sesuai dengan konfigurasi PostgreSQL Anda:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ektm_db?schema=public"
```

Format:
- `username`: username PostgreSQL
- `password`: password PostgreSQL
- `localhost:5432`: host dan port (default: localhost:5432)
- `ektm_db`: nama database (atau sesuai kebutuhan Anda)

### Mobile App API Configuration

Untuk mobile app, sesuaikan `API_BASE_URL` berdasarkan environment:

- **Android Emulator**: `http://10.0.2.2:3000`
- **iOS Simulator**: `http://localhost:3000`
- **Physical Device**: `http://YOUR_LOCAL_IP:3000`

Untuk mendapatkan IP lokal komputer Anda (Windows):

```powershell
ipconfig
```

Cari IPv4 Address (biasanya di bawah "Wireless LAN adapter Wi-Fi" atau "Ethernet adapter")

## 🔧 Troubleshooting

### Error: Database connection failed

- Pastikan PostgreSQL sudah berjalan
- Pastikan database sesuai dengan `DATABASE_URL` di `.env` sudah dibuat
- Pastikan PostgreSQL service sudah berjalan
- Periksa `DATABASE_URL` di `.env` backend

### Error: Prisma Client not generated

```bash
cd apps/backend/nestjs
pnpm run db:generate
```

### Error: Port already in use

Ubah `PORT` di `.env` backend atau hentikan aplikasi yang menggunakan port tersebut.

### Error: pnpm not found

Install pnpm secara global:

```bash
npm install -g pnpm
```

### Mobile: Cannot connect to API

- Pastikan backend sudah berjalan
- Untuk physical device, pastikan IP di `.env` mobile sesuai dengan IP komputer
- Pastikan firewall tidak memblokir koneksi

## 📚 Next Steps

Setelah setup selesai, Anda bisa:

1. Baca dokumentasi lengkap di [README.md](README.md)
2. Lihat dokumentasi backend di [apps/backend/README.md](apps/backend/README.md)
3. Lihat dokumentasi admin di [apps/admin/README.md](apps/admin/README.md)
4. Lihat dokumentasi mobile di [apps/mobile/README.md](apps/mobile/README.md)

## 🆘 Butuh Bantuan?

Jika mengalami masalah:

1. Periksa [Troubleshooting](#-troubleshooting) di atas
2. Buka [GitHub Issues](https://github.com/Sultonisky/ektm-project-monorepo/issues)
3. Hubungi tim development

---

**Selamat coding! 🎉**

