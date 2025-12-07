import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

const SyaratDanKetentuanScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#75ABFF" translucent />
      
      {/* Header with Blue Background */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ChevronLeft color="#FFFFFF" size={24} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Syarat dan Ketentuan</Text>
            <Text style={styles.subtitle}>
              Selamat datang di Aplikasi EKTM UBSI. Dengan menggunakan aplikasi ini, Anda menyetujui syarat dan ketentuan yang berlaku. Mohon untuk membaca dengan seksama sebelum menggunakan aplikasi ini.
            </Text>
          </View>
        </SafeAreaView>
      </View>

      {/* White Content Area */}
      <View style={styles.contentAreaWrapper}>
        <View style={styles.contentArea}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sectionsWrapper}>
            
            {/* Section 1: Definisi */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Definisi</Text>
              <Text style={styles.sectionContent}>
                • Aplikasi EKTM UBSI adalah layanan digital resmi dari Universitas Bina Sarana Informatika (UBSI) yang digunakan oleh mahasiswa untuk mengakses kartu tanda mahasiswa dalam bentuk elektronik serta layanan akademik terkait.{'\n\n'}
                • Pengguna adalah mahasiswa aktif, dosen, atau pihak berwenang UBSI yang mengakses dan menggunakan aplikasi ini.{'\n\n'}
                • Data Pribadi mencakup informasi seperti nama, NIM, program studi, foto, dan data akademik lainnya yang dikumpulkan dan dikelola oleh pihak universitas.
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Section 2: Penggunaan Aplikasi */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Penggunaan Aplikasi</Text>
              <Text style={styles.sectionContent}>
                • Aplikasi hanya boleh digunakan oleh mahasiswa aktif UBSI dengan akun resmi yang telah diverifikasi.{'\n\n'}
                • Pengguna wajib menjaga kerahasiaan akun dan kata sandi. Segala aktivitas yang terjadi melalui akun pengguna menjadi tanggung jawab pengguna sepenuhnya.{'\n\n'}
                • Penggunaan aplikasi ini hanya untuk keperluan akademik dan administratif yang berhubungan dengan kegiatan di lingkungan UBSI.{'\n\n'}
                • Dilarang menggunakan aplikasi untuk tujuan yang melanggar hukum, menipu, atau merugikan pihak lain.
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Section 3: Hak dan Kewajiban Pengguna */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Hak dan Kewajiban Pengguna</Text>
              <Text style={styles.sectionContent}>
                • Pengguna berhak mengakses dan menggunakan fitur aplikasi sesuai peran dan status akademiknya.{'\n\n'}
                • Pengguna wajib memberikan data yang benar, lengkap, dan terbaru.{'\n\n'}
                • Pengguna tidak diperbolehkan memodifikasi, menyalin, atau mendistribusikan aplikasi tanpa izin tertulis dari pihak UBSI.{'\n\n'}
                • Penyalahgunaan fitur atau akses ilegal terhadap sistem akan dikenai sanksi sesuai dengan peraturan kampus dan hukum yang berlaku.
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Section 4: Privasi dan Keamanan Data */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Privasi dan Keamanan Data</Text>
              <Text style={styles.sectionContent}>
                • UBSI berkomitmen untuk melindungi data pribadi pengguna sesuai dengan peraturan perundang-undangan yang berlaku.{'\n\n'}
                • Data yang dikumpulkan akan digunakan untuk keperluan operasional akademik dan tidak akan dibagikan kepada pihak ketiga tanpa persetujuan pengguna, kecuali diwajibkan oleh hukum.{'\n\n'}
                • Pengguna bertanggung jawab atas keamanan perangkat dan akun masing-masing.
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Section 5: Perubahan Syarat dan Ketentuan */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Perubahan Syarat dan Ketentuan</Text>
              <Text style={styles.sectionContent}>
                • UBSI berhak mengubah atau memperbarui syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya.{'\n\n'}
                • Pengguna diharapkan untuk secara berkala memeriksa halaman ini untuk mengetahui perubahan terbaru.{'\n\n'}
                • Dengan tetap menggunakan aplikasi setelah adanya perubahan, pengguna dianggap telah menerima perubahan tersebut.
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Section 6: Kontak */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Kontak</Text>
              <Text style={styles.sectionContent}>
                Jika Anda memiliki pertanyaan atau membutuhkan bantuan terkait syarat dan ketentuan ini, silakan hubungi:{'\n\n'}
                Universitas Bina Sarana Informatika{'\n'}
                Email: info@ubsi.ac.id{'\n'}
                Website: www.ubsi.ac.id
              </Text>
            </View>

          </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#75ABFF',
    paddingBottom: 130,
  },
  safeAreaHeader: {
    paddingHorizontal: 32,
    paddingTop: 21,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 36,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  contentAreaWrapper: {
    flex: 1,
    marginTop: -120,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 40,
  },
  sectionsWrapper: {
    width: '100%',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 36,
    color: '#000000',
    marginBottom: 12,
  },
  sectionContent: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: '#000000',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#D9D9D9',
    marginTop: 16,
    marginBottom: 24,
  },
});

export default SyaratDanKetentuanScreen;

