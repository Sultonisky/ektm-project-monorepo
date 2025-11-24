import api from './config';

export interface PaymentResponse {
  id: string;
  mahasiswaId: string;
  paymentCode?: string;
  biayaId?: string;
  biayaPokok?: string | null;
  biayaTambahanJurusan?: string | null;
  biayaPraktikum?: string | null;
  biayaUjian?: string | null;
  biayaKegiatan?: string | null;
  totalPayment?: string | null;
  status: string;
  paymentMethod?: string;
  transactionId?: string;
  midtransOrderId?: string | null;
  midtransTransactionId?: string | null;
  midtransTransactionStatus?: string | null;
  midtransPaymentType?: string | null;
  midtransPaymentUrl?: string | null;
  midtransVaNumber?: string | null;
  midtransVaBank?: string | null;
  midtransBillKey?: string | null;
  midtransBillerCode?: string | null;
  midtransActions?: Array<{
    name: string;
    method: string;
    url: string;
  }> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  mahasiswaId: string;
  biayaId?: string;
  amount?: number;
  biayaPokok?: string;
  biayaTambahanJurusan?: string;
  biayaPraktikum?: string;
  biayaUjian?: string;
  biayaKegiatan?: string;
  paymentMethod?: string;
}

export interface BiayaDefaultResponse {
  mahasiswa: {
    id: string;
    name: string;
    nim: number;
    jurusan: {
      id: string;
      name: string;
      fakultas: {
        id: string;
        name: string;
        campus: {
          id: string;
          name: string;
        };
      };
    };
  };
  biayaDefault: {
    id: string;
    semester: number;
    biayaPokok: number;
    biayaTambahanJurusan: number;
    biayaPraktikum: number;
    biayaUjian: number;
    biayaKegiatan: number;
    total: number;
  } | null;
  message?: string;
}

class PaymentService {
  /**
   * Buat payment baru
   */
  async createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await api.post<PaymentResponse>('/payment', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal membuat payment. Silakan coba lagi.'
      );
    }
  }

  /**
   * Buat payment dengan Midtrans
   */
  async createPaymentWithMidtrans(data: CreatePaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await api.post<PaymentResponse>('/payment/midtrans', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal membuat payment. Silakan coba lagi.'
      );
    }
  }

  /**
   * Get biaya default untuk mahasiswa
   */
  async getBiayaDefault(mahasiswaId: string, semester?: number): Promise<BiayaDefaultResponse> {
    try {
      const params = semester ? { semester: semester.toString() } : {};
      const response = await api.get<BiayaDefaultResponse>(`/payment/biaya-default/${mahasiswaId}`, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil data biaya. Silakan coba lagi.'
      );
    }
  }

  /**
   * Get semua payment
   */
  async getAllPayments(mahasiswaId?: string, status?: string): Promise<PaymentResponse[]> {
    try {
      const params: Record<string, string> = {};
      if (mahasiswaId) params.mahasiswaId = mahasiswaId;
      if (status) params.status = status;

      const response = await api.get<PaymentResponse[]>('/payment', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil data payment. Silakan coba lagi.'
      );
    }
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(id: string): Promise<PaymentResponse> {
    try {
      const response = await api.get<PaymentResponse>(`/payment/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil data payment. Silakan coba lagi.'
      );
    }
  }

  /**
   * Update payment
   */
  async updatePayment(id: string, data: Partial<CreatePaymentRequest>): Promise<PaymentResponse> {
    try {
      const response = await api.patch<PaymentResponse>(`/payment/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal update payment. Silakan coba lagi.'
      );
    }
  }

  /**
   * Delete payment
   */
  async deletePayment(id: string): Promise<void> {
    try {
      await api.delete(`/payment/${id}`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal menghapus payment. Silakan coba lagi.'
      );
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;

