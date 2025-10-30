# 🚀 Backend API (NestJS)

Backend untuk sistem EKTM UBSI menggunakan NestJS 11.x, PostgreSQL, dan Prisma ORM.

## 📂 Struktur Direktori

```
apps/backend/
└─ nestjs/
   ├─ src/                # Source code NestJS
   ├─ prisma/             # Prisma schema, migrations, seed
   ├─ common/             # Prisma service & logger
   ├─ package.json        # Scripts & dependencies
   └─ tsconfig*.json
```

## ✅ Prasyarat
- Node.js 18+
- PostgreSQL 13+
- npm/pnpm/yarn (pilih salah satu)

## ⚙️ Environment Variables
Buat file `.env` di `apps/backend/nestjs/` dengan contoh berikut:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ektm_ubsi"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"

# Midtrans
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
MIDTRANS_IS_PRODUCTION=false
```

## 🔧 Instalasi & Menjalankan
Jalankan perintah di folder backend NestJS:

```bash
cd apps/backend/nestjs
npm install

# sinkronisasi prisma client (opsional setelah install)
npm run db:generate

# jalankan dev server
npm run dev
```

- API default: `http://localhost:3000`
- Swagger (jika diaktifkan): `http://localhost:3000/api`

## 🗃️ Database & Prisma
Perintah umum Prisma:

```bash
# generate client
npm run db:generate

# push schema ke database (tanpa migration)
npm run db:push

# migration dev (membuat migration + apply)
npm run db:migrate

# buka prisma studio
npm run db:studio

# reset database (hati-hati, akan menghapus data)
npm run db:reset

# jalankan seed
npm run prisma:seed
```

Catatan: `db:reset` di script saat ini menjalankan reset dan generate serta memanggil seed (sesuaikan jika menggunakan npm/pnpm).

## 🧪 Scripts Penting
- `npm run dev`: Start NestJS dengan watch
- `npm run start`: Start NestJS tanpa watch
- `npm run start:prod`: Jalankan build hasil produksi
- `npm run build`: Build TypeScript → `dist`
- `npm run lint`: ESLint fix
- `npm run format`: Prettier write
- `npm run clean`: Hapus folder `dist`

## 🧫 Seeding Data
Seeder tersedia di `prisma/seed.ts` dan membuat:
- 2 akun admin (email/password ada di log setelah seed)
- Campus, Fakultas, Jurusan
- BiayaDefault 1–8 per jurusan
- Data Mahasiswa dan contoh Payment

Jalankan:
```bash
npm run prisma:seed
```

## 🔐 Autentikasi
- JWT (Bearer) dengan `@nestjs/jwt` dan `passport-jwt`
- Role: `admin` dan `mahasiswa`

## 🔌 Endpoint (ringkas)
- Auth: `POST /auth/login/admin`, `POST /auth/login/mahasiswa`
- Users: `GET/POST/PUT/DELETE /users`
- Mahasiswa: `GET/POST/PUT /mahasiswa`, `GET /mahasiswa/:id/payments`
- Akademik: `GET /campus`, `GET /fakultas`, `GET /jurusan`
- Biaya: `GET /biaya`
- Payment: `GET/POST/PUT /payment`, `POST /payment/:id/midtrans-callback`

Pastikan CORS mengizinkan origin frontend SvelteKit (default: `http://localhost:5173`).

## 📦 Build & Deploy
```bash
# build
npm run build

# jalankan produksi
npm run start:prod
```

Konfigurasi proses manager (PM2/Docker) dan environment produksi sesuai kebutuhan.

---
Dibuat dengan ❤️ menggunakan NestJS + Prisma.
