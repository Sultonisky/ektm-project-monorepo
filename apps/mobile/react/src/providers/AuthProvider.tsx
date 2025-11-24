import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  authService,
  mahasiswaService,
  type AuthResponse,
  type MahasiswaResponse,
} from '../services/api';

export type AuthStatus = 'loading' | 'authenticated' | 'guest';

export interface AuthUser {
  id: string;
  nim?: number;
  email?: string;
  name: string;
  role: 'mahasiswa' | 'admin';
}

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  token: string | null;
  mahasiswaProfile: MahasiswaResponse | null;
  isProfileLoading: boolean;
  loginMahasiswa: (nim: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [mahasiswaProfile, setMahasiswaProfile] = useState<MahasiswaResponse | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const loadStoredAuth = useCallback(async () => {
    try {
      setStatus('loading');
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem('access_token'),
        AsyncStorage.getItem('user'),
      ]);

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser) as AuthUser;
        setToken(storedToken);
        setUser(parsedUser);
        setStatus('authenticated');

        if (parsedUser.role === 'mahasiswa') {
          await loadMahasiswaProfile(parsedUser.id);
        } else {
          setMahasiswaProfile(null);
        }
      } else {
        setToken(null);
        setUser(null);
        setMahasiswaProfile(null);
        setStatus('guest');
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
      setToken(null);
      setUser(null);
      setMahasiswaProfile(null);
      setStatus('guest');
    }
  }, []);

  const loadMahasiswaProfile = useCallback(async (mahasiswaId: string) => {
    setIsProfileLoading(true);
    try {
      const profile = await mahasiswaService.getMahasiswaById(mahasiswaId);
      setMahasiswaProfile(profile);
    } catch (error) {
      console.error('Failed to load mahasiswa profile:', error);
      setMahasiswaProfile(null);
    } finally {
      setIsProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const loginMahasiswa = useCallback(
    async (nim: string, password: string) => {
      try {
        const response = await authService.loginMahasiswa(nim, password);
        setToken(response.access_token);
        setUser(response.user);
        setStatus('authenticated');

        if (response.user.role === 'mahasiswa') {
          await loadMahasiswaProfile(response.user.id);
        } else {
          setMahasiswaProfile(null);
        }

        return response;
      } catch (error) {
        throw error;
      }
    },
    [loadMahasiswaProfile],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setToken(null);
      setUser(null);
      setMahasiswaProfile(null);
      setStatus('guest');
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user || user.role !== 'mahasiswa') {
      setMahasiswaProfile(null);
      return;
    }
    await loadMahasiswaProfile(user.id);
  }, [loadMahasiswaProfile, user]);

  const value = useMemo<AuthContextValue>(() => ({
    status,
    user,
    token,
    mahasiswaProfile,
    isProfileLoading,
    loginMahasiswa,
    logout,
    refreshProfile,
  }), [
    status,
    user,
    token,
    mahasiswaProfile,
    isProfileLoading,
    loginMahasiswa,
    logout,
    refreshProfile,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
