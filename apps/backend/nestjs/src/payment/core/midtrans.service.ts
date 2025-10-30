import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as midtransClient from 'midtrans-client';

export interface MidtransChargeRequest {
  payment_type: string;
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  customer_details: {
    first_name: string;
    last_name?: string;
    email: string;
    phone: string;
  };
  bank_transfer?: {
    bank: string;
  };
  echannel?: {
    bill_info1: string;
    bill_info2: string;
  };
  credit_card?: {
    secure: boolean;
  };
}

export interface MidtransResponse {
  order_id: string;
  transaction_id: string;
  transaction_status: string;
  transaction_time: string;
  status_code: string;
  status_message: string;
  gross_amount: string;
  payment_type: string;
  actions?: Array<{
    name: string;
    method: string;
    url: string;
  }>;
  va_numbers?: Array<{
    bank: string;
    va_number: string;
  }>;
  bill_key?: string;
  biller_code?: string;
  redirect_url?: string;
}

@Injectable()
export class MidtransService {
  private readonly logger = new Logger(MidtransService.name);
  private coreApi: midtransClient.CoreApi;
  private snap: midtransClient.Snap;

  constructor(private readonly configService: ConfigService) {
    const serverKey = this.configService.get<string>('MIDTRANS_SERVER_KEY');
    const clientKey = this.configService.get<string>('MIDTRANS_CLIENT_KEY');
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    if (!serverKey || !clientKey) {
      throw new Error('Midtrans server key and client key must be configured');
    }

    // Initialize Core API
    this.coreApi = new midtransClient.CoreApi({
      isProduction,
      serverKey,
      clientKey,
    });

    // Initialize Snap
    this.snap = new midtransClient.Snap({
      isProduction,
      serverKey,
      clientKey,
    });

    this.logger.log(`Midtrans initialized - Production: ${isProduction}`);
  }

  async createTransaction(request: MidtransChargeRequest): Promise<MidtransResponse> {
    try {
      this.logger.log(`Creating Midtrans transaction for order: ${request.transaction_details.order_id}`);
      
      const response = await this.coreApi.charge(request);
      
      this.logger.log(`Midtrans transaction created: ${response.transaction_id}`);
      return response as MidtransResponse;
    } catch (error) {
      this.logger.error(`Failed to create Midtrans transaction: ${error.message}`);
      throw error;
    }
  }

  async getTransactionStatus(orderId: string): Promise<MidtransResponse> {
    try {
      this.logger.log(`Getting transaction status for order: ${orderId}`);
      
      const response = await this.coreApi.transaction.status(orderId);
      
      this.logger.log(`Transaction status retrieved: ${response.transaction_status}`);
      return response as MidtransResponse;
    } catch (error) {
      this.logger.error(`Failed to get transaction status: ${error.message}`);
      throw error;
    }
  }

  async cancelTransaction(orderId: string): Promise<MidtransResponse> {
    try {
      this.logger.log(`Cancelling transaction for order: ${orderId}`);
      
      const response = await this.coreApi.transaction.cancel(orderId);
      
      this.logger.log(`Transaction cancelled: ${orderId}`);
      return response as MidtransResponse;
    } catch (error) {
      this.logger.error(`Failed to cancel transaction: ${error.message}`);
      throw error;
    }
  }

  async createSnapTransaction(request: MidtransChargeRequest): Promise<{ token: string; redirect_url: string }> {
    try {
      this.logger.log(`Creating Snap transaction for order: ${request.transaction_details.order_id}`);
      
      const response = await this.snap.createTransaction(request);
      
      this.logger.log(`Snap transaction created with token: ${response.token}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to create Snap transaction: ${error.message}`);
      throw error;
    }
  }

  verifyNotification(notification: any): boolean {
    try {
      return this.coreApi.transaction.notification(notification);
    } catch (error) {
      this.logger.error(`Failed to verify notification: ${error.message}`);
      return false;
    }
  }
}
