import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  navigation?: any;
  route?: any;
}

export default function CutiSukses({ navigation: propNavigation, route }: Props) {
  const navigation = useNavigation<NavigationProp>();

  const handleBackPress = () => {
    if (propNavigation?.goBack) {
      propNavigation.goBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleBackToHome = () => {
    navigation.navigate('Main');
  };

  const handleViewHistory = () => {
    // Navigate to history/riwayat cuti
    navigation.navigate('HistoryCuti');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#75ABFF" translucent />
    
      
      {/* Header with Back Button */}
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <ChevronLeft color="#000000" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Form pengajuan cuti</Text>
        </View>

      </SafeAreaView>

      {/* Content Area */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../../../assets/images/cuti-proses.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.labelText}>Pengajuan Cuti</Text>
          <Text style={styles.statusTitle}>Diproses</Text>
        </View>
        
        {/* Message */}
        <Text style={styles.successMessage}>
          Kamu akan menerima notifikasi dan email saat pengajuanmu diproses.
        </Text>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Cek status pengajuan di halaman Riwayat.
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity
          onPress={handleBackToHome}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Kembali ke Beranda</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  safeArea: {
    paddingHorizontal: 32,
    paddingTop: 21,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '500',
    color: '#000000',
    lineHeight: 24,
    textAlign: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 30,
    paddingHorizontal: 32,
  },
  stepCircleCompleted: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E69DD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberCompleted: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 21,
    textAlign: 'center',
  },
  stepperDash: {
    width: 24,
    height: 1.5,
    backgroundColor: '#1E69DD',
  },
  stepActiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#1E69DD',
    borderRadius: 100,
    gap: 4,
  },
  stepCircleActive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberActive: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#000000',
    lineHeight: 18,
    textAlign: 'center',
  },
  stepLabelActive: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 32,
    alignItems: 'center',
  },
  illustrationContainer: {
    width: 393,
    height: 393,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  labelText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#8D8D8D',
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 0,
  },
  statusTitle: {
    fontSize: 32,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#F58220',
    lineHeight: 48,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '500',
    color: '#000000',
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 16,
    width: '100%',
  },
  infoBox: {
    width: '100%',
    backgroundColor: 'rgba(87, 212, 212, 0.2)',
    borderLeftWidth: 2,
    borderLeftColor: '#57D4D4',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '500',
    color: '#000000',
    lineHeight: 18,
    textAlign: 'left',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#1E69DD',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
  },
});

