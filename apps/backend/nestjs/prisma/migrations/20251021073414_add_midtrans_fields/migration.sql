-- AlterTable
ALTER TABLE "public"."payments" ADD COLUMN     "midtrans_bill_key" TEXT,
ADD COLUMN     "midtrans_biller_code" TEXT,
ADD COLUMN     "midtrans_order_id" TEXT,
ADD COLUMN     "midtrans_payment_url" TEXT,
ADD COLUMN     "midtrans_transaction_id" TEXT,
ADD COLUMN     "midtrans_va_number" TEXT;

-- CreateIndex
CREATE INDEX "payments_midtrans_order_id_idx" ON "public"."payments"("midtrans_order_id");
