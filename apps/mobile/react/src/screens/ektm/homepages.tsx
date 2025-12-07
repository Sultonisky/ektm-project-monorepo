import React, { useState, useRef } from 'react';
import {
  View,
  Text as RNText,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  Linking,
  Animated,
  TextProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MapPin, Bell, Lightbulb, User, IdCard, DoorClosed, Phone as PhoneIcon, Mail, Puzzle, GraduationCap, Headset, Pencil } from 'lucide-react-native';
import useAuth from '../../hooks/useAuth';
import { paymentService } from '../../services/api';
import UpdateDataBottomSheet from '../../components/UpdateDataBottomSheet';
import { useNotifications } from '../../providers/NotificationProvider';

const { width } = Dimensions.get('window');

const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const Text = ({ style, ...props }: TextProps) => (
  <RNText style={[{ fontFamily: 'Poppins-Regular' }, style]} {...props} />
);

type PaymentStatusVariant = 'lunas' | 'pending' | 'belum_lunas';

export default function EKtmScreen() {
  const navigation = useNavigation<any>();
  const { mahasiswaProfile, user } = useAuth();
  const { unreadCount } = useNotifications();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusVariant>('pending');
  const [showUpdateSheet, setShowUpdateSheet] = useState(false);

  const currentDate = new Date();
  const studentName = mahasiswaProfile?.name || user?.name || 'Mahasiswa UBSI';
  const firstName = studentName.split(' ')[0] || studentName;
  const nim = mahasiswaProfile?.nim ? String(mahasiswaProfile.nim) : user?.nim ? String(user.nim) : '-';
  const kelas = mahasiswaProfile?.kelas || '-';
  const jurusanName = mahasiswaProfile?.jurusan?.name || 'Program Studi';
  const fakultasName = mahasiswaProfile?.jurusan?.fakultas?.name || 'Fakultas UBSI';
  const campusName = mahasiswaProfile?.jurusan?.fakultas?.campus?.name || 'Kampus UBSI';
  const phone = mahasiswaProfile?.phone || '-';
  const email = mahasiswaProfile?.email || '-';

  const studentIdLine = kelas !== '-' ? `${nim} - ${kelas}` : nim;
  const majorLine = jurusanName ? `S1 • ${jurusanName}` : 'Program Studi';
  const dateLabel = `${monthNames[currentDate.getMonth()]}, ${currentDate.getFullYear()}`;

  const studentDetail = {
    personal: {
      fullName: studentName,
      nim,
      kelas,
      phone,
      email,
    },
    academic: {
      fakultas: fakultasName,
      jurusan: jurusanName,
      kampus: campusName,
    },
  };

  const mapStatus = (status?: string): PaymentStatusVariant => {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'lunas') return 'lunas';
    if (normalized === 'pending') return 'pending';
    return 'belum_lunas';
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      // Reset status to pending when user changes or screen focuses
      setPaymentStatus('pending');

      const loadPaymentStatus = async () => {
        if (!user?.id) {
          if (isActive) setPaymentStatus('belum_lunas');
          return;
        }
        try {
          const paymentList = await paymentService.getAllPayments(user.id);
          if (!isActive) return;
          if (!paymentList.length) {
            // Jika tidak ada payment sama sekali, berarti belum pernah melakukan pembayaran
            setPaymentStatus('belum_lunas');
            return;
          }
          const latest = paymentList[0];
          setPaymentStatus(mapStatus(latest.status));
        } catch (error) {
          console.error('Failed to load payment status:', error);
          if (isActive) setPaymentStatus('belum_lunas');
        }
      };

      loadPaymentStatus();

      return () => {
        isActive = false;
      };
    }, [user?.id]),
  );

  const getCardImage = () => {
    switch (paymentStatus) {
      case 'lunas':
        return require('@images/card_lunas.png');
      case 'pending':
        return require('@images/card_pending.png');
      case 'belum_lunas':
      default:
        return require('@images/card_belum_lunas.png');
    }
  };

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const gradientOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
    },
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Gradient dengan Animasi */}
      <Animated.View 
        style={[
          styles.gradientContainer,
          {
            opacity: gradientOpacity,
          },
        ]}
      >
        {/* Background Biru untuk bagian atas */}
        {/* <View style={styles.blueBackground} /> */}
        {/* Background Abu untuk bagian bawah dengan transisi */}
        <View style={styles.grayBackground} />
      </Animated.View>

      {/* AppBar */}
      <Animated.View 
        style={[
          styles.appbar,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          },
        ]}
      >
        {/* Welcome message container */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcome}>
            Welcome Back, <Text style={styles.welcomeName}>{firstName}</Text>👋
          </Text>
          <View style={styles.locationContainer}>
            <Image
              source={require('@icons/mdi_location.png')}
              style={styles.locationIcon}
            />
            <Text style={styles.location}>{campusName}</Text>
          </View>
        </View>

        {/* Notification and customer service icons */}
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            onPress={() => {
              const phoneNumber = '62895395295511';
              const message = encodeURIComponent('Halo Admin, izin bertanya...');
              Linking.openURL(`https://wa.me/${phoneNumber}?text=${message}`);
            }}
            style={styles.iconBtn}
          >
            <Headset color="#1E69DD" size={24} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Notification')} style={styles.notificationBtn}>
            <Bell color="#1E69DD" size={20} />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                {unreadCount > 9 ? (
                  <Text style={styles.notificationBadgeText}>9+</Text>
                ) : (
                  <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Content */}
      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={{ height: 50 }} />

        {/* e-KTM Card */}
        <View style={styles.card}>
          <Image
            source={getCardImage()}
            style={styles.cardBackground}
            resizeMode="cover"
          />
          <View style={styles.cardContent}>
            {/* Name - Position: left: 16px, top: 32px */}
            <Text style={[styles.cardName, styles.cardNamePosition]}>
              {studentName}
            </Text>
            
            {/* ID Numbers - Position: left: 16px, top: 70px */}
            <Text style={[styles.cardSub, styles.cardSubPosition]}>
              {studentIdLine}
            </Text>
            <Text style={[styles.cardMajor, styles.cardMajorPosition]}>
              {majorLine}
            </Text>
            
            {/* Date - Position: left: 280px, top: 146px */}
            <Text style={[styles.cardDate, styles.cardDatePosition]}>
              {dateLabel}
            </Text>
          </View>
        </View>

        <View style={{ height: 30 }} />

        {/* Kegiatan Perkuliahan */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kegiatan Perkuliahan</Text>
          <Text style={{ color: '#000' }}>➔</Text>
        </View>
        <View style={{ height: 15 }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={styles.carouselCardContainer}
            onPress={() => navigation.navigate('JadwalPerkuliahan')}
            activeOpacity={0.7}
          >
            <Image
              source={require('@images/Rectangle.png')}
              style={styles.carouselCardBackground}
              resizeMode="cover"
            />
            <View style={styles.carouselCardContent}>
              <Text style={styles.carouselTitle}>Jadwal Perkuliahan</Text>
              <View style={styles.carouselBottomRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Lightbulb color="#FFD600" size={14} />
                  <View style={{ width: 6 }} />
                  <Text style={styles.carouselChipText}>{studentDetail.academic.jurusan}</Text>
                </View>
                <View style={styles.carouselChipBlue}><Text style={styles.carouselChipBlueText}>Aktif</Text></View>
              </View>
            </View>
          </TouchableOpacity>

          <View style={{ width: 10 }} />

          <View style={styles.carouselCardContainer}>
            <Image
              source={require('@images/Rectangle2.png')}
              style={styles.carouselCardBackground}
              resizeMode="cover"
            />
            <View style={styles.carouselCardContent}>
              <Text style={styles.carouselTitle}>Kalender Akademik</Text>
              <View style={styles.carouselBottomRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Lightbulb color="#FFD600" size={14} />
                  <View style={{ width: 6 }} />
                  <Text style={styles.carouselChipText}>Universitas BSI</Text>
                </View>
                <View style={styles.carouselChipCyan}><Text style={styles.carouselChipBlueText}>Terbaru</Text></View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={{ height: 20 }} />

        {/* Data Mahasiswa */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Data Mahasiswa</Text>
          <TouchableOpacity 
            style={styles.updateBtn}
            onPress={() => setShowUpdateSheet(true)}
          >
            <Pencil color="#fff" size={14} />
            <Text style={styles.updateBtnText}>Update Data</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 10 }} />
        <Text style={styles.sectionSubtitle}>Data Personal</Text>
        <View style={{ height: 8 }} />
        <View style={styles.infoCardBlue}>
          {renderInfoRow(<User color="#fff" size={18} />, 'Nama Lengkap', studentDetail.personal.fullName)}
          <View style={styles.divider} />
          {renderInfoRow(<IdCard color="#fff" size={18} />, 'Nomor Induk Mahasiswa', studentDetail.personal.nim)}
          <View style={styles.divider} />
          {renderInfoRow(<DoorClosed color="#fff" size={18} />, 'Kelas', studentDetail.personal.kelas)}
          <View style={styles.divider} />
          {renderInfoRow(<PhoneIcon color="#fff" size={18} />, 'Phone', studentDetail.personal.phone)}
          <View style={styles.divider} />
          {renderInfoRow(<Mail color="#fff" size={18} />, 'Email', studentDetail.personal.email)}
        </View>

        <View style={{ height: 20 }} />
        <Text style={styles.sectionSubtitle}>Data Akademik</Text>
        <View style={{ height: 8 }} />
        <View style={styles.infoCardBlueAlt}>
          {renderInfoRow(<Puzzle color="#fff" size={18} />, 'Fakultas', studentDetail.academic.fakultas)}
          <View style={styles.divider} />
          {renderInfoRow(<GraduationCap color="#fff" size={18} />, 'Jurusan', studentDetail.academic.jurusan)}
          <View style={styles.divider} />
          {renderInfoRow(<MapPin color="#fff" size={18} />, 'Kampus', studentDetail.academic.kampus)}
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Update Data Bottom Sheet */}
      <UpdateDataBottomSheet 
        visible={showUpdateSheet}
        onClose={() => setShowUpdateSheet(false)}
      />

    </SafeAreaView>
  );
}

function renderInfoRow(icon: React.ReactNode, label: string, value: string) {
  return (
    <View style={styles.infoRow}>
      <View style={{ marginTop: 2, marginRight: 8 }}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F0F0F0' },

  // Gradient Background Styles
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  blueBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '25%',
    backgroundColor: '#75ABFF',
    shadowColor: '#75ABFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  grayBackground: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F0F0F0',
    // Efek blur/kabut untuk transisi
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#75ABFF',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  // AppBar styles - Clean and refined layout
  appbar: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    height: 70,
    left: 0,
    top: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  // Welcome message container
  welcomeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
  },

  welcome: {
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
    marginTop: 22,
  },
  welcomeName: {
    color: '#1E69DD',
    fontFamily: 'Poppins-Bold',
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationIcon: {
    width: 20,
    height: 20,
  },
  location: {
    fontSize: 14,
    color: '#1E69DD',
    opacity: 0.9,
    fontFamily: 'Poppins-SemiBold',
  },

  // Notification and customer service icons
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  iconBtn: {
    width: 58,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },

  notificationBtn: {
    width: 58,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },

  notificationBadge: {
    position: 'absolute',
    minWidth: 18,
    height: 18,
    right: 12,
    top: 12,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 9,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 90,
    paddingTop: 75,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  card: {
    width: width - 40,
    minHeight: 200,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  cardBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  cardContent: {
    position: 'relative',
    width: '100%',
    height: 181,
    zIndex: 1,
  },
  cardName: { color: '#fff', fontSize: 20, fontFamily: 'Poppins-SemiBold', lineHeight: 30 },
  cardNamePosition: { position: 'absolute', left: 32, top: 48 },
  cardSub: { color: '#fff', fontSize: 12, fontFamily: 'Poppins-Medium', lineHeight: 18 },
  cardSubPosition: { position: 'absolute', left: 32, top: 83 },
  cardMajor: { fontSize: 16, color: '#fff', fontFamily: 'Poppins-Medium', lineHeight: 24 },
  cardMajorPosition: { position: 'absolute', left: 32, top: 143 },
  cardDate: { fontSize: 12, color: '#FFFFFF', fontFamily: 'Poppins-Regular', lineHeight: 18 },
  cardDatePosition: { position: 'absolute', right: 32, top: 143 },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 2,
  },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'green', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { color: '#fff', fontFamily: 'Poppins-Bold' },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#000' },
  sectionSubtitle: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#000' },

  carouselCardContainer: {
    width: 212,
    height: 85,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  carouselCardBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  carouselCardContent: {
    padding: 12,
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  carouselTitle: { fontSize: 14, color: '#fff', fontFamily: 'Poppins-Bold' },
  carouselBottomRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  carouselChipText: { fontSize: 10, color: '#fff', fontFamily: 'Poppins-Bold' },
  carouselChipBlue: { backgroundColor: '#57D4D4', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 4 },
  carouselChipCyan: { backgroundColor: '#1E69DD', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 4 },
  carouselChipBlueText: { fontSize: 10, color: '#fff', fontFamily: 'Poppins-Regular' },

  updateBtn: { backgroundColor: '#1E69DD', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  updateBtnText: { color: '#fff', fontSize: 12, fontFamily: 'Poppins-Medium' },

  infoCardBlue: { backgroundColor: '#1E69DD', borderRadius: 20, padding: 16 },
  infoCardBlueAlt: { backgroundColor: '#1E69DD', borderRadius: 20, padding: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.4)', marginVertical: 10 },
  infoLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Poppins-Regular' },
  infoValue: { color: '#fff', fontSize: 14, fontFamily: 'Poppins-SemiBold' },

});


