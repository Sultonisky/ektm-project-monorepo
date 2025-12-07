import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ChevronLeft, Bell, Headphones, Lightbulb, IdCard, CarFront, ClipboardClock, Footprints, Medal, Trophy, GraduationCap, FileCheck, BookOpen, Package, FileEdit } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import useAuth from '../../hooks/useAuth';
import { paymentService, type PaymentResponse, type BiayaDefaultResponse } from '../../services/api';

const { width } = Dimensions.get('window');

const statusMeta: Record<string, { label: string; background: string; color: string }> = {
  lunas: { label: 'Lunas', background: 'rgba(40, 167, 69, 0.15)', color: '#28A745' },
  pending: { label: 'Menunggu', background: 'rgba(255, 193, 7, 0.15)', color: '#FFC107' },
  belum: { label: 'Belum Bayar', background: 'rgba(220, 53, 69, 0.12)', color: '#DC3545' },
};

const paymentMenuItems = [
  { id: 'biaya-kuliah', label: 'Biaya Kuliah', Icon: IdCard },
  { id: 'cuti-akademik', label: 'Cuti Akademik', Icon: CarFront },
  { id: 'mutasi', label: 'Mutasi', Icon: ClipboardClock },
  { id: 'kegiatan', label: 'Kegiatan', Icon: Footprints },
  { id: 'seminar', label: 'Seminar', Icon: Medal },
  { id: 'bootcamp', label: 'Bootcamp', Icon: Trophy },
  { id: 'wisuda', label: 'Wisuda', Icon: GraduationCap },
  { id: 'ujian-her', label: 'Ujian HER', Icon: FileCheck },
  { id: 'skripsi-ta', label: 'Skripsi / TA', Icon: BookOpen },
  { id: 'admin-jaket-kip', label: 'Admin Jaket KIP', Icon: Package },
  { id: 'ta-perbaikan', label: 'TA Perbaikan', Icon: FileEdit },
];

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

const getStatusBadge = (status?: string) => {
  if (!status) return statusMeta.belum;
  const key = status.toLowerCase();
  return statusMeta[key] || statusMeta.belum;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  navigation?: any;
  route?: any;
};

