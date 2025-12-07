import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notifikasiService, type NotifikasiResponse } from '../services/api';
import useAuth from '../hooks/useAuth';

export interface LocalNotification {
  id: string;
  type: 'account' | 'payment' | 'general';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  createdAt: string;
  data?: any; // Additional data (e.g., payment info)
}

interface NotificationContextValue {
  notifications: LocalNotification[];
  unreadCount: number;
  isLoading: boolean;
  addNotification: (notification: Omit<LocalNotification, 'id' | 'createdAt' | 'time'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteNotifications: (ids: string[]) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

const STORAGE_KEY = 'notifications';
const MAX_LOCAL_NOTIFICATIONS = 100; // Limit stored notifications

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<LocalNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Helper to format time ago
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} Menit lalu`;
    if (hours < 24) return `${hours} Jam lalu`;
    return `${days} Hari lalu`;
  };

  // Load notifications from AsyncStorage
  const loadLocalNotifications = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as LocalNotification[];
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }, []);

  // Save notifications to AsyncStorage
  const saveNotifications = useCallback(async (notifs: LocalNotification[]) => {
    try {
      // Keep only the most recent notifications
      const limited = notifs.slice(0, MAX_LOCAL_NOTIFICATIONS);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
      setNotifications(limited);
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }, []);

  // Sync with API (if backend is available)
  const syncWithAPI = useCallback(async () => {
    if (!user) return;

    try {
      const apiNotifications = await notifikasiService.getMyNotifikasi();
      
      // Convert API notifications to local format
      const converted: LocalNotification[] = apiNotifications.map(notif => ({
        id: notif.id,
        type: 'general',
        title: notif.title,
        description: notif.message,
        time: getTimeAgo(new Date(notif.createdAt)),
        isRead: notif.isRead,
        createdAt: notif.createdAt,
      }));

      // Merge with local notifications (API takes precedence)
      const localStored = await AsyncStorage.getItem(STORAGE_KEY);
      let localNotifs: LocalNotification[] = [];
      if (localStored) {
        localNotifs = JSON.parse(localStored);
      }

      // Combine and deduplicate
      const apiIds = new Set(converted.map(n => n.id));
      const localOnly = localNotifs.filter(n => !apiIds.has(n.id));
      const merged = [...converted, ...localOnly];

      // Sort by createdAt (newest first)
      merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      await saveNotifications(merged);
    } catch (error) {
      console.error('Failed to sync notifications with API:', error);
      // Fall back to local notifications
      await loadLocalNotifications();
    }
  }, [user, loadLocalNotifications, saveNotifications]);

  // Refresh notifications (try API first, fall back to local)
  const refreshNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      if (user) {
        await syncWithAPI();
      } else {
        await loadLocalNotifications();
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, syncWithAPI, loadLocalNotifications]);

  // Load on mount
  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  // Add new notification
  const addNotification = useCallback(async (
    notification: Omit<LocalNotification, 'id' | 'createdAt' | 'time'>
  ) => {
    const now = new Date();
    const newNotif: LocalNotification = {
      ...notification,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now.toISOString(),
      time: getTimeAgo(now),
    };

    // Add to local storage immediately
    const updated = [newNotif, ...notifications];
    await saveNotifications(updated);

    // Try to sync with API if user is logged in
    if (user) {
      try {
        await notifikasiService.createNotifikasi({
          mahasiswaId: user.id,
          title: notification.title,
          message: notification.description,
        });
      } catch (error) {
        console.error('Failed to create notification on server:', error);
        // Keep the local notification anyway
      }
    }
  }, [notifications, saveNotifications, user]);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    const updated = notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    );
    await saveNotifications(updated);

    // Sync with API
    if (user && !id.startsWith('local_')) {
      try {
        await notifikasiService.markAsRead(id);
      } catch (error) {
        console.error('Failed to mark as read on server:', error);
      }
    }
  }, [notifications, saveNotifications, user]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    await saveNotifications(updated);

    // Sync with API
    if (user) {
      try {
        await notifikasiService.markAllMyNotifikasiAsRead();
      } catch (error) {
        console.error('Failed to mark all as read on server:', error);
      }
    }
  }, [notifications, saveNotifications, user]);

  // Delete single notification
  const deleteNotification = useCallback(async (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    await saveNotifications(updated);
  }, [notifications, saveNotifications]);

  // Delete multiple notifications
  const deleteNotifications = useCallback(async (ids: string[]) => {
    const idsSet = new Set(ids);
    const updated = notifications.filter(n => !idsSet.has(n.id));
    await saveNotifications(updated);
  }, [notifications, saveNotifications]);

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteNotifications,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

