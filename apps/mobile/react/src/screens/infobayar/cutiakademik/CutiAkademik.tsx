import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, History } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  navigation?: any;
  route?: any;
}

export default function CutiAkademik({ navigation: propNavigation, route }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const [isAgreed, setIsAgreed] = useState(false);

  const handleBackPress = () => {
    if (propNavigation?.goBack) {
      propNavigation.goBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleHistoryPress = () => {
    // Navigate to history screen
    console.log('Navigate to history');
  };

  const handleSubmit = () => {
    if (!isAgreed) return;
    
    // Navigate to form pengajuan screen
    navigation.navigate('FormPengajuan');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#75ABFF" translucent />
      
      {/* Header with Blue Background */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <ArrowLeft color="#FFFFFF" size={24} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleHistoryPress} style={styles.historyButton}>
              <History color="#FFFFFF" size={24} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Cuti Akademik</Text>
            <Text style={styles.subtitle}>Baca persyaratan dan ketentuan yang berlaku</Text>
          </View>
        </SafeAreaView>
      </View>

      {/* White Content Area - Fixed Background */}
      <View style={styles.contentAreaWrapper}>
        <View style={styles.contentArea}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionTitle}>Syarat dan ketentuan</Text>
            
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                Dengan mengajukan cuti akademik, mahasiswa menyatakan telah memahami dan menyetujui ketentuan berikut:{'\n\n'}
                1. Cuti akademik dapat diajukan oleh mahasiswa aktif dengan alasan yang sah, sebelum masa registrasi semester berikutnya berakhir.{'\n\n'}
                2. Selama masa cuti, mahasiswa tidak diperkenankan mengikuti kegiatan akademik atau menggunakan fasilitas kampus.{'\n\n'}
                3. Cuti berlaku untuk satu semester dan dapat diperpanjang maksimal dua kali berturut-turut sesuai kebijakan fakultas.{'\n\n'}
                4. Pengajuan akan diverifikasi oleh bagian akademik dan hasilnya dapat dilihat pada menu Riwayat Pengajuan.{'\n\n'}
                5. Mahasiswa wajib melakukan lapor aktif untuk kembali melanjutkan perkuliahan setelah masa cuti berakhir.{'\n\n'}
                Dengan melanjutkan, Anda menyatakan telah membaca dan menyetujui seluruh syarat dan ketentuan di atas.
              </Text>
            </View>

            {/* Checkbox */}
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setIsAgreed(!isAgreed)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, isAgreed && styles.checkboxChecked]}>
                {isAgreed && (
                  <View style={styles.checkmark} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Saya setuju</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, !isAgreed && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!isAgreed}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>Ajukan Cuti</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

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
  historyButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-end',
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
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#8D8D8D',
    lineHeight: 18,
    marginBottom: 16,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#000000',
    lineHeight: 21, // 1.5 * 14
    textAlign: 'left',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1E69DD',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1E69DD',
  },
  checkmark: {
    width: 8,
    height: 12,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginTop: -3,
    marginLeft: 1,
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#000000',
    lineHeight: 21,
  },
  submitButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#1E69DD',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
  },
});
