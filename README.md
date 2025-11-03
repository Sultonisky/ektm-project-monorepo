# 🎓 EKTM UBSI - Sistem Manajemen Pembayaran Kuliah

<div align="center">

<img src="https://img.shields.io/badge/Turborepo-000000?style=for-the-badge&logo=turborepo&logoColor=white" />
<img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />

</div>

<br/>

<div align="center">

<img src="https://img.shields.io/badge/NestJS-EA2845?style=for-the-badge&logo=nestjs&logoColor=white" alt="Backend" />
<img src="https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white" alt="Admin" />
<img src="https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="Mobile" />

</div>

<br/>

<div align="center">

<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/Midtrans-00B7BE?style=for-the-badge&logo=midtrans&logoColor=white" />

</div>

## 📋 Tentang Proyek

**EKTM UBSI** adalah sistem manajemen pembayaran kuliah komprehensif untuk Universitas Bina Sarana Informatika (UBSI). Sistem ini memungkinkan mahasiswa melakukan pembayaran kuliah secara online dengan berbagai metode pembayaran yang terintegrasi dengan Midtrans payment gateway.

### ✨ Fitur Utama

- **👥 Manajemen User & Mahasiswa**: Sistem autentikasi dengan role-based access control (Admin & Mahasiswa)
- **🏛️ Manajemen Akademik**: Pengelolaan Campus, Fakultas, Jurusan, dan Mata Kuliah
- **💰 Sistem Pembayaran**: Integrasi dengan Midtrans untuk berbagai metode pembayaran
- **📊 Dashboard Admin**: Interface admin yang user-friendly untuk monitoring dan manajemen
- **📱 Aplikasi Mobile**: Aplikasi React Native untuk mahasiswa dengan fitur lengkap
- **💻 Responsive Design**: Dashboard yang responsif dan modern
- **🔐 Keamanan**: JWT Authentication dengan bcrypt password hashing
- **📝 Logging**: Sistem logging yang komprehensif dengan Winston
- **🎨 UI/UX Modern**: Interface yang clean dan intuitif

---

## 🔗 Quick Links

- 📖 [Backend Documentation](apps/backend/README.md) - NestJS API server
- 📖 [Admin Dashboard](apps/admin/README.md) - SvelteKit admin panel
- 📖 [Mobile App](apps/mobile/README.md) - React Native mobile application

---

## 🏗️ Arsitektur Monorepo

Proyek ini menggunakan **Turborepo** untuk mengelola monorepo dengan struktur berikut:

```
monorepo-ektm/
├── apps/                                    # Applications
│   ├── backend/
│   │   └── nestjs/                          # 🚀 Backend API (NestJS 11.x)
│   │       ├── src/                         # Source code
│   │       ├── prisma/                      # Database schema & migrations
│   │       └── package.json
│   ├── admin/
│   │   └── sveltekit/                       # 🎨 Admin Dashboard (SvelteKit 2.x)
│   │       ├── src/
│   │       └── package.json
│   └── mobile/
│       └── react/                           # 📱 Mobile App (React Native)
│           ├── src/
│           ├── android/
│           ├── ios/
│           └── package.json
│
├── packages/                                # Shared packages
│   ├── database/                            # 📦 Prisma Client re-export
│   ├── types/                               # 🔷 Shared TypeScript types
│   └── utils/                               # 🛠️ Shared utilities
│
├── pnpm-workspace.yaml                      # PNPM workspace config
├── turbo.json                               # Turborepo config
├── tsconfig.json                            # Root TypeScript config
└── package.json                             # Root package.json
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS 11.x
- **Database**: PostgreSQL 13+
- **ORM**: Prisma 6.x
- **Authentication**: JWT + Passport
- **Payment Gateway**: Midtrans
- **Logging**: Winston + Daily Rotate File
- **Validation**: Class Validator + Class Transformer

### Frontend Web
- **Framework**: SvelteKit 2.x
- **Language**: TypeScript 5.x
- **Styling**: CSS3 dengan modern design
- **Icons**: Custom icon system
- **State Management**: Svelte stores

### Mobile
- **Framework**: React Native 0.81.x
- **Language**: TypeScript 5.x
- **Navigation**: React Navigation 7.x
- **UI Components**: Expo + Lucide Icons
- **Maps**: React Native Maps
- **Video**: React Native Video

### Development Tools
- **Monorepo**: Turborepo 2.x
- **Package Manager**: pnpm 8.x
- **Build Tool**: Vite (Web), Metro (Mobile)
- **Type System**: TypeScript

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 20.0.0 atau lebih tinggi (18+ untuk backend, 20+ untuk mobile)
- **pnpm**: 8.0.0 atau lebih tinggi
- **PostgreSQL**: 13+ dengan database `ektm_ubsi`
- **Git**: untuk cloning repository

**Untuk Mobile Development:**
- **Android**: Android Studio + JDK 17
- **iOS**: Xcode (macOS only)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Sultonisky/ektm-project-monorepo.git
cd monorepo-ektm
```