export default function InfoBayarScreen({ navigation: propNavigation }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const { user, mahasiswaProfile } = useAuth();

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [biayaDefault, setBiayaDefault] = useState<BiayaDefaultResponse | null>(null);
  const [payments, setPayments] = useState<PaymentResponse[]>([]);

  // Reset selection highlight when screen regains focus
  useFocusEffect(
    React.useCallback(() => {
      setSelectedItem(null);
    }, []),
  );

  // Fetch payment data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        if (!user?.id) return;
        setLoadingData(true);
        setErrorMessage(null);

        try {
          const [biaya, paymentList] = await Promise.all([
            paymentService.getBiayaDefault(user.id),
            paymentService.getAllPayments(user.id),
          ]);

          if (!isActive) return;
          setBiayaDefault(biaya);
          setPayments(paymentList);
        } catch (error: any) {
          if (!isActive) return;
          console.error('Failed to load payment data:', error);
          setErrorMessage(error?.message || 'Tidak dapat memuat data pembayaran.');
        } finally {
          if (isActive) {
            setLoadingData(false);
          }
        }
      };

      loadData();

      return () => {
        isActive = false;
      };
    }, [user?.id]),
  );

  const activePayment = useMemo(() => {
    if (!payments.length) return null;
    return payments.find(payment => payment.status && payment.status.toLowerCase() !== 'lunas') || payments[0];
  }, [payments]);

  const biayaRincian = useMemo(() => {
    const detail = biayaDefault?.biayaDefault;
    if (!detail) return null;

    const items = [
      { label: 'Biaya Kuliah Pokok', value: detail.biayaPokok },
      { label: 'Tambahan Jurusan', value: detail.biayaTambahanJurusan },
      { label: 'Biaya Praktikum', value: detail.biayaPraktikum },
      { label: 'Biaya Ujian', value: detail.biayaUjian },
      { label: 'Biaya Kegiatan Mahasiswa', value: detail.biayaKegiatan },
    ].filter(item => (item.value ?? 0) > 0)
      .map(item => ({ label: item.label, value: formatCurrency(item.value) }));

    return {
      rincian: items,
      totalFormatted: formatCurrency(detail.total),
      semesterLabel: `Semester ${detail.semester}`,
    };
  }, [biayaDefault]);


  const handleBackPress = () => {
    if (propNavigation?.goBack) {
      propNavigation.goBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleNotificationPress = () => {
    console.log('Navigate to notification');
  };

  const handleCustomerServicePress = () => {
    const phoneNumber = '62895395295511';
    const message = encodeURIComponent('Halo Admin, izin bertanya...');
    Linking.openURL(`https://wa.me/${phoneNumber}?text=${message}`);
  };

  const handlePaymentItemPress = (itemId: string) => {
    if (itemId === 'biaya-kuliah') {
      if (biayaRincian) {
        navigation.navigate('RincianPembayaran', {
          nama: mahasiswaProfile?.name || user?.name,
          nim: mahasiswaProfile?.nim?.toString() || user?.nim?.toString(),
          rincian: biayaRincian.rincian,
          total: biayaRincian.totalFormatted,
          semester: biayaRincian.semesterLabel,
          status: activePayment?.status as any,
          paymentCode: activePayment?.paymentCode,
          biayaComponents: biayaDefault?.biayaDefault ?? null,
        });
        return;
      }
    }

    if (itemId === 'cuti-akademik') {
      navigation.navigate('CutiAkademik');
      return;
    }

    if (itemId === 'bootcamp') {
      navigation.navigate('Bootcamp');
      return;
    }

    if (itemId === 'kegiatan') {
      navigation.navigate('Kegiatan');
      return;
    }

    if (itemId === 'seminar') {
      navigation.navigate('Seminar');
      return;
    }

    if (itemId === 'mutasi') {
      navigation.navigate('Mutasi');
      return;
    }

    console.log('Navigate to payment:', itemId);
  };

  const handleHistoryPembayaranPress = () => {
    navigation.navigate('HistoryPembayaran');
  };

  const renderPaymentSummary = () => {
    if (loadingData) {
      return (
        <View style={styles.dataCard}>
          <ActivityIndicator color="#1E69DD" />
          <Text style={styles.dataCardLoadingText}>Memuat data pembayaran...</Text>
        </View>
      );
    }

    if (errorMessage) {
      return (
        <View style={[styles.dataCard, styles.dataCardError]}>
          <Text style={styles.dataCardTitle}>Tagihan Aktif</Text>
          <Text style={styles.dataCardErrorText}>{errorMessage}</Text>
        </View>
      );
    }

    if (biayaRincian) {
      const badge = getStatusBadge(activePayment?.status);
      return (
        <View style={styles.dataCard}>
          <View style={styles.dataCardHeader}>
            <Text style={styles.dataCardTitle}>Tagihan Aktif</Text>
            <View style={[styles.statusBadge, { backgroundColor: badge.background }]}>
              <Text style={[styles.statusBadgeText, { color: badge.color }]}>{badge.label}</Text>
            </View>
          </View>
          <Text style={styles.dataCardValue}>{biayaRincian.totalFormatted}</Text>
          <Text style={styles.dataCardSubtitle}>
            {biayaRincian.semesterLabel}
            {mahasiswaProfile?.jurusan?.name ? ` · ${mahasiswaProfile.jurusan.name}` : ''}
          </Text>
          {activePayment?.paymentCode ? (
            <Text style={styles.dataCardFootnote}>Kode Pembayaran: {activePayment.paymentCode}</Text>
          ) : null}
        </View>
      );
    }

    if (biayaDefault?.message) {
      return (
        <View style={styles.dataCard}>
          <Text style={styles.dataCardTitle}>Tagihan Aktif</Text>
          <Text style={styles.dataCardSubtitle}>{biayaDefault.message}</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Info Bayar</Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={handleCustomerServicePress} style={styles.iconButton}>
            <Headphones color="#000" size={24} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNotificationPress} style={styles.iconButton}>
            <Bell color="#000" size={20} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tagihan summary */}
        {renderPaymentSummary()}

        {/* Tentang Info Bayar Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tentang Info Bayar</Text>
          <Text style={styles.sectionArrow}>➔</Text>
        </View>

        <View style={{ height: 15 }} />

        {/* Carousel */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* History Pembayaran Card */}
          <TouchableOpacity 
            style={styles.carouselCard}
            onPress={handleHistoryPembayaranPress}
            activeOpacity={0.7}
          >
            <Image
              source={require('@images/bg_history_pembayaran.png')}
              style={styles.carouselBackground}
              resizeMode="cover"
            />
            <View style={styles.carouselContent}>
              <Text style={styles.carouselTitle}>History Pembayaran</Text>
              <View style={styles.carouselBottomRow}>
                <View style={styles.carouselLabel}>
                  <Lightbulb color="#FFD600" size={14} />
                  <View style={{ width: 6 }} />
                  <Text style={styles.carouselLabelText}>UBSI</Text>
                </View>
                <View style={styles.carouselBadge}>
                  <Text style={styles.carouselBadgeText}>{`${payments.length}x Pembayaran`}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <View style={{ width: 10 }} />

          {/* Tahapan Pembayaran Card */}
          <View style={styles.carouselCard}>
            <Image
              source={require('@images/bg_tahapan_pembayaran.png')}
              style={styles.carouselBackground}
              resizeMode="cover"
            />
            <View style={styles.carouselContent}>
              <Text style={styles.carouselTitle}>Tahapan Pembayaran</Text>
              <View style={styles.carouselBottomRow}>
                <View style={styles.carouselLabel}>
                  <Lightbulb color="#FFD600" size={14} />
                  <View style={{ width: 6 }} />
                  <Text style={styles.carouselLabelText}>Bank, Indomart, Alfamart</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={{ height: 30 }} />

        {/* Menu Pembayaran Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Menu Pembayaran</Text>
          <Text style={styles.sectionArrow}>➔</Text>
        </View>

        <View style={{ height: 15 }} />

        {/* Payment Menu Grid */}
        <View style={styles.paymentGrid}>
          {paymentMenuItems.map((item, index) => {
            const isLastInRow = (index + 1) % 3 === 0;
            const isLastItem = index === paymentMenuItems.length - 1;
            const isSelected = selectedItem === item.id;
            const IconComponent = item.Icon;

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.paymentItem,
                  isSelected && styles.paymentItemSelected,
                  (isLastInRow || isLastItem) && styles.paymentItemNoMarginRight,
                ]}
                onPress={() => handlePaymentItemPress(item.id)}
                onPressIn={() => setSelectedItem(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.paymentIconContainer}>
                  <IconComponent
                    color={isSelected ? '#1E69DD' : '#FFFFFF'}
                    size={24}
                  />
                </View>
                <Text style={[
                  styles.paymentLabel,
                  isSelected && styles.paymentLabelSelected,
                ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#000',
    flex: 1,
    marginLeft: 12,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    width: 8,
    height: 8,
    right: 8,
    top: 8,
    backgroundColor: '#1E69DD',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  dataCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24,
  },
  dataCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dataCardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
  },
  dataCardValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1E69DD',
  },
  dataCardSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#4E4E4E',
    marginTop: 4,
  },
  dataCardFootnote: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#777777',
    marginTop: 12,
  },
  dataCardLoadingText: {
    marginTop: 12,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#4E4E4E',
    textAlign: 'center',
  },
  dataCardError: {
    borderWidth: 1,
    borderColor: 'rgba(217, 33, 33, 0.2)',
  },
  dataCardErrorText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#D92121',
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
  sectionArrow: {
    fontSize: 16,
    color: '#000',
  },
  carouselCard: {
    width: 212,
    height: 85,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  carouselBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  carouselContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  carouselTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  carouselBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  carouselLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carouselLabelText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  carouselBadge: {
    backgroundColor: 'rgba(87, 212, 212, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  carouselBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'flex-start',
    paddingVertical: 4,
  },
  paymentItem: {
    width: 106,
    height: 98,
    backgroundColor: '#1E69DD',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginRight: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentItemSelected: {
    backgroundColor: '#FFFFFF',
  },
  paymentItemNoMarginRight: {
    marginRight: 0,
  },
  paymentIconContainer: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 17,
  },
  paymentLabelSelected: {
    color: '#1E69DD',
  },
});

