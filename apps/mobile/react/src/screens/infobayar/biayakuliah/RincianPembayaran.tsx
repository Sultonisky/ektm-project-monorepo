import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, IdCard, ChevronDown } from 'lucide-react-native';
import useAuth from '../../../hooks/useAuth';
import { paymentService } from '../../../services/api';
import { bankImages } from '../../../constants/bank';

type PaymentMethod = { key: string; name: string; logo: any };

type AmountPayload = {
  biayaPokok?: string;
  biayaTambahanJurusan?: string;
  biayaPraktikum?: string;
  biayaUjian?: string;
  biayaKegiatan?: string;
};

type Props = {
  navigation?: any;
  route?: any;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_PADDING = 32;
const CONTENT_WIDTH = SCREEN_WIDTH - (CONTENT_PADDING * 2);

// bankImages now shared from constants

export default function RincianPembayaranScreen({ navigation: propNavigation, route }: Props) {
  const navigation = useNavigation<any>();
  const { user, mahasiswaProfile } = useAuth();
  const [selectedBankIndex, setSelectedBankIndex] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Mode tampilan berdasarkan status (belum_bayar | waiting | lunas/success)
  const statusParam: string | undefined = route?.params?.status;
  const isLunasMode = statusParam === 'lunas' || statusParam === 'success';

  const biayaComponents = route?.params?.biayaComponents ?? null;
  const mahasiswaId = mahasiswaProfile?.id ?? user?.id ?? null;

  // Data yang dibawa dari screen sebelumnya (opsional)
  const invoiceId: string = route?.params?.invoiceId || '1234567890954322376';
  const paidBankKey: string | undefined = route?.params?.bankKey; // contoh: 'bca'

  // Data metode pembayaran yang tersedia
  const paymentMethods: PaymentMethod[] = useMemo(
    () => [
      { key: 'bca', name: 'BANK BCA', logo: bankImages.bca },
      { key: 'bni', name: 'BANK BNI', logo: bankImages.bni },
      { key: 'bri', name: 'BANK BRI', logo: bankImages.bri },
      { key: 'bsi', name: 'BANK BSI', logo: bankImages.bsi },
      { key: 'cimb', name: 'BANK CIMB', logo: bankImages.cimb },
      { key: 'mandiri', name: 'BANK Mandiri', logo: bankImages.mandiri },
      { key: 'permata', name: 'BANK Permata', logo: bankImages.permata },
    ],
    []
  );

  // Data rincian pembayaran - bisa diambil dari props atau state
  const paymentDetails: Array<{ label: string; value: string }> =
    (route?.params?.rincian as Array<{ label: string; value: string }> | undefined) ?? [
      { label: 'Biaya Kuliah Pokok', value: 'Rp2.580.000' },
      { label: 'Tambahan Jurusan', value: 'Rp700.000' },
      { label: 'Biaya Praktikum', value: 'Rp1.200.000' },
      { label: 'Biaya Ujian', value: 'Rp300.000' },
      { label: 'Biaya Kegiatan Mahasiswa', value: 'Rp400.000' },
    ];

  const total = route?.params?.total || 'Rp3.280.000';

  const sanitizeCurrency = (value: string | number | undefined | null): string | undefined => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'number') {
      return Math.round(value).toString();
    }
    const digits = value.toString().replace(/[^0-9]/g, '');
    return digits.length ? digits : undefined;
  };

  const amountPayload: AmountPayload = useMemo(() => {
    if (biayaComponents) {
      return {
        biayaPokok: sanitizeCurrency(biayaComponents.biayaPokok),
        biayaTambahanJurusan: sanitizeCurrency(biayaComponents.biayaTambahanJurusan),
        biayaPraktikum: sanitizeCurrency(biayaComponents.biayaPraktikum),
        biayaUjian: sanitizeCurrency(biayaComponents.biayaUjian),
        biayaKegiatan: sanitizeCurrency(biayaComponents.biayaKegiatan),
      };
    }

    const map: AmountPayload = {};
    paymentDetails.forEach(detail => {
      const normalized = detail.label.toLowerCase();
      const sanitized = sanitizeCurrency(detail.value);
      if (!sanitized) return;
      if (normalized.includes('pokok')) map.biayaPokok = sanitized;
      else if (normalized.includes('tambahan')) map.biayaTambahanJurusan = sanitized;
      else if (normalized.includes('praktikum')) map.biayaPraktikum = sanitized;
      else if (normalized.includes('ujian')) map.biayaUjian = sanitized;
      else if (normalized.includes('kegiatan')) map.biayaKegiatan = sanitized;
    });
    return map;
  }, [biayaComponents, paymentDetails]);

  const studentName = route?.params?.nama || 'Nihat Hasannanto';
  const studentNim = route?.params?.nim || '19230211';
  const studentSemester = route?.params?.semester || 'Semester 5';

  // Cek apakah button bisa aktif (sudah memilih bank)
  const isButtonEnabled = selectedBankIndex !== null && !isSubmitting;

  const selectedBank = selectedBankIndex !== null ? paymentMethods[selectedBankIndex] : null;

  const handleBackPress = () => {
    if (propNavigation?.goBack) {
      propNavigation.goBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const normalizeBankKey = (value?: string) => {
    if (!value) return undefined;
    const key = value.toLowerCase() as keyof typeof bankImages;
    return bankImages[key] ? key : undefined;
  };

  const handleSelectBank = (index: number) => {
    setSelectedBankIndex(index);
    setIsDropdownOpen(false);
  };

  const handlePayNow = async () => {
    if (selectedBankIndex === null || isSubmitting) return;

    const selected = paymentMethods[selectedBankIndex];
    const selectedBankKey = normalizeBankKey(selected.key);

    if (!mahasiswaId) {
      setSubmitError('Data mahasiswa tidak ditemukan. Silakan coba lagi.');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    const paymentCode = `PAY-${Date.now()}`;
    const payload: any = {
      mahasiswaId: String(mahasiswaId),
      paymentCode,
      paymentMethod: 'bank',
    };

    if (amountPayload.biayaPokok) payload.biayaPokok = amountPayload.biayaPokok;
    if (amountPayload.biayaTambahanJurusan) payload.biayaTambahanJurusan = amountPayload.biayaTambahanJurusan;
    if (amountPayload.biayaPraktikum) payload.biayaPraktikum = amountPayload.biayaPraktikum;
    if (amountPayload.biayaUjian) payload.biayaUjian = amountPayload.biayaUjian;
    if (amountPayload.biayaKegiatan) payload.biayaKegiatan = amountPayload.biayaKegiatan;

    try {
      const response = await paymentService.createPaymentWithMidtrans(payload);
      const responseBankKey = normalizeBankKey(response.midtransVaBank ?? undefined);
      const bankKeyToUse = responseBankKey ?? selectedBankKey ?? ('bca' as keyof typeof bankImages);
      const vaNumber = response.midtransVaNumber || response.midtransBillKey || invoiceId;

      navigation.navigate('MenungguPembayaran', {
        paymentId: response.id,
        paymentCode: response.paymentCode,
        status: response.status,
        nama: studentName,
        nim: studentNim,
        rincian: paymentDetails,
        total,
        bankKey: bankKeyToUse,
        invoiceId: vaNumber,
        midtransPaymentUrl: response.midtransPaymentUrl,
        midtransActions: response.midtransActions,
        midtransBillKey: response.midtransBillKey,
        midtransBillerCode: response.midtransBillerCode,
      });
    } catch (error: any) {
      console.error('Failed to create payment with Midtrans:', error);
      setSubmitError(error?.message || 'Gagal membuat pembayaran. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToHome = () => {
    navigation.navigate('Main', { initialTab: 'ektm' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header dengan Arrow dan Title */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <View style={styles.backButtonCircle}>
            <ArrowLeft size={18} color="#000000" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rincian Pembayaran</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Sukses (Lunas) */}
        {isLunasMode && (
          <View style={styles.lunasBannerContainer}>
            <Image
              source={require('@images/frame_lunas.png')}
              style={styles.lunasBannerImage}
            />
            <Text style={styles.lunasTitle}>Lunas</Text>
          </View>
        )}
        {/* Profil dalam card */}
        <View style={styles.profileCard}>
          <View style={styles.profileSection}>
            <Image
              source={require('@images/profile.jpeg')}
              style={styles.profileImage}
            />
            <View style={[styles.profileInfo, { flex: 1 }] }>
              <Text style={styles.profileName}>{studentName}</Text>
              <Text style={styles.profileNim}>{studentNim}</Text>
              {!isLunasMode && (
                <Text style={styles.profileSemester}>{studentSemester}</Text>
              )}
            </View>
            {isLunasMode && (
              <View style={styles.bankBadgeWrapper}>
                <Image
                  source={paidBankKey ? (bankImages as any)[paidBankKey] : bankImages.bca}
                  style={styles.bankBadge}
                />
              </View>
            )}
          </View>
        </View>

        {/* Dropdown Metode Pembayaran (hanya untuk belum bayar) */}
        {!isLunasMode && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsDropdownOpen((prev) => !prev)}
            style={[styles.dropdownHeader, selectedBank && styles.dropdownHeaderSelected]}
          >
            <View style={styles.dropdownLeft}>
              {selectedBank ? (
                <>
                  <Image source={selectedBank.logo} style={styles.bankLogo} />
                  <Text style={[styles.dropdownTitle, selectedBank && styles.dropdownTitleSelected]}>
                    {selectedBank.name}
                  </Text>
                </>
              ) : (
                <Text style={styles.dropdownTitle}>Metode Pembayaran</Text>
              )}
            </View>
            <ChevronDown size={20} color={'#000000'} />
          </TouchableOpacity>
        )}

        {isDropdownOpen && !isLunasMode && (
          <View style={styles.dropdownListWrapper}>
            {paymentMethods.map((bank, index) => {
              const isSelected = selectedBankIndex === index;
              return (
                <TouchableOpacity
                  key={bank.key}
                  style={[styles.bankRow, isSelected && styles.bankRowSelected]}
                  onPress={() => handleSelectBank(index)}
                  activeOpacity={0.8}
                >
                  <Image source={bank.logo} style={styles.bankLogo} />
                  <Text style={styles.bankName}>{bank.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Rincian Pembayaran Section */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Rincian Pembayaran</Text>

          {/* Baris Invoice (untuk Lunas tampilkan) */}
          {isLunasMode && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Invoice</Text>
              <Text style={styles.detailValue}>{invoiceId}</Text>
            </View>
          )}

          <View style={styles.detailsList}>
            {paymentDetails.map((detail: { label: string; value: string }, index: number) => (
              <View key={index} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{detail.label}</Text>
                <Text style={styles.detailValue}>{detail.value}</Text>
              </View>
            ))}
          </View>

          {/* Garis putus-putus */}
          <View style={styles.dashedDivider} />

          {/* Total Section */}
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Total Biaya</Text>
            <Text style={styles.amountValue}>{total}</Text>
          </View>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Footer: tombol selalu tetap di bawah */}
      <View style={styles.footerWrapper}>
        {isLunasMode ? (
          <TouchableOpacity
            style={styles.payButton}
            onPress={handleBackToHome}
            activeOpacity={0.8}
          >
            <IdCard size={24} color={'#FFFFFF'} />
            <Text style={styles.payButtonText}>Kembali ke E-KTM</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.payButton, !isButtonEnabled && styles.payButtonDisabled]}
            onPress={handlePayNow}
            disabled={!isButtonEnabled}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <IdCard size={24} color={isButtonEnabled ? '#FFFFFF' : '#898989'} />
            )}
            <Text
              style={[
                styles.payButtonText,
                !isButtonEnabled && styles.payButtonTextDisabled,
              ]}
            >
              {isSubmitting ? 'Memproses...' : 'Bayar Sekarang'}
            </Text>
          </TouchableOpacity>
        )}
        {submitError ? (
          <Text style={styles.submitErrorText}>{submitError}</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 18,
    backgroundColor: '#F0F0F0',
  },
  headerSpacer: {
    width: 32,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#000000',
    lineHeight: 24,
    textAlign: 'center',
    flex: 1,
  },

  // ScrollView Styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 16,
  },

  // Lunas Banner
  lunasBannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  lunasBannerImage: {
    width: 212,
    height: 235,
    resizeMode: 'contain',
  },
  lunasTitle: {
    marginTop: 4,
    fontSize: 28,
    color: '#11B058',
    fontFamily: 'Poppins-Bold',
    lineHeight: 32,
  },

  // Profile Section Styles
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
  },
  profileInfo: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  bankBadgeWrapper: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankBadge: {
    width: 72,
    height: 40,
    resizeMode: 'contain',
    borderRadius: 12,
    backgroundColor: '#EAF2FF',
    padding: 6,
  },
  profileName: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
    color: '#565656',
    lineHeight: 24,
    marginBottom: 4,
  },
  profileNim: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    color: '#565656',
    lineHeight: 24,
  },
  profileSemester: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    color: '#000000',
    lineHeight: 24,
  },

  // Payment Section Header
  paymentSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentSectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#000000',
    lineHeight: 24,
  },
  lihatSemuaLink: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#1E69DD',
    lineHeight: 21,
  },

  // Dropdown styles
  dropdownHeader: {
    width: '100%',
    height: 53,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dropdownHeaderSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#1E69DD',
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dropdownTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#000000',
  },
  dropdownTitleSelected: {
    color: '#000000',
  },
  dropdownListWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 8,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  bankRowSelected: {
    backgroundColor: '#FFFFFF',
  },
  bankLogo: {
    width: 55,
    height: 17,
    resizeMode: 'contain',
  },
  bankName: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
    color: '#000000',
    marginLeft: 14,
  },

  // Details Section Styles
  detailsCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#AAA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  detailsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#121212',
    lineHeight: 24,
    marginBottom: 16,
  },
  detailsList: {
    marginTop: 0,
    gap: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    color: '#707070',
    lineHeight: 18,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#000000',
    lineHeight: 18,
    textAlign: 'center',
  },
  dashedDivider: {
    width: '100%',
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#EDEDED',
    marginVertical: 8,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  amountLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    color: '#707070',
    lineHeight: 18,
    flex: 1,
  },
  amountValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '500',
    color: '#1F1F1F',
    lineHeight: 24,
    textAlign: 'center',
  },

  // Pay Button Styles
  footerWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 32,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: 'transparent',
  },
  payButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#1E69DD', // Warna biru solid, bukan gradient
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 0,
  },
  payButtonDisabled: {
    backgroundColor: '#DADADA',
  },
  payButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
  },
  payButtonTextDisabled: {
    color: '#898989',
  },
  submitErrorText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#D92121',
    textAlign: 'center',
    marginTop: 12,
  },

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 366,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    maxHeight: '80%',
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalScrollView: {
    maxHeight: 320,
  },
  modalScrollContent: {
    paddingBottom: 8,
  },
  modalBankCard: {
    width: '100%',
    height: 53,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    overflow: 'hidden',
  },
  modalBankCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: '100%',
    width: '100%',
  },
  modalCloseButton: {
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  modalCloseText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#1E69DD',
    lineHeight: 21,
  },
});
