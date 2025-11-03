import type { NavigationProp } from '@react-navigation/native';
import type { BankKey } from '../constants/bank';

export type PaymentDetail = { label: string; value: string };

export type StartPaymentArgs = {
  invoiceId?: string;
  bankKey: BankKey;
  nama: string;
  nim: string;
  rincian: PaymentDetail[];
  total: string;
};

export function startPayment(navigation: NavigationProp<Record<string, object | undefined>>, args: StartPaymentArgs) {
  const generatedInvoice = `INV-${Date.now()}`;
  const targetInvoice = args.invoiceId || generatedInvoice;

  (navigation as any).navigate('MenungguPembayaran', {
    invoiceId: targetInvoice,
    bankKey: args.bankKey,
    nama: args.nama,
    nim: args.nim,
    rincian: args.rincian,
    total: args.total,
  });
}

export function goHome(navigation: NavigationProp<Record<string, object | undefined>>) {
  (navigation as any).navigate('Main', { initialTab: 'ektm' });
}


