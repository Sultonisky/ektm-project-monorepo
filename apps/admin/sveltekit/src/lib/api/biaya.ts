import { PUBLIC_API_BASE_URL } from '$env/static/public';

// Biaya interfaces
export interface Biaya {
  id: string;
  jurusanId: string;
  semester: number;
  biayaPokok?: number;
  biayaTambahanJurusan?: number;
  biayaPraktikum?: number;
  biayaUjian?: number;
  biayaKegiatan?: number;
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateBiayaData {
  jurusanId: string;
  semester?: number;
  biayaPokok?: number;
  biayaTambahanJurusan?: number;
  biayaPraktikum?: number;
  biayaUjian?: number;
  biayaKegiatan?: number;
}

export interface UpdateBiayaData {
  biayaPokok?: number;
  biayaTambahanJurusan?: number;
  biayaPraktikum?: number;
  biayaUjian?: number;
  biayaKegiatan?: number;
}

// Biaya API
class BiayaAPI {
  private baseUrl = PUBLIC_API_BASE_URL;

  async getAll(jurusanId?: string): Promise<Biaya[]> {
    const url = jurusanId ? `${this.baseUrl}/biaya?jurusanId=${jurusanId}` : `${this.baseUrl}/biaya`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch biaya defaults');
    }
    return response.json();
  }

  async getById(id: string): Promise<Biaya> {
    const response = await fetch(`${this.baseUrl}/biaya/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch biaya default');
    }
    return response.json();
  }

  async getByJurusan(jurusanId: string): Promise<Biaya | null> {
    const response = await fetch(`${this.baseUrl}/biaya?jurusanId=${jurusanId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch biaya default for jurusan');
    }
    const data = await response.json();
    return Array.isArray(data) ? data[0] || null : data;
  }

  async create(data: CreateBiayaData): Promise<Biaya> {
    const response = await fetch(`${this.baseUrl}/biaya`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create biaya default');
    }

    return response.json();
  }

  async update(id: string, data: UpdateBiayaData): Promise<Biaya> {
    const response = await fetch(`${this.baseUrl}/biaya/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update biaya default');
    }

    return response.json();
  }

  async remove(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/biaya/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete biaya default');
    }
  }

  // Helper method to format currency
  formatCurrency(amount: number | undefined): string {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  // Helper method to calculate total biaya
  calculateTotal(biaya: Biaya): number {
    return (
      (biaya.biayaPokok || 0) +
      (biaya.biayaTambahanJurusan || 0) +
      (biaya.biayaPraktikum || 0) +
      (biaya.biayaUjian || 0) +
      (biaya.biayaKegiatan || 0)
    );
  }
}

export const biayaAPI = new BiayaAPI();
export type { BiayaAPI };
