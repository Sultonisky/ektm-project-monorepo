import React from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

const TentangScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ArrowLeft size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tentang</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Image source={require('../../../assets/images/logo_about.png')} style={styles.logo} resizeMode="contain" />

          <Text style={styles.sectionTitle}>Tentang Aplikasi</Text>
          <View style={styles.infoGroup}>
            <InfoRow label="Nama Aplikasi" value="EKTM Mobile" />
            <InfoRow label="Versi" value="1.0.0" />
            <InfoRow label="Dikembangkan oleh" value="Kelompok 3 (Pembangun Negeri) – Mata Kuliah Mobile Programming II" />
            <InfoRow label="Program Studi" value="Teknik dan Informatika" />
            <InfoRow label="Jurusan" value="Sistem Informasi" />
            <InfoRow label="Universitas" value="Universitas Bina Sarana Informatika" />
            <InfoRow label="Tahun Pengembangan" value="2025" />
          </View>

          <Text style={styles.sectionTitle}>Deskripsi Aplikasi</Text>
          <Text style={styles.paragraph}>
            Aplikasi EKTM Mobile merupakan aplikasi berbasis mobile yang dikembangkan sebagai proyek Tugas Akhir untuk mata kuliah Mobile Programming II. Tujuan utama dari aplikasi ini adalah untuk memudahkan mahasiswa dalam mengakses, melihat, dan mengelola data Kartu Tanda Mahasiswa Elektronik (e-KTM) secara digital melalui perangkat iOS.
          </Text>
          <Text style={styles.paragraph}>
            Dengan adanya aplikasi ini, mahasiswa tidak perlu lagi membawa KTM fisik untuk keperluan administrasi atau verifikasi identitas di lingkungan kampus. Semua data identitas mahasiswa dapat diakses secara cepat dan aman langsung melalui perangkat mobile.
          </Text>

          <Text style={styles.sectionTitle}>Tim Pengembang</Text>
          <View style={styles.teamList}>
            <Text style={styles.teamItem}>• <Text style={styles.teamRole}>Project Manager</Text> - Nihat Hasananto</Text>
            <Text style={styles.teamItem}>• <Text style={styles.teamRole}>Backend Developer</Text> - Moh Sultoni</Text>
            <Text style={styles.teamItem}>• <Text style={styles.teamRole}>Frontend Developer</Text> - Rizki Erlangga</Text>
            <Text style={styles.teamItem}>• <Text style={styles.teamRole}>UI/UX Designer</Text> - M Raihan Nafis</Text>
            <Text style={styles.teamItem}>• <Text style={styles.teamRole}>System Analyst</Text> - Rafi Akbar S</Text>
            <Text style={styles.teamItem}>• <Text style={styles.teamRole}>QA/Tester</Text> - Rifqi Hisyam F</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

type InfoRowProps = { label: string; value: string };
const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 33,
    backgroundColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'Poppins-Bold',
  },
  contentContainer: {
    padding: 22,
    paddingBottom: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 33,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  logo: {
    width: 250,
    height: 180,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginTop: 12,
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  infoGroup: {
    gap: 4,
  },
  infoRow: {
    marginBottom: 4,
  },
  infoLabel: {
    color: '#666666',
    fontSize: 12,
    marginBottom: 2,
    fontFamily: 'Poppins-Regular',
  },
  infoValue: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  paragraph: {
    color: '#333333',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  teamList: {
    marginTop: 4,
    gap: 6,
  },
  teamItem: {
    color: '#333333',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  teamRole: {
    color: '#666666',
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default TentangScreen;


