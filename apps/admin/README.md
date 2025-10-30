# 🛠️ Admin Dashboard (SvelteKit)

Dashboard admin untuk sistem EKTM UBSI, dibangun dengan SvelteKit 2.x + TypeScript. Repository ini berada di dalam monorepo dan menjadi frontend untuk pengelolaan data (users, mahasiswa, kampus, fakultas, jurusan, biaya, dll).

## 📂 Struktur Direktori

```
apps/admin/
├─ README.md                 # Dokumen ini
└─ sveltekit/                # Source code SvelteKit
   ├─ package.json           # Scripts & dependencies
   ├─ src/
   │  ├─ lib/                # API clients, utils, assets
   │  └─ routes/             # Halaman & layout dashboard
   └─ svelte.config.js       # Konfigurasi SvelteKit
```

## ✅ Prasyarat
- Node.js 18+
- npm / pnpm / yarn (pilih salah satu)
- Backend API (NestJS) berjalan lokal atau URL siap pakai

## ⚙️ Konfigurasi Environment
Aplikasi membaca base URL API dari environment publik SvelteKit:

- **PUBLIC_API_BASE_URL**: Base URL backend, contoh `http://localhost:3000`

Buat file `.env` di `apps/admin/sveltekit/`:

```env
PUBLIC_API_BASE_URL="http://localhost:3000"
```

Catatan: Variabel yang diakses di browser harus diawali `PUBLIC_` (konvensi SvelteKit).

## 🚀 Menjalankan Secara Lokal
Dari root repo (atau langsung di folder `sveltekit`):

```bash
cd apps/admin/sveltekit
npm install
npm run dev
```

Default dev server: `http://localhost:5173`

## 🧰 Scripts Penting
Jalankan di `apps/admin/sveltekit`:

- `npm run dev`: Menjalankan dev server (Vite)
- `npm run build`: Build produksi
- `npm run preview`: Preview hasil build
- `npm run check`: Sinkronisasi SvelteKit + type check (`svelte-check`)
- `npm run check:watch`: Type check mode watch
- `npm run clean`: Hapus `.svelte-kit`, `dist`, `build`

## 🧩 Fitur Utama (Ringkas)
- Autentikasi admin (cookie `admin_token`) dan proteksi route (`/dashboard/*`)
- Manajemen data: Campus, Fakultas, Jurusan, Mahasiswa, Users, Biaya
- UI responsif dan modern

## 🔌 Integrasi API
Client API menggunakan `PUBLIC_API_BASE_URL` untuk memanggil endpoint backend, contoh:
- Auth admin: `POST /auth/login/admin`
- Resource akademik: `/campus`, `/fakultas`, `/jurusan`, `/mahasiswa`, `/users`, `/biaya`

Pastikan CORS backend mengizinkan origin dev (`http://localhost:5173`).

## 📦 Build & Deploy
Produksi lokal:

```bash
cd apps/admin/sveltekit
npm run build
npm run preview
```

Untuk deploy, pasang adapter sesuai target (lihat dokumentasi adapter SvelteKit) dan set environment `PUBLIC_API_BASE_URL` di environment produksi.

## 🔗 Terkait
- Backend (NestJS): `apps/backend/nestjs`
- Dokumentasi umum proyek: README di root repo

---
Dibuat dengan ❤️ menggunakan SvelteKit.

