/*
  Warnings:

  - Added the required column `semester` to the `mahasiswas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."mahasiswas" ADD COLUMN     "semester" INTEGER NOT NULL;
