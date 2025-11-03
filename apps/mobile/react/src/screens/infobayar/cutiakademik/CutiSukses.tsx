import React from 'react';
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
import { CheckCircle } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  navigation?: any;
  route?: any;
}

export default function CutiSukses({ navigation: propNavigation, route }: Props) {
  const navigation = useNavigation<NavigationProp>();

  const handleBackToHome = () => {
    navigation.navigate('Main');
  };

  const handleBackToCutiAkademik = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('CutiAkademik');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#75ABFF" translucent />
      
      {/* Header with Blue Background */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              onPress={handleBackToCutiAkademik} 
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.headerSpacer} />
          </View>
        </SafeAreaView>
      </View>

      {/* Content Area */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successContainer}>
          <View style={styles.iconContainer}>
            <CheckCircle color="#22C55E" size={80} fill="#22C55E" />
          </View>
          
          <Text style={styles.successTitle}>Pengajuan Cuti Berhasil!</Text>
          
          <Text style={styles.successMessage}>
            Pengajuan cuti akademik Anda telah berhasil dikirim. Tim akan meninjau pengajuan Anda dan akan memberikan konfirmasi melalui email atau notifikasi.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleBackToCutiAkademik}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Kembali</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleBackToHome}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Ke Beranda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    backgroundColor: '#75ABFF',
    paddingBottom: 20,
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
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 32,
  },
  successContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#667085',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#1E69DD',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#F2F4F7',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#475467',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
});

