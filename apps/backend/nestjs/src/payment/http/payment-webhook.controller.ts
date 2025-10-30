import { Controller, Post, Body, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentService } from '../core/payment.service';
import { MidtransService } from '../core/midtrans.service';

@Controller('payment/webhook')
export class PaymentWebhookController {
  private readonly logger = new Logger(PaymentWebhookController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly midtransService: MidtransService,
  ) {}

  @Post('midtrans')
  @HttpCode(HttpStatus.OK)
  async handleMidtransNotification(@Body() notification: any): Promise<{ status: string }> {
    try {
      this.logger.log(`Received Midtrans notification: ${JSON.stringify(notification)}`);

      // Verify the notification
      const isValid = this.midtransService.verifyNotification(notification);
      if (!isValid) {
        this.logger.warn('Invalid Midtrans notification signature');
        return { status: 'invalid' };
      }

      const { order_id, transaction_status, transaction_id } = notification;

      // Find payment by Midtrans order ID
      const payment = await this.paymentService.findByMidtransOrderId(order_id);
      if (!payment) {
        this.logger.warn(`Payment not found for order ID: ${order_id}`);
        return { status: 'payment_not_found' };
      }

      // Update payment status based on Midtrans status
      const newStatus = this.mapMidtransStatusToPaymentStatus(transaction_status);
      
      await this.paymentService.updatePaymentStatus(payment.id, newStatus, {
        midtransTransactionId: transaction_id,
        midtransStatus: transaction_status,
      });

      this.logger.log(`Payment ${payment.id} status updated to: ${newStatus}`);
      
      return { status: 'success' };

    } catch (error) {
      this.logger.error(`Error processing Midtrans notification: ${error.message}`);
      return { status: 'error' };
    }
  }

  private mapMidtransStatusToPaymentStatus(midtransStatus: string): string {
    switch (midtransStatus) {
      case 'settlement':
      case 'capture':
        return 'lunas';
      case 'pending':
      case 'deny':
      case 'cancel':
      case 'expire':
      case 'failure':
        return 'belum';
      default:
        return 'belum';
    }
  }
}
