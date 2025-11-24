import api from './config';

export interface NotifikasiResponse {
  id: string;
  mahasiswaId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotifikasiStats {
  total: number;
  unread: number;
  read: number;
}

export interface CreateNotifikasiRequest {
  mahasiswaId: string;
  title: string;
  message: string;
}

class NotifikasiService {
  /**
   * Buat notifikasi baru
   */
  async createNotifikasi(data: CreateNotifikasiRequest): Promise<NotifikasiResponse> {
    try {
      const response = await api.post<NotifikasiResponse>('/notifikasi', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal membuat notifikasi. Silakan coba lagi.'
      );
    }
  }

  /**
   * Get semua notifikasi untuk mahasiswa
   */
  async getAllNotifikasi(mahasiswaId?: string, filter?: 'all' | 'unread'): Promise<NotifikasiResponse[]> {
    try {
      const params: any = {};
      if (mahasiswaId) params.mahasiswaId = mahasiswaId;
      if (filter) params.filter = filter;

      const response = await api.get<NotifikasiResponse[]>('/notifikasi', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil data notifikasi. Silakan coba lagi.'
      );
    }
  }

  /**
   * Get notifikasi untuk user yang sedang login (butuh token)
   */
  async getMyNotifikasi(filter?: 'all' | 'unread'): Promise<NotifikasiResponse[]> {
    try {
      const params = filter ? { filter } : {};
      const response = await api.get<NotifikasiResponse[]>('/notifikasi/me', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil data notifikasi. Silakan coba lagi.'
      );
    }
  }

  /**
   * Get stats notifikasi
   */
  async getNotifikasiStats(mahasiswaId?: string): Promise<NotifikasiStats> {
    try {
      const params = mahasiswaId ? { mahasiswaId } : {};
      const response = await api.get<NotifikasiStats>('/notifikasi/stats', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil stats notifikasi. Silakan coba lagi.'
      );
    }
  }

  /**
   * Get stats notifikasi untuk user yang sedang login
   */
  async getMyNotifikasiStats(): Promise<NotifikasiStats> {
    try {
      const response = await api.get<NotifikasiStats>('/notifikasi/me/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil stats notifikasi. Silakan coba lagi.'
      );
    }
  }

  /**
   * Get notifikasi by ID
   */
  async getNotifikasiById(id: string): Promise<NotifikasiResponse> {
    try {
      const response = await api.get<NotifikasiResponse>(`/notifikasi/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil data notifikasi. Silakan coba lagi.'
      );
    }
  }

  /**
   * Update notifikasi
   */
  async updateNotifikasi(id: string, data: Partial<CreateNotifikasiRequest>): Promise<NotifikasiResponse> {
    try {
      const response = await api.patch<NotifikasiResponse>(`/notifikasi/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal update notifikasi. Silakan coba lagi.'
      );
    }
  }

  /**
   * Mark notifikasi as read
   */
  async markAsRead(id: string): Promise<NotifikasiResponse> {
    try {
      const response = await api.patch<NotifikasiResponse>(`/notifikasi/${id}/read`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal menandai notifikasi sebagai sudah dibaca. Silakan coba lagi.'
      );
    }
  }

  /**
   * Mark all notifikasi as read
   */
  async markAllAsRead(mahasiswaId: string): Promise<void> {
    try {
      await api.post('/notifikasi/mark-all-read', { mahasiswaId });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal menandai semua notifikasi sebagai sudah dibaca. Silakan coba lagi.'
      );
    }
  }

  /**
   * Mark all my notifikasi as read (untuk user yang sedang login)
   */
  async markAllMyNotifikasiAsRead(): Promise<void> {
    try {
      await api.post('/notifikasi/me/mark-all-read');
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal menandai semua notifikasi sebagai sudah dibaca. Silakan coba lagi.'
      );
    }
  }
}

export const notifikasiService = new NotifikasiService();
export default notifikasiService;

