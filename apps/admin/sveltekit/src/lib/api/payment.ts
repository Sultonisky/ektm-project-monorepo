import { PUBLIC_API_BASE_URL } from '$env/static/public';

export interface Payment {
  id: string;
  mahasiswaId: string;
  paymentCode: string;
  biayaPokok?: string;
  biayaTambahanJurusan?: string;
  biayaPraktikum?: string;
  biayaUjian?: string;
  biayaKegiatan?: string;
  totalPayment?: string;
  paymentMethod: 'bank' | 'e_wallet' | 'credit_card';
  status: 'belum' | 'lunas';
  midtransOrderId?: string;
  midtransTransactionId?: string;
  midtransPaymentUrl?: string;
  midtransVaNumber?: string;
  midtransBillKey?: string;
  midtransBillerCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  mahasiswaId: string;
  paymentCode: string;
  biayaPokok?: string;
  biayaTambahanJurusan?: string;
  biayaPraktikum?: string;
  biayaUjian?: string;
  biayaKegiatan?: string;
  paymentMethod: 'bank' | 'e_wallet' | 'credit_card';
}

export interface UpdatePaymentRequest {
  paymentCode?: string;
  biayaPokok?: string;
  biayaTambahanJurusan?: string;
  biayaPraktikum?: string;
  biayaUjian?: string;
  biayaKegiatan?: string;
  paymentMethod?: 'bank' | 'e_wallet' | 'credit_card';
  status?: 'belum' | 'lunas';
}

export interface PaymentFilters {
  mahasiswaId?: string;
  status?: string;
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
  private baseUrl = `${PUBLIC_API_BASE_URL}/payment`;

  async getAllPayments(filters?: PaymentFilters): Promise<Payment[]> {
    const params = new URLSearchParams();
    if (filters?.mahasiswaId) params.append('mahasiswaId', filters.mahasiswaId);
    if (filters?.status) params.append('status', filters.status);

    const url = params.toString() ? `${this.baseUrl}?${params}` : this.baseUrl;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payments: ${response.statusText}`);
    }

    return response.json();
  }

  async getPaymentById(id: string): Promise<Payment> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payment: ${response.statusText}`);
    }

    return response.json();
  }

  async createPayment(payment: CreatePaymentRequest): Promise<Payment> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payment),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to create payment: ${response.statusText}`);
    }

    return response.json();
  }

  async createPaymentWithMidtrans(payment: CreatePaymentRequest): Promise<Payment> {
    const response = await fetch(`${this.baseUrl}/midtrans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payment),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to create payment with Midtrans: ${response.statusText}`);
    }

    return response.json();
  }

  async updatePayment(id: string, payment: UpdatePaymentRequest): Promise<Payment> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payment),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to update payment: ${response.statusText}`);
    }

    return response.json();
  }

  async deletePayment(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete payment: ${response.statusText}`);
    }
  }

  async getBiayaDefaultByMahasiswa(mahasiswaId: string, semester?: number): Promise<BiayaDefaultResponse> {
    const url = semester 
      ? `${this.baseUrl}/biaya-default/${mahasiswaId}?semester=${semester}`
      : `${this.baseUrl}/biaya-default/${mahasiswaId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to get biaya default: ${response.statusText}`);
    }

    return response.json();
  }

  formatCurrency(amount: string | number): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numAmount);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'lunas':
        return 'bg-green-100 text-green-800';
      case 'belum':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPaymentMethodLabel(method: string): string {
    switch (method) {
      case 'bank':
        return 'Bank Transfer';
      case 'e_wallet':
        return 'E-Wallet';
      case 'credit_card':
        return 'Credit Card';
      default:
        return method;
    }
  }
}

export const paymentService = new PaymentService();
