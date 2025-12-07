# 📦 Panduan Install PostgreSQL untuk Windows

PostgreSQL belum terinstall di sistem Anda. Ikuti salah satu metode di bawah ini:

## 🚀 Opsi 1: Install PostgreSQL dengan Installer (Recommended)

### Langkah-langkah:

1. **Download PostgreSQL Installer**
   - Kunjungi: https://www.postgresql.org/download/windows/
   - Klik "Download the installer"
   - Pilih versi terbaru (disarankan 13 atau lebih tinggi)
   - Download installer untuk Windows x86-64

2. **Install PostgreSQL**
   - Jalankan installer yang sudah didownload
   - Ikuti wizard installation:
     - **Installation Directory**: Biarkan default atau pilih lokasi lain
     - **Select Components**: Pastikan semua tercentang (PostgreSQL Server, pgAdmin 4, Command Line Tools, Stack Builder)
     - **Data Directory**: Biarkan default
     - **Password**: Masukkan password untuk user `postgres` (INGAT PASSWORD INI!)
     - **Port**: Biarkan default `5432`
     - **Advanced Options**: Biarkan default
     - **Pre Installation Summary**: Review dan klik Next
     - **Ready to Install**: Klik Next dan tunggu proses install

3. **Verifikasi Installasi**
   ```powershell
   # Cek service
   Get-Service -Name "*postgresql*"
   
   # Test koneksi
   Test-NetConnection -ComputerName localhost -Port 5432
   ```

4. **Update .env File**
   Edit `apps/backend/nestjs/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ektm_db?schema=public"
   ```
   Ganti `YOUR_PASSWORD` dengan password yang Anda buat saat install.

---

## 🐳 Opsi 2: Menggunakan Docker (Lebih Mudah)

Jika Anda sudah install Docker Desktop, ini cara termudah:

### Langkah-langkah:

1. **Pull PostgreSQL Image**
   ```powershell
   docker pull postgres:13
   ```

2. **Jalankan PostgreSQL Container**
   ```powershell
   docker run --name postgres-ektm `
     -e POSTGRES_PASSWORD=postgres `
     -e POSTGRES_DB=ektm_db `
     -p 5432:5432 `
     -d postgres:13
   ```

3. **Verifikasi Container Berjalan**
   ```powershell
   docker ps
   ```

4. **Update .env File**
   Edit `apps/backend/nestjs/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ektm_db?schema=public"
   ```

5. **Stop Container (jika perlu)**
   ```powershell
   docker stop postgres-ektm
   ```

6. **Start Container Kembali**
   ```powershell
   docker start postgres-ektm
   ```

**Keuntungan Docker:**
- ✅ Tidak perlu install PostgreSQL secara permanen
- ✅ Mudah dihapus jika tidak diperlukan
- ✅ Isolasi dari sistem
- ✅ Bisa menjalankan beberapa versi PostgreSQL

---

## 🍫 Opsi 3: Menggunakan Chocolatey

Jika Anda menggunakan Chocolatey package manager:

```powershell
# Install Chocolatey (jika belum ada)
# Kunjungi: https://chocolatey.org/install

# Install PostgreSQL
choco install postgresql13 -y

# Atau versi terbaru
choco install postgresql -y
```

Setelah install, restart PowerShell dan verifikasi:
```powershell
Get-Service -Name "*postgresql*"
```

---

## ✅ Setelah Install PostgreSQL

### 1. Buat Database

**Menggunakan psql:**
```powershell
# Masuk ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE ektm_db;

# Keluar
\q
```

**Menggunakan pgAdmin:**
1. Buka pgAdmin 4
2. Connect ke server (masukkan password)
3. Klik kanan "Databases" > Create > Database
4. Nama: `ektm_db`
5. Klik Save

### 2. Update .env File

Pastikan `apps/backend/nestjs/.env` memiliki:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ektm_db?schema=public"
```

### 3. Jalankan Migration

```powershell
cd apps/backend/nestjs
pnpm run db:migrate
```

---

## 🔧 Troubleshooting

### PostgreSQL Service Tidak Berjalan

**Menggunakan Script:**
```powershell
powershell -ExecutionPolicy Bypass -File ./scripts/start-postgresql.ps1
```

**Manual:**
```powershell
# Cek service
Get-Service -Name "*postgresql*"

# Start service
Start-Service -Name "postgresql-x64-XX"  # Ganti XX dengan versi

# Atau melalui Services
# Win + R > services.msc > Cari PostgreSQL > Start
```

### Port 5432 Sudah Digunakan

Jika port 5432 sudah digunakan:

1. **Cek aplikasi yang menggunakan port:**
   ```powershell
   netstat -ano | findstr :5432
   ```

2. **Ubah port PostgreSQL** atau hentikan aplikasi lain

3. **Update .env** dengan port baru:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5433/ektm_db?schema=public"
   ```

### Lupa Password PostgreSQL

1. Edit `pg_hba.conf` (biasanya di `C:\Program Files\PostgreSQL\XX\data\`)
2. Ubah method untuk localhost menjadi `trust`
3. Restart PostgreSQL service
4. Login tanpa password: `psql -U postgres`
5. Ubah password: `ALTER USER postgres WITH PASSWORD 'newpassword';`
6. Kembalikan `pg_hba.conf` ke setting semula
7. Restart PostgreSQL service

---

## 📝 Quick Start (Setelah Install)

```powershell
# 1. Start PostgreSQL (jika belum)
powershell -ExecutionPolicy Bypass -File ./scripts/start-postgresql.ps1

# 2. Setup database
powershell -ExecutionPolicy Bypass -File ./scripts/setup-database.ps1

# 3. Run migration
cd apps/backend/nestjs
pnpm run db:migrate
```

---

## 🆘 Butuh Bantuan?

- Dokumentasi PostgreSQL: https://www.postgresql.org/docs/
- Docker Hub PostgreSQL: https://hub.docker.com/_/postgres
- Stack Overflow: Tag `postgresql` dan `windows`

---

**Rekomendasi:** Untuk development, gunakan **Docker** karena lebih mudah dan tidak mengotori sistem.

