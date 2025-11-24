import api from './config';

export interface BiayaResponse {
  id: string;
  jurusanId: string;
  nama: string;
  jumlah: number;
  semester: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBiayaRequest {
  jurusanId: string;
  nama: string;
  jumlah: number;
  semester: number;
}

class BiayaService {
  /**
   * Buat biaya baru
   */
  async createBiaya(data: CreateBiayaRequest): Promise<BiayaResponse> {
    try {
      const response = await api.post<BiayaResponse>('/biaya', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal membuat biaya. Silakan coba lagi.'
      );
    }
  }

  /**
   * Get semua biaya
   */
  async getAllBiaya(jurusanId?: string): Promise<BiayaResponse[]> {
    try {
      const params = jurusanId ? { jurusanId } : {};
      const response = await api.get<BiayaResponse[]>('/biaya', { params });
      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil data biaya. Silakan coba lagi.'
      );
    }
  }

  /**
   * Get biaya by ID
   */
  async getBiayaById(id: string): Promise<BiayaResponse> {
    try {
      const response = await api.get<BiayaResponse>(`/biaya/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil data biaya. Silakan coba lagi.'
      );
    }
  }

  /**
   * Update biaya
   */
  async updateBiaya(id: string, data: Partial<CreateBiayaRequest>): Promise<BiayaResponse> {
    try {
      const response = await api.patch<BiayaResponse>(`/biaya/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal update biaya. Silakan coba lagi.'
      );
    }
  }

  /**
   * Delete biaya
   */
  async deleteBiaya(id: string): Promise<void> {
    try {
      await api.delete(`/biaya/${id}`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal menghapus biaya. Silakan coba lagi.'
      );
    }
  }
}

export const biayaService = new BiayaService();
export default biayaService;

