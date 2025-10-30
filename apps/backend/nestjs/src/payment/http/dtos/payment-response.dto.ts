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
  
  // Midtrans fields
  midtransOrderId?: string;
  midtransTransactionId?: string;
  midtransPaymentUrl?: string;
  midtransVaNumber?: string;
  midtransBillKey?: string;
  midtransBillerCode?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