### 2️⃣ Install Dependencies

Instal semua dependencies untuk root dan semua workspaces:

```bash
pnpm install
```

### 3️⃣ Setup Environment Variables

**Backend** (`apps/backend/nestjs/.env`):
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ektm_ubsi"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Midtrans
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
MIDTRANS_IS_PRODUCTION=false
```

**Admin Dashboard** (`apps/admin/sveltekit/.env`):
```env
PUBLIC_API_BASE_URL=http://localhost:3000
```

**Mobile App** (`apps/mobile/react/.env`):
```env
API_BASE_URL=http://localhost:3000
```

### 4️⃣ Setup Database

```bash
# Pindah ke directory backend
cd apps/backend/nestjs

# Generate Prisma Client
pnpm run db:generate

# Run migrations
pnpm run db:migrate

# Seed database (optional)
pnpm run prisma:seed
```

### 5️⃣ Start Development Server

**Menggunakan Turborepo (Recommended):**
```bash
# Dari root directory
pnpm run dev
```

Perintah ini akan menjalankan semua apps secara bersamaan.

**Atau jalankan secara terpisah:**

**Backend:**
```bash
cd apps/backend/nestjs
pnpm run dev
```

**Admin Dashboard:**
```bash
cd apps/admin/sveltekit
pnpm run dev
```

**Mobile App:**
```bash
# Terminal 1: Start Metro bundler
cd apps/mobile/react
pnpm start

# Terminal 2: Run on Android
pnpm android

# Terminal 2: Run on iOS (macOS only)
pnpm ios
```

### 6️⃣ Akses Aplikasi

- **Backend API**: http://localhost:3000
- **Admin Dashboard**: http://localhost:5173
- **Mobile App**: Android Emulator / iOS Simulator / Physical Device
- **API Documentation**: http://localhost:3000/api (jika Swagger diaktifkan)
- **Prisma Studio**: Jalankan `pnpm run db:studio` dari directory backend

---

## 📚 Monorepo Commands

### Scripts Root

Dari root directory, Anda dapat menjalankan:

```bash
# Development
pnpm run dev                  # Jalankan semua apps dalam mode development

# Build
pnpm run build               # Build semua apps

# Database
pnpm run db:generate         # Generate Prisma Client
pnpm run db:push             # Push schema ke database
pnpm run db:migrate          # Run migrations

# Lint & Check
pnpm run lint                # Lint semua packages
pnpm run check               # Type check semua packages

# Clean
pnpm run clean               # Clean build artifacts
```

### Target Specific Packages

```bash
# Hanya backend
pnpm run dev --filter=@monorepo-ektm/backend

# Hanya admin dashboard
pnpm run dev --filter=@monorepo-ektm/admin-dashboard

# Hanya mobile app (Metro bundler)
pnpm run dev --filter=@monorepo-ektm/mobile

