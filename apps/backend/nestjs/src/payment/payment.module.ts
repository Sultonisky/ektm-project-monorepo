import { Module } from '@nestjs/common';
import { PaymentService } from './core/payment.service';
import { PaymentController } from './http/payment.controller';
import { PaymentWebhookController } from './http/payment-webhook.controller';
import { MidtransService } from './core/midtrans.service';
import { NotifikasiModule } from '../notifikasi/notifikasi.module';

@Module({
  imports: [NotifikasiModule],
  providers: [PaymentService, MidtransService],
  controllers: [PaymentController, PaymentWebhookController],
  exports: [PaymentService, MidtransService],
})
export class PaymentModule {}
