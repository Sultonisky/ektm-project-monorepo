import api from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginMahasiswaRequest {
  nim: number;
  password: string;
}

export interface LoginAdminRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    nim?: number;
    email?: string;
    name: string;
    role: 'mahasiswa' | 'admin';
  };
}

class AuthService {
  /**
   * Login sebagai mahasiswa
   */
  async loginMahasiswa(nim: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login/mahasiswa', {
        nim: parseInt(nim, 10),
        password,
      });

      // Simpan token dan user info
      await AsyncStorage.setItem('access_token', response.data.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Login gagal. Silakan coba lagi.'
      );
    }
  }

  /**
   * Login sebagai admin
   */
  async loginAdmin(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login/admin', {
        email,
        password,
      });

      // Simpan token dan user info
      await AsyncStorage.setItem('access_token', response.data.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Login gagal. Silakan coba lagi.'
      );
    }
  }

  /**
   * Logout - clear token dan user data
   */
  async logout(): Promise<void> {
    await AsyncStorage.multiRemove(['access_token', 'user']);
  }

  /**
   * Cek apakah user sudah login
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('access_token');
    return !!token;
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem('access_token');
  }
}

export const authService = new AuthService();
export default authService;

