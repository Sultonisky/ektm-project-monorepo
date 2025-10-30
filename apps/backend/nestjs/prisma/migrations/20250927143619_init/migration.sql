-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('bank', 'e_wallet', 'credit_card');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('belum', 'lunas');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('admin', 'mahasiswa');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'admin',
    "remember_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mahasiswas" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nim" INTEGER NOT NULL,
    "kelas" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "fakultas" TEXT NOT NULL,
    "jurusan" TEXT NOT NULL,
    "kampus" TEXT NOT NULL,
    "foto" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mahasiswas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" BIGSERIAL NOT NULL,
    "mahasiswa_id" BIGINT NOT NULL,
    "payment_code" TEXT NOT NULL,
    "biaya_pokok" DECIMAL(12,2),
    "biaya_tambahan_jurusan" DECIMAL(12,2),
    "biaya_praktikum" DECIMAL(12,2),
    "biaya_ujian" DECIMAL(12,2),
    "biaya_kegiatan" DECIMAL(12,2),
    "total_payment" DECIMAL(12,2),
    "payment_method" "public"."PaymentMethod" NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'belum',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."biaya_defaults" (
    "id" BIGSERIAL NOT NULL,
    "jurusan" TEXT NOT NULL,
    "biaya_pokok" DECIMAL(12,2),
    "biaya_tambahan_jurusan" DECIMAL(12,2),
    "biaya_praktikum" DECIMAL(12,2),
    "biaya_ujian" DECIMAL(12,2),
    "biaya_kegiatan" DECIMAL(12,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "biaya_defaults_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswas_email_key" ON "public"."mahasiswas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswas_nim_key" ON "public"."mahasiswas"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "payments_payment_code_key" ON "public"."payments"("payment_code");

-- CreateIndex
CREATE INDEX "payments_mahasiswa_id_idx" ON "public"."payments"("mahasiswa_id");

-- CreateIndex
CREATE UNIQUE INDEX "biaya_defaults_jurusan_key" ON "public"."biaya_defaults"("jurusan");

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "public"."mahasiswas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
