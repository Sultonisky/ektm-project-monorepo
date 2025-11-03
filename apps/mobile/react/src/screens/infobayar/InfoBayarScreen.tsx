import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Bell, Headphones, Lightbulb, IdCard, CarFront, ClipboardClock , Footprints, Medal, Trophy, GraduationCap, FileCheck, BookOpen, Package, FileEdit } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

interface Props {
  navigation?: any;
  route?: any;
}

export default function InfoBayarScreen({ navigation: propNavigation, route }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  // Reset selected highlight whenever this screen regains focus
  useFocusEffect(React.useCallback(() => {
    setSelectedItem(null);
  }, []));
  
  // Mock payment menu data
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

  const handleBackPress = () => {
    if (propNavigation?.goBack) {
      propNavigation.goBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleNotificationPress = () => {
    // Navigate to notification screen
    console.log('Navigate to notification');
  };

  const handleCustomerServicePress = () => {
    const phoneNumber = '62895395295511';
    const message = encodeURIComponent('Halo Admin, izin bertanya...');
    Linking.openURL(`https://wa.me/${phoneNumber}?text=${message}`);
  };

  const handlePaymentItemPress = (itemId: string) => {
    // Navigate to payment detail screen based on itemId
    console.log('Navigate to payment:', itemId);
    if (itemId === 'biaya-kuliah') {
      // Navigate to Rincian Pembayaran screen
      navigation.navigate('RincianPembayaran', {
        nama: 'Nihat Hasannanto',
        nim: '19230211',
        rincian: [
          { label: 'Biaya Kuliah Pokok', value: 'Rp2.580.000' },
          { label: 'Tambahan Jurusan', value: 'Rp700.000' },
          { label: 'Biaya Praktikum', value: 'Rp1.200.000' },
          { label: 'Biaya Ujian', value: 'Rp300.000' },
          { label: 'Biaya Kegiatan Mahasiswa', value: 'Rp400.000' },
        ],
        total: 'Rp3.280.000',
      });
    } else if (itemId === 'cuti-akademik') {
      // Navigate to Cuti Akademik screen
      navigation.navigate('CutiAkademik');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowLeft color="#000" size={24} />
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
        {/* Tentang Info Bayar Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tentang Info Bayar</Text>
          <Text style={styles.sectionArrow}>➔</Text>
        </View>
        
        <View style={{ height: 15 }} />
        
        {/* Carousel */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* History Pembayaran Card */}
          <View style={styles.carouselCard}>
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
                  <Text style={styles.carouselBadgeText}>8x Pembayaran</Text>
                </View>
              </View>
            </View>
          </View>

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
                    color={isSelected ? "#1E69DD" : "#FFFFFF"} 
                    size={24} 
                  />
                </View>
                <Text style={[
                  styles.paymentLabel,
                  isSelected && styles.paymentLabelSelected
                ]}>{item.label}</Text>
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
  
  // Header
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
  
  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  
  // Section Header
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
  
  // Carousel
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
  
  // Payment Menu Grid
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

