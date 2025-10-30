-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('payment_success', 'payment_error', 'payment_pending');

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" BIGSERIAL NOT NULL,
    "mahasiswa_id" BIGINT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "icon" TEXT DEFAULT 'default',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_mahasiswa_id_idx" ON "public"."notifications"("mahasiswa_id");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "public"."notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "public"."notifications"("created_at");

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "public"."mahasiswas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
