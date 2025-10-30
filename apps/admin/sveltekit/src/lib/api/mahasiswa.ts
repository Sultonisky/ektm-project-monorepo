import { PUBLIC_API_BASE_URL } from '$env/static/public';

export interface Mahasiswa {
  id: string;
  name: string;
  email: string;
  nim: number;
  kelas: string;
  phone: string;
  semester: number;
  jurusanId: string;
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
  foto?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMahasiswaData {
  name: string;
  email: string;
  password: string;
  nim: number;
  kelas: string;
  phone: string;
  semester: number;
  jurusanId: string;
  foto?: string;
}

export interface UpdateMahasiswaData {
  name?: string;
  email?: string;
  password?: string;
  nim?: number;
  kelas?: string;
  phone?: string;
  semester?: number;
  jurusanId?: string;
  foto?: string | null;
}

class MahasiswaAPI {
  private baseUrl = PUBLIC_API_BASE_URL;

  async getAll(): Promise<Mahasiswa[]> {
    const response = await fetch(`${this.baseUrl}/mahasiswa`);
    if (!response.ok) {
      throw new Error('Failed to fetch mahasiswa');
    }
    return response.json();
  }

  async getById(id: string): Promise<Mahasiswa> {
    const response = await fetch(`${this.baseUrl}/mahasiswa/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch mahasiswa');
    }
    return response.json();
  }

  async create(data: CreateMahasiswaData): Promise<Mahasiswa> {
    const response = await fetch(`${this.baseUrl}/mahasiswa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create mahasiswa');
    }

    return response.json();
  }

  async update(id: string, data: UpdateMahasiswaData): Promise<Mahasiswa> {
    const response = await fetch(`${this.baseUrl}/mahasiswa/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update mahasiswa');
    }

    return response.json();
  }

  async remove(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/mahasiswa/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete mahasiswa');
    }
  }

  async getMahasiswaCount(): Promise<number> {
    const mahasiswa = await this.getAll();
    return mahasiswa.length;
  }
}

export const mahasiswaAPI = new MahasiswaAPI();
export type { MahasiswaAPI };

