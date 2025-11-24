import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getApiBaseUrl } from './utils';

// API Base URL - sesuaikan dengan environment Anda
// Untuk development di Android emulator, gunakan: http://10.0.2.2:3000
// Untuk physical device, gunakan IP komputer Anda: http://192.168.x.x:3000
// Untuk iOS simulator, gunakan: http://localhost:3000
// 
// Untuk mengubah base URL, edit fungsi getApiBaseUrl() di utils.ts
// atau gunakan setBaseURL() setelah import
const API_BASE_URL = getApiBaseUrl();

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - attach token jika ada
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired atau invalid, clear storage
          await AsyncStorage.multiRemove(['access_token', 'user']);
          // Bisa redirect ke login screen jika diperlukan
        }
        return Promise.reject(error);
      }
    );
  }

  getInstance(): AxiosInstance {
    return this.client;
  }

  // Update base URL untuk development dengan IP komputer
  setBaseURL(url: string) {
    this.client.defaults.baseURL = url;
  }
}

export const apiClient = new ApiClient();
export default apiClient.getInstance();

