/*
  Warnings:

  - You are about to drop the column `jurusan` on the `biaya_defaults` table. All the data in the column will be lost.
  - You are about to drop the column `fakultas` on the `mahasiswas` table. All the data in the column will be lost.
  - You are about to drop the column `jurusan` on the `mahasiswas` table. All the data in the column will be lost.
  - You are about to drop the column `kampus` on the `mahasiswas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jurusan_id]` on the table `biaya_defaults` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jurusan_id` to the `biaya_defaults` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jurusan_id` to the `mahasiswas` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."biaya_defaults_jurusan_key";

-- AlterTable
ALTER TABLE "public"."biaya_defaults" DROP COLUMN "jurusan",
ADD COLUMN     "jurusan_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "public"."mahasiswas" DROP COLUMN "fakultas",
DROP COLUMN "jurusan",
DROP COLUMN "kampus",
ADD COLUMN     "jurusan_id" BIGINT NOT NULL;

-- CreateTable
CREATE TABLE "public"."campuses" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fakultas" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "campus_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fakultas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."jurusan" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fakultas_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jurusan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "campuses_name_key" ON "public"."campuses"("name");

-- CreateIndex
CREATE INDEX "fakultas_campus_id_idx" ON "public"."fakultas"("campus_id");

-- CreateIndex
CREATE INDEX "jurusan_fakultas_id_idx" ON "public"."jurusan"("fakultas_id");

-- CreateIndex
CREATE UNIQUE INDEX "biaya_defaults_jurusan_id_key" ON "public"."biaya_defaults"("jurusan_id");

-- CreateIndex
CREATE INDEX "mahasiswas_jurusan_id_idx" ON "public"."mahasiswas"("jurusan_id");

-- AddForeignKey
ALTER TABLE "public"."mahasiswas" ADD CONSTRAINT "mahasiswas_jurusan_id_fkey" FOREIGN KEY ("jurusan_id") REFERENCES "public"."jurusan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fakultas" ADD CONSTRAINT "fakultas_campus_id_fkey" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jurusan" ADD CONSTRAINT "jurusan_fakultas_id_fkey" FOREIGN KEY ("fakultas_id") REFERENCES "public"."fakultas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."biaya_defaults" ADD CONSTRAINT "biaya_defaults_jurusan_id_fkey" FOREIGN KEY ("jurusan_id") REFERENCES "public"."jurusan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
