import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ChevronLeft, Trash2, X, User, DollarSign } from 'lucide-react-native';
import { useNotifications } from '../../providers/NotificationProvider';

export default function NotificationScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoading,
    deleteNotifications,
    refreshNotifications,
    markAsRead,
  } = useNotifications();

  // Refresh notifications when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshNotifications();
    }, [refreshNotifications])
  );

  // Update time labels periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update time labels
      refreshNotifications();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDelete = async () => {
    if (selectedIds.size === 0) return;
    
    await deleteNotifications(Array.from(selectedIds));
    setSelectedIds(new Set());
    setIsDeleteMode(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: typeof notifications[0]) => {
    if (isDeleteMode) {
      handleToggleSelect(notification.id);
      return;
    }

    // Mark as read when tapped
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type/data
    if (notification.type === 'payment' && notification.data) {
      // Could navigate to payment details
      // navigation.navigate('RincianPembayaran', notification.data);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteMode(false);
    setSelectedIds(new Set());
  };

  const handleTrashPress = () => {
    if (notifications.length === 0) return;
    setIsDeleteMode(true);
  };

  // Empty state
  if (notifications.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft color="#000" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifikasi</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.trashButton} disabled>
              <Trash2 color="#E0E0E0" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Empty State */}
        <View style={styles.emptyContainer}>
          <Image
            source={require('../../../assets/images/notify_amico.png')}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyTitle}>Oops! Tidak ada notifikasi disini.</Text>
          <Text style={styles.emptySubtitle}>
            Notifikasi akan muncul ketika kamu memilikinya
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // List state with notifications
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        {isDeleteMode ? (
          <>
            <TouchableOpacity onPress={handleCancelDelete} style={styles.backButton}>
              <X color="#000" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cancel</Text>
            <TouchableOpacity 
              style={[
                styles.deleteButton,
                selectedIds.size === 0 && styles.deleteButtonDisabled
              ]} 
              onPress={handleDelete}
              disabled={selectedIds.size === 0}
            >
              <Text style={[
                styles.deleteButtonText,
                selectedIds.size === 0 && styles.deleteButtonTextDisabled
              ]}>
                Delete
              </Text>
              <Trash2 color="#FFFFFF" size={18} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ChevronLeft color="#000" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifikasi</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.trashButton} onPress={handleTrashPress}>
                <Trash2 color="#000" size={20} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            Semua ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'unread' && styles.tabActive]}
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.tabText, activeTab === 'unread' && styles.tabTextActive]}>
            Belum Dibaca ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading && notifications.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Memuat notifikasi...</Text>
          </View>
        ) : filteredNotifications.length === 0 && activeTab === 'unread' ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Tidak ada notifikasi yang belum dibaca</Text>
            <Text style={styles.emptySubtitle}>
              Semua notifikasi sudah dibaca
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={styles.notificationItem}
              activeOpacity={isDeleteMode ? 1 : 0.7}
              onPress={() => handleNotificationPress(notification)}
            >
            {/* Checkbox (only in delete mode) */}
            {isDeleteMode && (
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => handleToggleSelect(notification.id)}
              >
                <View style={[
                  styles.checkbox,
                  selectedIds.has(notification.id) && styles.checkboxChecked
                ]}>
                  {selectedIds.has(notification.id) && (
                    <View style={styles.checkmark} />
                  )}
                </View>
              </TouchableOpacity>
            )}

            {/* Unread indicator */}
            {!notification.isRead && (
              <View style={styles.unreadDot} />
            )}

            {/* Icon */}
            <View style={[
              styles.iconContainer,
              notification.type === 'payment' ? styles.iconPayment : styles.iconAccount
            ]}>
              {notification.type === 'account' ? (
                <User color="#FFFFFF" size={24} />
              ) : (
                <DollarSign color="#FFFFFF" size={24} />
              )}
            </View>

            {/* Content */}
            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle} numberOfLines={1}>
                  {notification.title}
                </Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
              <Text style={styles.notificationDescription} numberOfLines={1}>
                {notification.description}
              </Text>
            </View>
          </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trashButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  deleteButtonDisabled: {
    backgroundColor: '#FFB3AF',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  deleteButtonTextDisabled: {
    color: '#FFFFFF',
  },
  
  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  emptyImage: {
    width: 250,
    height: 250,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  tabActive: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },

  // Notifications list
  scrollView: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    position: 'relative',
  },
  checkboxContainer: {
    marginRight: 12,
    padding: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    position: 'absolute',
    left: 8,
    top: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconAccount: {
    backgroundColor: '#007AFF',
  },
  iconPayment: {
    backgroundColor: '#007AFF',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
    marginRight: 8,
  },
  notificationTime: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#999',
  },
  notificationDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
});