# Backend + dependents
pnpm run build --filter=@monorepo-ektm/backend...
```

---

## 🗃️ Database Schema

### Core Models
- **Users**: Admin dan user management
- **Mahasiswa**: Data mahasiswa dengan NIM, kelas, semester
- **Campus**: Data kampus UBSI
- **Fakultas**: Fakultas-fakultas di setiap kampus
- **Jurusan**: Program studi di setiap fakultas
- **Payment**: Transaksi pembayaran kuliah
- **BiayaDefault**: Template biaya per jurusan dan semester

### Payment Integration
- **Midtrans Integration**: Order ID, Transaction ID, Payment URL
- **Multiple Payment Methods**: Bank Transfer, E-Wallet, Credit Card
- **Payment Status**: Belum/Lunas dengan tracking lengkap

Untuk melihat schema lengkap, buka file `apps/backend/nestjs/prisma/schema.prisma`.

---

## 🔌 API Endpoints

### Authentication
- `POST /auth/login/admin` - Login admin
- `POST /auth/login/mahasiswa` - Login mahasiswa
- `POST /auth/refresh` - Refresh JWT token

### Users Management
- `GET /users` - Get all users
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Mahasiswa Management
- `GET /mahasiswa` - Get all mahasiswa
- `POST /mahasiswa` - Create new mahasiswa
- `PUT /mahasiswa/:id` - Update mahasiswa
- `GET /mahasiswa/:id/payments` - Get mahasiswa payments

### Payment Management
- `GET /payment` - Get all payments
- `POST /payment` - Create new payment
- `PUT /payment/:id` - Update payment status
- `POST /payment/:id/midtrans-callback` - Midtrans callback

### Academic Management
- `GET /campus` - Get all campuses
- `GET /fakultas` - Get all fakultas
- `GET /jurusan` - Get all jurusan
- `GET /biaya` - Get biaya templates

Untuk dokumentasi lengkap, jalankan backend dan akses Swagger UI di `http://localhost:3000/api`.

---

## 🎨 Features

### Admin Dashboard (Web)
- **📊 Statistics Overview**: Total users, mahasiswa, payments, courses
- **👥 User Management**: CRUD operations untuk users dan mahasiswa
- **💰 Payment Management**: Monitoring dan management pembayaran
- **🏛️ Academic Management**: Pengelolaan campus, fakultas, jurusan
- **📈 Recent Activities**: Timeline aktivitas terbaru
- **🔍 Search & Filter**: Advanced search dan filtering

### Mobile App
- **👤 Profile Management**: Kelola profil mahasiswa
- **💰 Payment History**: Riwayat pembayaran kuliah
- **📱 QR Code**: Generate dan scan QR code untuk pembayaran
- **📍 Location Services**: GPS integration untuk verifikasi lokasi
- **🎥 Video Features**: Video support untuk konten edukatif
- **📊 Dashboard**: Dashboard mahasiswa dengan statistik pembayaran

### Responsive Design
- **📱 Mobile-First**: Optimized untuk mobile devices
- **💻 Desktop**: Full-featured desktop experience
- **🎨 Modern UI**: Clean dan intuitive interface
- **⚡ Fast Loading**: Optimized performance

---

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt untuk password security
- **Role-Based Access**: Admin dan Mahasiswa roles
- **Input Validation**: Comprehensive input validation
- **SQL Injection Protection**: Prisma ORM protection
- **CORS Configuration**: Proper CORS setup

---

## 📝 Logging & Monitoring

- **Winston Logger**: Comprehensive logging system
- **Daily Rotate Files**: Automatic log rotation
- **Error Tracking**: Detailed error logging
- **Request Logging**: API request/response logging
- **Performance Monitoring**: Response time tracking

---

## 📱 Mobile Development

### Setup untuk Windows (Android)

