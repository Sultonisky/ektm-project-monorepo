import { PUBLIC_API_BASE_URL } from '$env/static/public';

// Campus interfaces
export interface Campus {
  id: string;
  name: string;
  address?: string;
  foto?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampusData {
  name: string;
  address?: string;
  foto?: string;
}

export interface UpdateCampusData {
  name?: string;
  address?: string;
  foto?: string;
}

// Fakultas interfaces
export interface Fakultas {
  id: string;
  name: string;
  campusId: string;
  campus: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateFakultasData {
  name: string;
  campusId: string;
}

export interface UpdateFakultasData {
  name?: string;
  campusId?: string;
}

// Jurusan interfaces
export interface Jurusan {
  id: string;
  name: string;
  fakultasId: string;
  fakultas: {
    id: string;
    name: string;
    campus: {
      id: string;
      name: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateJurusanData {
  name: string;
  fakultasId: string;
}

export interface UpdateJurusanData {
  name?: string;
  fakultasId?: string;
}

// Campus API
class CampusAPI {
  private baseUrl = PUBLIC_API_BASE_URL;

  async getAll(): Promise<Campus[]> {
    const response = await fetch(`${this.baseUrl}/campus`);
    if (!response.ok) {
      throw new Error('Failed to fetch campuses');
    }
    return response.json();
  }

  async getById(id: string): Promise<Campus> {
    const response = await fetch(`${this.baseUrl}/campus/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch campus');
    }
    return response.json();
  }

  async create(data: CreateCampusData): Promise<Campus> {
    const response = await fetch(`${this.baseUrl}/campus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create campus');
    }

    return response.json();
  }

  async update(id: string, data: UpdateCampusData): Promise<Campus> {
    const response = await fetch(`${this.baseUrl}/campus/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update campus');
    }

    return response.json();
  }

  async remove(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/campus/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete campus');
    }
  }
}

// Fakultas API
class FakultasAPI {
  private baseUrl = PUBLIC_API_BASE_URL;

  async getAll(campusId?: string): Promise<Fakultas[]> {
    const url = campusId ? `${this.baseUrl}/fakultas?campusId=${campusId}` : `${this.baseUrl}/fakultas`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch fakultas');
    }
    return response.json();
  }

  async getById(id: string): Promise<Fakultas> {
    const response = await fetch(`${this.baseUrl}/fakultas/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch fakultas');
    }
    return response.json();
  }

  async create(data: CreateFakultasData): Promise<Fakultas> {
    const response = await fetch(`${this.baseUrl}/fakultas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create fakultas');
    }

    return response.json();
  }

  async update(id: string, data: UpdateFakultasData): Promise<Fakultas> {
    const response = await fetch(`${this.baseUrl}/fakultas/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update fakultas');
    }

    return response.json();
  }

  async remove(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/fakultas/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete fakultas');
    }
  }
}

// Jurusan API
class JurusanAPI {
  private baseUrl = PUBLIC_API_BASE_URL;

  async getAll(fakultasId?: string): Promise<Jurusan[]> {
    const url = fakultasId ? `${this.baseUrl}/jurusan?fakultasId=${fakultasId}` : `${this.baseUrl}/jurusan`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch jurusan');
    }
    return response.json();
  }

  async getById(id: string): Promise<Jurusan> {
    const response = await fetch(`${this.baseUrl}/jurusan/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch jurusan');
    }
    return response.json();
  }

  async create(data: CreateJurusanData): Promise<Jurusan> {
    const response = await fetch(`${this.baseUrl}/jurusan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create jurusan');
    }

    return response.json();
  }

  async update(id: string, data: UpdateJurusanData): Promise<Jurusan> {
    const response = await fetch(`${this.baseUrl}/jurusan/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update jurusan');
    }

    return response.json();
  }

  async remove(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/jurusan/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete jurusan');
    }
  }
}

export const campusAPI = new CampusAPI();
export const fakultasAPI = new FakultasAPI();
export const jurusanAPI = new JurusanAPI();

export type { CampusAPI, FakultasAPI, JurusanAPI };
