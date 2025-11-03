import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IdCard } from 'lucide-react-native';
import { bankImages } from '../../../constants/bank';

type RouteParams = {
  invoiceId?: string;
  bankKey?: 'bca' | 'bni' | 'bri' | 'bsi' | 'cimb' | 'mandiri' | 'permata';
  nama?: string;
  nim?: string;
  rincian?: { label: string; value: string }[];
  total?: string;
};

// bankImages now shared from constants

export default function PembayaranSuksesScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params: RouteParams = route?.params ?? {};

  const name = params?.nama ?? 'Nihat Hasannanto';
  const nim = params?.nim ?? '19230211';
  const bankKey = params?.bankKey ?? 'bca';
  const invoiceId = params?.invoiceId ?? '1234567890954322376';
  const rincian =
    params?.rincian ?? [
      { label: 'Biaya kuliah pokok', value: 'Rp2.580.000' },
      { label: 'Tambahan jurusan', value: 'Rp700.000' },
      { label: 'Biaya praktikum', value: 'Rp1.200.000' },
      { label: 'Biaya ujian', value: 'Rp300.000' },
      { label: 'Biaya kegiatan mahasiswa', value: 'Rp400.000' },
    ];
  const total = params?.total ?? 'Rp3.280.000';

  const goHome = () => {
    navigation.navigate('Main', { initialTab: 'ektm' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Banner Sukses tanpa header */}
      <View style={styles.bannerContainer}>
        <Image source={require('@images/frame_sukses.png')} style={styles.bannerImage} />
        <Text style={styles.bannerTitle}>Sukses</Text>
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
            <Image source={bankImages[bankKey]} style={styles.bankBadge} />
          </View>
        </View>
      </View>

      {/* Rincian Pembayaran */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Rincian Pembayaran</Text>
        {/* Optional invoice row (boleh di-hide jika tidak diperlukan) */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Invoice</Text>
          <Text style={styles.detailValue}>{invoiceId}</Text>
        </View>
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

      <View style={{ height: 140 }} />

      {/* Footer */}
      <View style={styles.footerWrapper}>
        <TouchableOpacity style={styles.primaryButton} onPress={goHome} activeOpacity={0.8}>
          <IdCard size={24} color={'#FFFFFF'} />
          <Text style={styles.primaryButtonText}>Kembali ke E-KTM</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F0' },

  // Banner sukses
  bannerContainer: { alignItems: 'center', marginTop: 8 },
  bannerImage: { width: 212, height: 223, resizeMode: 'contain' },
  bannerTitle: { marginTop: 6, fontSize: 18, color: '#11B058', fontFamily: 'Poppins-Bold' },

  // Profile card (sama seperti Menunggu)
  profileCard: { backgroundColor: '#FFFFFF', borderRadius: 24, paddingVertical: 12, paddingHorizontal: 16, marginTop: 20, marginBottom: 16 },
  profileSection: { flexDirection: 'row', alignItems: 'center' },
  profileImage: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E0E0E0' },
  profileInfo: { marginLeft: 8, justifyContent: 'center' },
  profileName: { fontSize: 14, fontFamily: 'Poppins-Medium', fontWeight: '600', color: '#565656', lineHeight: 24 },
  profileNim: { fontSize: 14, fontFamily: 'Poppins-Medium', fontWeight: '500', color: '#565656', lineHeight: 24 },
  bankBadgeWrapper: { marginLeft: 8, alignItems: 'center', justifyContent: 'center' },
  bankBadge: { width: 72, height: 40, resizeMode: 'contain', borderRadius: 12, padding: 6 },

  // Details card (sama seperti Menunggu)
  detailsCard: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 24, paddingHorizontal: 18, paddingVertical: 20, marginTop: 8, marginBottom: 24, shadowColor: '#AAA', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 8 },
  detailsTitle: { fontSize: 16, fontFamily: 'Poppins-SemiBold', fontWeight: '600', color: '#121212', lineHeight: 24, marginBottom: 16 },
  detailsList: { marginTop: 0, gap: 14 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  detailLabel: { fontSize: 12, fontFamily: 'Poppins-Medium', fontWeight: '500', color: '#707070', lineHeight: 18, flex: 1 },
  detailValue: { fontSize: 14, fontFamily: 'Poppins-SemiBold', fontWeight: '600', color: '#000000', lineHeight: 18, textAlign: 'center' },
  dashedDivider: { width: '100%', borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#EDEDED', marginVertical: 8 },
  amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  amountLabel: { fontSize: 12, fontFamily: 'Poppins-Medium', fontWeight: '500', color: '#707070', lineHeight: 18, flex: 1 },
  amountValue: { fontSize: 16, fontFamily: 'Poppins-SemiBold', fontWeight: '500', color: '#1F1F1F', lineHeight: 24, textAlign: 'center' },

  // Footer button
  footerWrapper: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 32, paddingTop: 12, paddingBottom: 24 },
  primaryButton: { width: '100%', height: 56, backgroundColor: '#1E69DD', borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  primaryButtonText: { fontSize: 16, fontFamily: 'Poppins-SemiBold', fontWeight: '600', color: '#FFFFFF', lineHeight: 24, textAlign: 'center' },
});


