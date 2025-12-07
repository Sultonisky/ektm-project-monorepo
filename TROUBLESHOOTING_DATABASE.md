# 🔧 Troubleshooting: Database Connection Error

## Error yang Terjadi

```
Error: P1001: Can't reach database server at `localhost:5432`
Please make sure your database server is running at `localhost:5432`.
```

## Penyebab

1. **PostgreSQL service tidak berjalan**
2. **Database belum dibuat**
3. **Konfigurasi DATABASE_URL tidak sesuai**

## Solusi

### 1. Memeriksa dan Memulai PostgreSQL Service

**Menggunakan PowerShell:**

```powershell
# Cek status PostgreSQL
Get-Service -Name "*postgresql*"

# Jika tidak berjalan, mulai service
Start-Service -Name "postgresql-x64-XX"  # Ganti XX dengan versi Anda
```

**Menggunakan Services (GUI):**

1. Tekan `Win + R`, ketik `services.msc`
2. Cari service "PostgreSQL"
3. Klik kanan > Start

**Menggunakan Command Prompt (sebagai Administrator):**

```cmd
net start postgresql-x64-XX
```

### 2. Membuat Database

**Menggunakan Script Otomatis (Recommended):**

```powershell
powershell -ExecutionPolicy Bypass -File ./scripts/setup-database.ps1
```

**Menggunakan psql:**

```bash
# Masuk ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE ektm_db;

# Keluar
\q
```

**Menggunakan pgAdmin:**

1. Buka pgAdmin
2. Klik kanan pada "Databases" > Create > Database
3. Masukkan nama: `ektm_db`
4. Klik Save

### 3. Memverifikasi Konfigurasi .env

Pastikan file `apps/backend/nestjs/.env` memiliki konfigurasi yang benar:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ektm_db?schema=public"
```

**Ganti:**
- `username`: username PostgreSQL Anda (default: `postgres`)
- `password`: password PostgreSQL Anda
- `ektm_db`: nama database (sesuai dengan yang Anda buat)

### 4. Test Koneksi

**Menggunakan PowerShell:**

```powershell
Test-NetConnection -ComputerName localhost -Port 5432
```

Jika berhasil, akan muncul:
```
TcpTestSucceeded : True
```

**Menggunakan psql:**

```bash
psql -U postgres -d ektm_db
```

Jika berhasil, Anda akan masuk ke PostgreSQL prompt.

### 5. Jalankan Migration

Setelah database dibuat dan PostgreSQL berjalan:

```bash
cd apps/backend/nestjs
pnpm run db:migrate
```

## Checklist

- [ ] PostgreSQL service sudah berjalan
- [ ] Port 5432 dapat diakses (tidak diblokir firewall)
- [ ] Database `ektm_db` sudah dibuat
- [ ] File `.env` memiliki `DATABASE_URL` yang benar
- [ ] Username dan password di `DATABASE_URL` sesuai dengan PostgreSQL

## Masalah Umum Lainnya

### Port 5432 Sudah Digunakan

Jika port 5432 sudah digunakan oleh aplikasi lain:

1. Cek aplikasi yang menggunakan port:
   ```powershell
   netstat -ano | findstr :5432
   ```

2. Ubah port PostgreSQL di konfigurasi, atau
3. Hentikan aplikasi yang menggunakan port tersebut

### Firewall Memblokir Koneksi

Tambahkan exception untuk PostgreSQL di Windows Firewall:

1. Buka Windows Defender Firewall
2. Advanced Settings
3. Inbound Rules > New Rule
4. Pilih Port > TCP > Specific local ports: 5432
5. Allow the connection

### Password PostgreSQL Tidak Diketahui

Jika lupa password PostgreSQL:

1. Edit file `pg_hba.conf` (biasanya di `C:\Program Files\PostgreSQL\XX\data\`)
2. Ubah method authentication menjadi `trust` untuk localhost
3. Restart PostgreSQL service
4. Login tanpa password: `psql -U postgres`
5. Ubah password: `ALTER USER postgres WITH PASSWORD 'newpassword';`
6. Kembalikan `pg_hba.conf` ke setting semula

## Bantuan Lebih Lanjut

Jika masalah masih terjadi:

1. Periksa log PostgreSQL untuk error detail
2. Pastikan PostgreSQL versi 13+ sudah terinstall
3. Cek dokumentasi PostgreSQL: https://www.postgresql.org/docs/

---

**Catatan:** Script `setup-database.ps1` akan membantu otomatis memeriksa dan setup database.

