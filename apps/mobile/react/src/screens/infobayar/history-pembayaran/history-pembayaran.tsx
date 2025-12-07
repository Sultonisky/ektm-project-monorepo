import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ChevronLeft, SlidersHorizontal, X } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import useAuth from '../../../hooks/useAuth';
import { paymentService, type PaymentResponse } from '../../../services/api';
import FilterBottomSheet from './FilterBottomSheet';
import PaymentDetailBottomSheet from './PaymentDetailBottomSheet';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Status configuration
const statusConfig: Record<string, { label: string; background: string; color: string }> = {
  lunas: { label: 'Berhasil', background: '#39DA30', color: '#FFFFFF' },
  pending: { label: 'Menunggu', background: '#FFC107', color: '#FFFFFF' },
  belum: { label: 'Belum Bayar', background: '#DC3545', color: '#FFFFFF' },
};

const formatCurrency = (value?: number | string | null) => {
  const amount = Number(value ?? 0);
  if (Number.isNaN(amount) || amount <= 0) {
    return 'Rp0';
  }
  return `Rp${amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
};

const formatDate = (iso?: string) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getPaymentAmount = (payment: PaymentResponse) => {
  const raw = payment.totalPayment || payment.biayaPokok || payment.biayaTambahanJurusan || payment.biayaPraktikum || payment.biayaUjian || payment.biayaKegiatan || '0';
  return formatCurrency(raw);
};

const getStatusConfig = (status?: string) => {
  if (!status) return statusConfig.belum;
  const key = status.toLowerCase();
  return statusConfig[key] || statusConfig.belum;
};

export default function HistoryPembayaranScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentResponse | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    dateRange?: string;
    paymentTypes: string[];
    sortBy?: string;
  }>({
    paymentTypes: [],
  });

  // Fetch payment history
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadPayments = async () => {
        if (!user?.id) return;
        setLoading(true);
        setErrorMessage(null);

        try {
          const paymentList = await paymentService.getAllPayments(user.id);
          if (!isActive) return;
          setPayments(paymentList);
        } catch (error: any) {
          if (!isActive) return;
          console.error('Failed to load payment history:', error);
          setErrorMessage(error?.message || 'Tidak dapat memuat riwayat pembayaran.');
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      loadPayments();

      return () => {
        isActive = false;
      };
    }, [user?.id]),
  );

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilter = (filters: any) => {
    console.log('Apply filters:', filters);
    
    // Set active filters
    const newFilters: any = {
      paymentTypes: filters.paymentTypes || [],
    };
    
    // Add date range if both dates are selected
    if (filters.dateFrom && filters.dateTo) {
      newFilters.dateRange = `${filters.dateFrom} - ${filters.dateTo}`;
    }
    
    // Add sort option
    if (filters.sortBy) {
      newFilters.sortBy = filters.sortBy;
    }
    
    setActiveFilters(newFilters);
    setShowFilterModal(false);
  };

  const removeFilter = (type: 'dateRange' | 'paymentType' | 'sortBy', value?: string) => {
    setActiveFilters(prev => {
      const updated = { ...prev };
      
      if (type === 'dateRange') {
        delete updated.dateRange;
      } else if (type === 'paymentType' && value) {
        updated.paymentTypes = updated.paymentTypes.filter(t => t !== value);
      } else if (type === 'sortBy') {
        delete updated.sortBy;
      }
      
      return updated;
    });
  };

  const getFilterChipLabel = (type: string, value: string) => {
    const labels: Record<string, string> = {
      ukt: 'UKT',
      kegiatan: 'Kegiatan',
      seminar: 'Seminar',
      bootcamp: 'Bootcamp',
      abjad: 'Abjad A - Z',
      terbaru: 'Terbaru',
      terlama: 'Terlama',
    };
    return labels[value] || value;
  };

  const handlePaymentDetailPress = (payment: PaymentResponse) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  // Render Active Filter Chips
  const renderActiveFilters = () => {
    const hasFilters = activeFilters.dateRange || activeFilters.paymentTypes.length > 0 || activeFilters.sortBy;
    
    if (!hasFilters) return null;

    return (
      <View style={styles.activeFiltersContainer}>
        {activeFilters.dateRange && (
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>{activeFilters.dateRange}</Text>
            <TouchableOpacity 
              style={styles.filterChipClose}
              onPress={() => removeFilter('dateRange')}
            >
              <X color="#FFFFFF" size={16} />
            </TouchableOpacity>
          </View>
        )}
        
        {activeFilters.paymentTypes.map((type) => (
          <View key={type} style={styles.filterChip}>
            <Text style={styles.filterChipText}>{getFilterChipLabel('paymentType', type)}</Text>
            <TouchableOpacity 
              style={styles.filterChipClose}
              onPress={() => removeFilter('paymentType', type)}
            >
              <X color="#FFFFFF" size={16} />
            </TouchableOpacity>
          </View>
        ))}
        
        {activeFilters.sortBy && (
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>{getFilterChipLabel('sort', activeFilters.sortBy)}</Text>
            <TouchableOpacity 
              style={styles.filterChipClose}
              onPress={() => removeFilter('sortBy')}
            >
              <X color="#FFFFFF" size={16} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Render Empty State
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateContent}>
        <Image
          source={require('@images/notify_amico.png')}
          style={styles.emptyStateImage}
          resizeMode="contain"
        />
        <View style={styles.emptyStateTextContainer}>
          <Text style={styles.emptyStateTitle}>Belum Ada Riwayat Pembayaran</Text>
          <Text style={styles.emptyStateSubtitle}>
            Semua riwayat pembayaran akan tercatat disini jika kamu melakukan pembayaran
          </Text>
        </View>
      </View>
    </View>
  );

  // Render Payment List
  const renderPaymentList = () => (
    <View style={styles.listContainer}>
      <View style={styles.listContent}>
        {/* Active Filters */}
        {renderActiveFilters()}
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {payments.map((payment, index) => {
            const status = getStatusConfig(payment.status);
            const amount = getPaymentAmount(payment);
            const transactionDate = formatDate(payment.createdAt);

            return (
              <View key={payment.id || index} style={styles.paymentCard}>
                <View style={styles.paymentCardHeader}>
                  <Text style={styles.invoiceNumber}>
                    Invoice: {payment.paymentCode || '1234567890954322376'}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.paymentCardBody}>
                  <Text style={styles.paymentType}>Pembayaran UKT</Text>

                  <View style={styles.statusRow}>
                    <View style={styles.statusLabelContainer}>
                      <Text style={styles.statusLabel}>Status</Text>
                      <Text style={styles.statusColon}>:</Text>
                      <View style={[styles.statusBadge, { backgroundColor: status.background }]}>
                        <Text style={[styles.statusBadgeText, { color: status.color }]}>
                          {status.label}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.transactionDate}>
                    Tanggal Transaksi : {transactionDate}
                  </Text>

                  <View style={styles.paymentCardFooter}>
                    <Text style={styles.totalText}>Total : {amount}</Text>
                    <TouchableOpacity
                      style={styles.detailButton}
                      onPress={() => handlePaymentDetailPress(payment)}
                    >
                      <Text style={styles.detailButtonText}>Lihat Rincian</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );

  // Render Loading State
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.headerEmpty}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <ChevronLeft color="#000" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitleEmpty}>Riwayat Pembayaran</Text>
          <View style={styles.filterButtonPlaceholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#1E69DD" size="large" />
          <Text style={styles.loadingText}>Memuat riwayat pembayaran...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Determine if empty state should be shown
  const isEmpty = payments.length === 0;

  return (
    <SafeAreaView style={[styles.container, isEmpty && styles.containerEmpty]} edges={['top']}>
      {isEmpty ? (
        // Empty State Header
        <>
          <View style={styles.headerEmpty}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <ChevronLeft color="#000" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitleEmpty}>Riwayat Pembayaran</Text>
            <TouchableOpacity style={styles.filterButtonEmpty} onPress={handleFilterPress}>
              <SlidersHorizontal color="#FFFFFF" size={24} />
            </TouchableOpacity>
          </View>
          {renderEmptyState()}
        </>
      ) : (
        // List State Header with Blue Background
        <>
          <View style={styles.headerBlueBackground}>
            <View style={styles.headerBlur} />
            <View style={styles.headerWithList}>
              <TouchableOpacity onPress={handleBackPress} style={styles.backButtonList}>
                <ChevronLeft color="#FFFFFF" size={24} />
              </TouchableOpacity>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitleList}>Riwayat Pembayaran</Text>
                <Text style={styles.headerSubtitleList}>
                  Semua riwayat pembayaran akan muncul disiini
                </Text>
              </View>
              <TouchableOpacity style={styles.filterButtonList} onPress={handleFilterPress}>
                <SlidersHorizontal color="#1E69DD" size={24} />
              </TouchableOpacity>
            </View>
          </View>
          {renderPaymentList()}
        </>
      )}

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilter}
      />

      {/* Payment Detail Bottom Sheet */}
      <PaymentDetailBottomSheet
        visible={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedPayment(null);
        }}
        paymentData={selectedPayment ? {
          name: user?.name || 'Unknown',
          nim: user?.nim?.toString() || '-',
          details: [
            { label: 'Biaya kuliah pokok', value: formatCurrency(selectedPayment.biayaPokok) },
            { label: 'Tambahan jurusan', value: formatCurrency(selectedPayment.biayaTambahanJurusan) },
            { label: 'Biaya pratikum', value: formatCurrency(selectedPayment.biayaPraktikum) },
            { label: 'Biaya ujian', value: formatCurrency(selectedPayment.biayaUjian) },
            { label: 'Biaya kegiatan mahasiswa', value: formatCurrency(selectedPayment.biayaKegiatan) },
          ].filter(detail => detail.value !== 'Rp0'),
          total: getPaymentAmount(selectedPayment),
        } : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerEmpty: {
    backgroundColor: '#F0F0F0',
  },

  // Empty State Header
  headerEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 16,
    height: 56,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleEmpty: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    textAlign: 'center',
    flex: 1,
  },
  filterButtonEmpty: {
    width: 56,
    height: 56,
    borderRadius: 1000,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonPlaceholder: {
    width: 56,
    height: 56,
  },

  // List State Header with Blue Background
  headerBlueBackground: {
    position: 'relative',
    height: 160,
    backgroundColor: '#75ABFF',
  },
  headerBlur: {
    position: 'absolute',
    width: '100%',
    height: 278,
    top: -122,
    backgroundColor: '#75ABFF',
  },
  headerWithList: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 16,
    gap: 12,
  },
  backButtonList: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  headerTextContainer: {
    flex: 1,
    gap: 4,
  },
  headerTitleList: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  headerSubtitleList: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  filterButtonList: {
    width: 56,
    height: 56,
    borderRadius: 1000,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateContent: {
    alignItems: 'center',
    gap: 24,
  },
  emptyStateImage: {
    width: 241.59,
    height: 284.2,
  },
  emptyStateTextContainer: {
    gap: 4,
    width: 342,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 24,
    textAlign: 'center',
    color: '#000000',
  },
  emptyStateSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    lineHeight: 18,
    textAlign: 'center',
    color: '#000000',
  },

  // List Container
  listContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -40,
  },
  listContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 32,
  },
  listSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
    lineHeight: 24,
    marginBottom: 16,
  },
  
  // Active Filter Chips
  activeFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 4,
    backgroundColor: '#1E69DD',
    borderRadius: 8,
    gap: 8,
  },
  filterChipText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  filterChipClose: {
    width: 32,
    height: 32,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 32,
  },

  // Payment Card
  paymentCard: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
    backgroundColor: '#FFFFFF',
  },
  paymentCardHeader: {
    gap: 8,
  },
  invoiceNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 20,
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D9D9',
  },
  paymentCardBody: {
    gap: 8,
  },
  paymentType: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    lineHeight: 15,
    color: '#000000',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    lineHeight: 15,
    color: '#000000',
  },
  statusColon: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    lineHeight: 15,
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 18,
    textAlign: 'center',
  },
  transactionDate: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    lineHeight: 12,
    color: '#838383',
  },
  paymentCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  totalText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    lineHeight: 15,
    color: '#000000',
  },
  detailButton: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    lineHeight: 18,
    textAlign: 'center',
    color: '#000000',
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4E4E4E',
  },
});

