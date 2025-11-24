import api from './config';

export interface MahasiswaResponse {
  id: string;
  name: string;
  email: string;
  nim: number;
  kelas: string;
  phone: string;
  semester: number;
  jurusanId: string;
  jurusan?: {
    id: string;
    name: string;
    fakultas?: {
      id: string;
      name: string;
      campus?: {
        id: string;
        name: string;
      };
    };
  };
  foto?: string | null;
  createdAt: string;
  updatedAt: string;
}

class MahasiswaService {
  async getMahasiswaById(id: string): Promise<MahasiswaResponse> {
    try {
      const response = await api.get<MahasiswaResponse>(`/mahasiswa/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil data mahasiswa.'
      );
    }
  }

  async getAll(): Promise<MahasiswaResponse[]> {
    try {
      const response = await api.get<MahasiswaResponse[]>('/mahasiswa');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil daftar mahasiswa.'
      );
    }
  }
}

export const mahasiswaService = new MahasiswaService();
export default mahasiswaService;
