import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Files, IdCard } from 'lucide-react-native';
import { paymentService } from '../../../services/api';
import { bankImages } from '../../../constants/bank';
// Clipboard optional dependency; fallback to no-op in dev
let Clipboard: { setString: (text: string) => void } = { setString: () => {} };
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Clipboard = require('@react-native-clipboard/clipboard').default;
} catch {}

type MidtransAction = { name: string; method: string; url: string };

type RouteParams = {
  invoiceId?: string; // VA number
  bankKey?: 'bca' | 'bni' | 'bri' | 'bsi' | 'cimb' | 'mandiri' | 'permata';
  nama?: string;
  nim?: string;
  rincian?: { label: string; value: string }[];
  total?: string;
  paymentId?: string;
  paymentCode?: string;
  status?: string;
  midtransPaymentUrl?: string;
  midtransActions?: MidtransAction[];
  midtransBillKey?: string;
  midtransBillerCode?: string;
};

const statusMeta: Record<string, { label: string; background: string; color: string }> = {
  lunas: { label: 'Lunas', background: 'rgba(40, 167, 69, 0.15)', color: '#28A745' },
  pending: { label: 'Menunggu', background: 'rgba(255, 193, 7, 0.15)', color: '#FFC107' },
  belum: { label: 'Belum Bayar', background: 'rgba(220, 53, 69, 0.12)', color: '#DC3545' },
};

// bankImages now shared from constants

