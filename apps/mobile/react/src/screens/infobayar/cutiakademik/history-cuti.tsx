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
import { ChevronLeft } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  navigation?: any;
  route?: any;
}

interface LeaveRequestData {
  id: string;
  name: string;
  status: 'proses' | 'disetujui' | 'ditolak';
  program: string;
  semester: string;
  email: string;
  phone: string;
  alasan: string;
  catatan: string;
}

export default function HistoryCuti({ navigation: propNavigation, route }: Props) {
  const navigation = useNavigation<NavigationProp>();

  // Sample data - replace with actual data from API
  const leaveRequests: LeaveRequestData[] = [
    {
      id: '1',
      name: 'Nihat Hasannanto',
      status: 'proses',
      program: 'Sistem Informasi',
      semester: 'Semester 5',
      email: 'nihat@gmail.com',
      phone: '087800010001',
      alasan: '-',
      catatan: '-',
    },
  ];

  const handleBackPress = () => {
    if (propNavigation?.goBack) {
      propNavigation.goBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'proses':
        return { backgroundColor: '#F58220', text: 'Proses' };
      case 'disetujui':
        return { backgroundColor: '#4CAF50', text: 'Disetujui' };
      case 'ditolak':
        return { backgroundColor: '#F44336', text: 'Ditolak' };
      default:
        return { backgroundColor: '#F58220', text: 'Proses' };
    }
  };

  const renderLeaveCard = (item: LeaveRequestData) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <View key={item.id} style={styles.card}>
        {/* Header Section */}
        <View style={styles.cardHeader}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>{item.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
              <Text style={styles.statusText}>{statusStyle.text}</Text>
            </View>
          </View>
          
          <View style={styles.programRow}>
            <Text style={styles.grayText}>{item.program}</Text>
            <Text style={styles.grayText}>{item.semester}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.labelText}>Email</Text>
            <Text style={styles.colonText}>:</Text>
            <Text style={styles.valueText}>{item.email}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.labelText}>No Telepon</Text>
            <Text style={styles.colonText}>:</Text>
            <Text style={styles.valueText}>{item.phone}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.labelText}>Alasan</Text>
            <Text style={styles.colonText}>:</Text>
            <Text style={styles.valueText}>{item.alasan}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.labelText}>Catatan</Text>
            <Text style={styles.colonText}>:</Text>
            <Text style={styles.valueText}>{item.catatan}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#75ABFF" translucent />
      
      {/* Header with Blue Background */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <ChevronLeft color="#FFFFFF" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Riwayat cuti</Text>
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
            {leaveRequests.map(renderLeaveCard)}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#75ABFF',
  },
  header: {
    backgroundColor: '#75ABFF',
    paddingBottom: 30,
  },
  safeAreaHeader: {
    paddingHorizontal: 32,
    paddingTop: 21,
  },
  headerContent: {
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
    color: '#FFFFFF',
    lineHeight: 24,
  },
  contentAreaWrapper: {
    flex: 1,
    marginTop: 20,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    padding: 16,
    paddingBottom: 24,
    marginBottom: 16,
  },
  cardHeader: {
    gap: 8,
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  nameText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#000000',
    lineHeight: 20,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 18,
    textAlign: 'center',
  },
  programRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grayText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '500',
    color: '#838383',
    lineHeight: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginBottom: 16,
  },
  detailsSection: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  labelText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '500',
    color: '#838383',
    lineHeight: 15,
    minWidth: 69,
  },
  colonText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '500',
    color: '#838383',
    lineHeight: 15,
    width: 8,
  },
  valueText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '500',
    color: '#000000',
    lineHeight: 15,
    textAlign: 'right',
    flex: 1,
  },
});