**1. Install Java Development Kit (JDK 17)**
- Download dari [Oracle JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) atau [Microsoft OpenJDK 17](https://learn.microsoft.com/en-us/java/openjdk/download#openjdk-17)
- Set environment variable `JAVA_HOME`
- Edit `PATH` untuk include `%JAVA_HOME%\bin`

**2. Install Android Studio**
- Download [Android Studio](https://developer.android.com/studio)
- Install Android SDK Platform 33, Build-Tools, dan Platform-Tools
- Set environment variable `ANDROID_HOME`
- Edit `PATH` untuk include platform-tools

**3. Verifikasi Setup**
```bash
cd apps/mobile/react
npx react-native doctor
```

Lihat dokumentasi lengkap di [`apps/mobile/README.md`](apps/mobile/README.md)

---

## 🧪 Testing

```bash
# Backend tests
cd apps/backend/nestjs
pnpm run test              # Unit tests
pnpm run test:watch        # Watch mode
pnpm run test:cov          # Coverage
pnpm run test:e2e          # E2E tests

# Mobile tests
cd apps/mobile/react
pnpm run test              # Jest unit tests
```

---

## 🚀 Production Deployment

### Build untuk Production

```bash
# Build semua apps
pnpm run build

# Atau build individual
cd apps/backend/nestjs
pnpm run build

cd apps/admin/sveltekit
pnpm run build

cd apps/mobile/react
pnpm run build  # Build native apps
```

### Environment Variables Production

Pastikan environment variables sudah dikonfigurasi dengan nilai production:
- `MIDTRANS_IS_PRODUCTION=true`
- Database connection string production
- JWT secret yang kuat

### Deploy Backend

```bash
cd apps/backend/nestjs
pnpm run build
pnpm run start:prod
```

### Deploy Admin Dashboard

Build artifact ada di `apps/admin/sveltekit/build/`. Deploy ke platform seperti Vercel, Netlify, atau server Anda sendiri.

### Build Mobile Apps

**Android:**
```bash
cd apps/mobile/react
pnpm run android  # Development build
# Untuk release: cd android && ./gradlew assembleRelease
```

**iOS:**
```bash
cd apps/mobile/react
pnpm run ios  # Development build
# Untuk release: configure di Xcode dan archive
```

---

## 📦 Packages

### `@monorepo-ektm/database`
Re-export dari Prisma Client untuk digunakan di semua apps.

```typescript
import { PrismaClient } from '@monorepo-ektm/database';
```

### `@monorepo-ektm/types`
Shared TypeScript types dan interfaces.

```typescript
import { User, Payment } from '@monorepo-ektm/types';
```

### `@monorepo-ektm/utils`
Shared utility functions.

```typescript
import { formatCurrency, validateEmail } from '@monorepo-ektm/utils';
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Convention
Kami menggunakan Conventional Commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build process or auxiliary tool changes

---

## 👥 Team

- **Project Manager**: [Nihat Hasananto](https://instagram.com/nh4t_n4n)
- **Frontend Developer**: [Rizky Erlangga](https://github.com/rzkyerl)
- **Backend Developer**: [Moh Sultoni](https://github.com/Sultonisky)
- **UI/UX Designer**: [Raihan Nafis](https://instagram.com/rhnnfss)
- **Sistem Analyst**: [Rafi Akbar](https://instagram.com/rafiakbrr._)
- **QA/Tester**: [Rifqi Hisyam](https://instagram.com/rfqhsyamm)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

- 📧 Email: support@ektm-ubsi.com
- 💬 Discord: [Join our Discord](https://discord.gg/your-discord)
- 📖 Documentation: [Wiki](https://github.com/Sultonisky/ektm-project-monorepo/wiki)
- 🐛 Issues: [GitHub Issues](https://github.com/Sultonisky/ektm-project-monorepo/issues)

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [SvelteKit](https://kit.svelte.dev/) - The fastest way to build Svelte apps
- [React Native](https://reactnative.dev/) - Cross-platform mobile app framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Turborepo](https://turbo.build/) - High-performance build system
- [Midtrans](https://midtrans.com/) - Payment gateway solution
- [UBSI](https://ubsi.ac.id/) - Universitas Bina Sarana Informatika

---

<div align="center">
  <p><strong>Monorepo EKTM UBSI</strong></p>
  <p>© 2025 <b>Projek Membangun Negeri</b> - Made with passion using Turborepo</p>
</div>
