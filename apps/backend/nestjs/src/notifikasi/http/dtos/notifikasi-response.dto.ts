export class NotifikasiResponseDto {
  id: string;
  mahasiswaId: string;
  type: 'payment_success' | 'payment_error' | 'payment_pending';
  title: string;
  message: string;
  icon: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class NotifikasiStatsDto {
  total: number;
  unread: number;
}