export default function MenungguPembayaranScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params: RouteParams = route?.params ?? {};

  const [bankKey, setBankKey] = useState<RouteParams['bankKey']>(params?.bankKey ?? 'bca');
  const [currentVaNumber, setCurrentVaNumber] = useState(params?.invoiceId ?? '1234567890954322376');
  const [currentStatus, setCurrentStatus] = useState<string>((params?.status ?? 'pending').toLowerCase());
  const [paymentUrl, setPaymentUrl] = useState<string | undefined>(
    () => params?.midtransPaymentUrl || params?.midtransActions?.find(action => action.url)?.url,
  );
  const [pollError, setPollError] = useState<string | null>(null);

  const name = params?.nama ?? 'Nihat Hasannanto';
  const nim = params?.nim ?? '19230211';
  const rincian =
    params?.rincian ?? [
      { label: 'Biaya kuliah pokok', value: 'Rp2.580.000' },
      { label: 'Tambahan jurusan', value: 'Rp700.000' },
      { label: 'Biaya praktikum', value: 'Rp1.200.000' },
      { label: 'Biaya ujian', value: 'Rp300.000' },
      { label: 'Biaya kegiatan mahasiswa', value: 'Rp400.000' },
    ];
  const total = params?.total ?? 'Rp3.280.000';

  const statusInfo = statusMeta[currentStatus] ?? statusMeta.pending;

  const normalizeBankKey = (value?: string | null) => {
    if (!value) return undefined;
    const key = value.toLowerCase() as keyof typeof bankImages;
    return bankImages[key] ? key : undefined;
  };

  // Success toast animation (fadeInDown then fadeOut)
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(-20)).current;
  const [showingToast, setShowingToast] = useState(false);

  const showToast = () => {
    if (showingToast) return;
    setShowingToast(true);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslateY, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(2000),
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 220,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslateY, {
          toValue: -20,
          duration: 220,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => setShowingToast(false));
  };

  const copyVA = () => {
    Clipboard.setString(currentVaNumber);
    showToast();
  };

  const handleOpenPaymentLink = async () => {
    if (!paymentUrl) return;
    try {
      await Linking.openURL(paymentUrl);
      setPollError(null);
    } catch (error) {
      setPollError('Tidak dapat membuka tautan pembayaran.');
    }
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const handleBackToHome = () => {
    navigation.navigate('Main', { initialTab: 'ektm' });
  };

  useEffect(() => {
    if (!params?.paymentId) return undefined;

    let isMounted = true;
    let interval: ReturnType<typeof setInterval>;

    const fetchStatus = async () => {
      try {
        const payment = await paymentService.getPaymentById(params.paymentId!);
        if (!isMounted) return;

        const normalizedStatus = (payment.status ?? '').toLowerCase();
        setCurrentStatus(normalizedStatus);

        const updatedVa = payment.midtransVaNumber || payment.midtransBillKey;
        if (updatedVa) {
          setCurrentVaNumber(updatedVa);
        }

        const updatedBankKey = normalizeBankKey(payment.midtransVaBank);
        if (updatedBankKey) {
          setBankKey(updatedBankKey);
        }

        const actionUrl = payment.midtransActions?.find(item => item.url)?.url;
        if (payment.midtransPaymentUrl) {
          setPaymentUrl(payment.midtransPaymentUrl);
        } else if (actionUrl) {
          setPaymentUrl(actionUrl);
        }

        setPollError(null);

        if (normalizedStatus === 'lunas') {
          const successInvoice = updatedVa || payment.midtransBillKey || params.invoiceId || '1234567890954322376';
          const successBankKey = updatedBankKey ?? params.bankKey ?? 'bca';

          clearInterval(interval);
          navigation.replace('PembayaranSukses', {
            invoiceId: successInvoice,
            nama: params.nama,
            nim: params.nim,
            total: params.total,
            bankKey: successBankKey,
          });
        }
      } catch (error: any) {
        if (!isMounted) return;
        setPollError(error?.message || 'Gagal memeriksa status pembayaran.');
      }
    };

    fetchStatus();
    interval = setInterval(fetchStatus, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [navigation, params?.bankKey, params?.invoiceId, params?.nama, params?.nim, params?.paymentId, params?.total]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Toast Success Copy */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.toast,
          { opacity: toastOpacity, transform: [{ translateY: toastTranslateY }] },
        ]}
      >
        <Image source={require('@icons/berhasil_salin.png')} style={styles.toastImg} />
      </Animated.View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton} activeOpacity={0.7}>
          <View style={styles.backButtonCircle}>
            <ArrowLeft size={18} color="#000000" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rincian Pembayaran</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Animated.ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Illustration + Title */}
        <View style={styles.bannerContainer}>
          <Image source={require('@images/frame_wait.png')} style={styles.bannerImage} />
          <Text style={styles.bannerSubtitle}>Virtual Account Number</Text>
          <View style={styles.vaRow}>
            <Text style={styles.vaNumber}>{currentVaNumber}</Text>
            <TouchableOpacity onPress={copyVA} activeOpacity={0.8}>
              <Files size={24} color="#000000" />
            </TouchableOpacity>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.background }] }>
            <Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
          </View>
          {paymentUrl ? (
            <TouchableOpacity style={styles.paymentLinkButton} onPress={handleOpenPaymentLink} activeOpacity={0.8}>
              <Text style={styles.paymentLinkText}>Bayar via Midtrans</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Profile */}
        <View style={styles.profileCard}>
          <View style={styles.profileSection}>
            <Image source={require('@images/profile.jpeg')} style={styles.profileImage} />
            <View style={[styles.profileInfo, { flex: 1 }] }>
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.profileNim}>{nim}</Text>
            </View>
            <View style={styles.bankBadgeWrapper}>
              <Image source={bankImages[bankKey ?? 'bca']} style={styles.bankBadge} />
            </View>
          </View>
        </View>

        {/* Rincian Pembayaran */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Rincian Pembayaran</Text>
          <View style={styles.detailsList}>
            {rincian.map((item, idx) => (
              <View key={idx} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </View>
          <View style={styles.dashedDivider} />
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Total Biaya</Text>
            <Text style={styles.amountValue}>{total}</Text>
          </View>
        </View>

        {pollError ? <Text style={styles.pollErrorText}>{pollError}</Text> : null}

        <View style={{ height: 140 }} />
      </Animated.ScrollView>

      {/* Footer Button */}
      <View style={styles.footerWrapper}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleBackToHome} activeOpacity={0.8}>
          <IdCard size={24} color={'#FFFFFF'} />
          <Text style={styles.primaryButtonText}>Kembali ke E-KTM</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F0' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 18,
    backgroundColor: '#F0F0F0',
  },
  headerSpacer: { width: 32 },
  backButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  backButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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

  scrollContent: { paddingHorizontal: 32, paddingTop: 8, paddingBottom: 16 },

  // Banner wait
  bannerContainer: { alignItems: 'center', marginTop: 8, marginBottom: 8 },
  bannerImage: { width: 253, height: 215, resizeMode: 'contain' },
  bannerTitle: { marginTop: 6, fontSize: 18, color: '#F59E0B', fontFamily: 'Poppins-Bold' },
  bannerSubtitle: { marginTop: 12, fontSize: 12, color: '#707070', fontFamily: 'Poppins-Medium' },
  vaRow: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 10 },
  vaNumber: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#000000' },
  statusBadge: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  paymentLinkButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#1E69DD',
  },
  paymentLinkText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },

  // Profile card
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
  },
  profileSection: { flexDirection: 'row', alignItems: 'center' },
  profileImage: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E0E0E0' },
  profileInfo: { marginLeft: 8, justifyContent: 'center' },
  profileName: { fontSize: 14, fontFamily: 'Poppins-Medium', fontWeight: '600', color: '#565656', lineHeight: 24 },
  profileNim: { fontSize: 14, fontFamily: 'Poppins-Medium', fontWeight: '500', color: '#565656', lineHeight: 24 },
  bankBadgeWrapper: { marginLeft: 8, alignItems: 'center', justifyContent: 'center' },
  bankBadge: { width: 72, height: 40, resizeMode: 'contain', borderRadius: 12, padding: 6 },

  // Details card
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
  detailsTitle: { fontSize: 16, fontFamily: 'Poppins-SemiBold', fontWeight: '600', color: '#121212', lineHeight: 24, marginBottom: 16 },
  detailsList: { marginTop: 0, gap: 14 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  detailLabel: { fontSize: 12, fontFamily: 'Poppins-Medium', fontWeight: '500', color: '#707070', lineHeight: 18, flex: 1 },
  detailValue: { fontSize: 14, fontFamily: 'Poppins-SemiBold', fontWeight: '600', color: '#000000', lineHeight: 18, textAlign: 'center' },
  dashedDivider: { width: '100%', borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#EDEDED', marginVertical: 8 },
  amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  amountLabel: { fontSize: 12, fontFamily: 'Poppins-Medium', fontWeight: '500', color: '#707070', lineHeight: 18, flex: 1 },
  amountValue: { fontSize: 16, fontFamily: 'Poppins-SemiBold', fontWeight: '500', color: '#1F1F1F', lineHeight: 24, textAlign: 'center' },

  pollErrorText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#D92121',
    textAlign: 'center',
    marginBottom: 16,
  },

  // Footer button
  footerWrapper: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 32, paddingTop: 12, paddingBottom: 24, backgroundColor: 'transparent' },
  primaryButton: { width: '100%', height: 56, backgroundColor: '#1E69DD', borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  primaryButtonText: { fontSize: 16, fontFamily: 'Poppins-SemiBold', fontWeight: '600', color: '#FFFFFF', lineHeight: 24, textAlign: 'center' },

  // Toast styles
  toast: { position: 'absolute', top: 35, alignSelf: 'center', zIndex: 10 },
  toastImg: { width: 206, height: 76, resizeMode: 'contain' },
});


