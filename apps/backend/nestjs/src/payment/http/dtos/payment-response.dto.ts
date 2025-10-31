export enum PaymentStatusDto {
  belum = 'belum',
  lunas = 'lunas',
}

export enum PaymentMethodDto {
  bank = 'bank',
  e_wallet = 'e_wallet',
  credit_card = 'credit_card',
}

export class PaymentResponseDto {
  id: string; // BigInt string
  mahasiswaId: string;
  paymentCode: string;
  biayaPokok?: string; // decimal as string
  biayaTambahanJurusan?: string;
  biayaPraktikum?: string;
  biayaUjian?: string;
  biayaKegiatan?: string;
  totalPayment?: string;
  paymentMethod: PaymentMethodDto;
  status: PaymentStatusDto;
  
  // Midtrans fields - complete payment information for FE/mobile
  midtransOrderId?: string;
  midtransTransactionId?: string;
  midtransTransactionStatus?: string;
  midtransPaymentType?: string;
  midtransPaymentUrl?: string; // For credit card redirect
  midtransVaNumber?: string;
  midtransVaBank?: string; // Bank name for VA (BCA, BNI, etc)
  midtransBillKey?: string;
  midtransBillerCode?: string;
  midtransActions?: Array<{
    name: string;
    method: string;
    url: string;
  }>;
  
  createdAt: Date;
  updatedAt: Date;
}

