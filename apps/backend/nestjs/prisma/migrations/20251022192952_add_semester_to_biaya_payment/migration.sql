/*
  Warnings:

  - A unique constraint covering the columns `[jurusan_id,semester]` on the table `biaya_defaults` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."biaya_defaults_jurusan_id_key";

-- AlterTable
ALTER TABLE "public"."biaya_defaults" ADD COLUMN     "semester" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."mahasiswas" ALTER COLUMN "semester" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."payments" ADD COLUMN     "semester" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "biaya_defaults_jurusan_id_semester_key" ON "public"."biaya_defaults"("jurusan_id", "semester");
