import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { setSession, clearSession, getToken, getUser, type AdminUser } from '$lib/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: AdminUser;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  token: string | null;
}

class AuthAPI {
  private baseUrl = PUBLIC_API_BASE_URL;

  async loginAdmin(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login gagal. Cek email dan password');
    }

    const data: LoginResponse = await response.json();
    
    // Set session in localStorage
    setSession(data.access_token, data.user);
    
    return data;
  }

  async loginMahasiswa(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login/mahasiswa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login gagal. Cek email dan password');
    }

    const data: LoginResponse = await response.json();
    
    // Set session in localStorage
    setSession(data.access_token, data.user);
    
    return data;
  }

  logout(): void {
    clearSession();
  }

  getAuthState(): AuthState {
    const token = getToken();
    const user = getUser();
    
    return {
      isAuthenticated: !!token && !!user,
      user,
      token
    };
  }

  isAuthenticated(): boolean {
    return this.getAuthState().isAuthenticated;
  }

  getCurrentUser(): AdminUser | null {
    return this.getAuthState().user;
  }

  getCurrentToken(): string | null {
    return this.getAuthState().token;
  }

  // Method to make authenticated requests
  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getCurrentToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }

  // Method to refresh token (if needed in the future)
  async refreshToken(): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getCurrentToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data: LoginResponse = await response.json();
    setSession(data.access_token, data.user);
    
    return data;
  }

  // Method to validate current token
  async validateToken(): Promise<boolean> {
    try {
      const token = this.getCurrentToken();
      if (!token) return false;

      const response = await fetch(`${this.baseUrl}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}

export const authAPI = new AuthAPI(); 