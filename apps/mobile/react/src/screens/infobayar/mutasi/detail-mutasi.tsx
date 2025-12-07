import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronDown, History, X } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  navigation?: any;
  route?: any;
}

// Data kampus
const KAMPUS_LIST = [
  { id: '1', name: 'UBSI Kampus Kramat 98' },
  { id: '2', name: 'UBSI Kampus Salemba 22' },
  { id: '3', name: 'UBSI Kampus Pemuda' },
  { id: '4', name: 'UBSI Kampus Kalimalang' },
  { id: '5', name: 'UBSI Kampus Cikини' },
  { id: '6', name: 'UBSI Kampus Bekasi' },
  { id: '7', name: 'UBSI Kampus Tangerang' },
  { id: '8', name: 'UBSI Kampus Bogor' },
  { id: '9', name: 'UBSI Kampus Depok' },
  { id: '10', name: 'UBSI Kampus Bandung' },
];

export default function DetailMutasi({ navigation: propNavigation, route }: Props) {
  const navigation = useNavigation<NavigationProp>();
  
  const [kampusAsal, setKampusAsal] = useState('');
  const [kampusMutasi, setKampusMutasi] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [nik, setNik] = useState('');
  const [namaAyah, setNamaAyah] = useState('');
  const [namaIbu, setNamaIbu] = useState('');
  const [namaWali, setNamaWali] = useState('');
  
  // Dropdown states
  const [showKampusAsalModal, setShowKampusAsalModal] = useState(false);
  const [showKampusMutasiModal, setShowKampusMutasiModal] = useState(false);

  const handleBackPress = () => {
    if (propNavigation?.goBack) {
      propNavigation.goBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleHistoryPress = () => {
    console.log('Navigate to history');
  };

  const handleSelectKampusAsal = (kampusName: string) => {
    setKampusAsal(kampusName);
    setShowKampusAsalModal(false);
  };

  const handleSelectKampusMutasi = (kampusName: string) => {
    setKampusMutasi(kampusName);
    setShowKampusMutasiModal(false);
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!kampusAsal || !kampusMutasi || !namaLengkap || !nim || !email || !noTelp || !nik || !namaAyah || !namaIbu) {
      Alert.alert('Perhatian', 'Harap lengkapi semua field yang wajib');
      return;
    }

    console.log('Submit form mutasi');
    // Navigate to success screen or process the form
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
            
            <Text style={styles.headerTitle}>Mutasi Kampus</Text>
            
            <TouchableOpacity onPress={handleHistoryPress} style={styles.historyButton}>
              <History color="#FFFFFF" size={24} />
            </TouchableOpacity>
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
            <Text style={styles.formTitle}>Silahkan isi form dibawah ini dengan benar</Text>
            
            {/* Default Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Default</Text>
              
              {/* Kampus Asal */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Kampus Asal</Text>
                <TouchableOpacity 
                  style={styles.dropdownInput}
                  onPress={() => setShowKampusAsalModal(true)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownText, !kampusAsal && styles.placeholderText]}>
                    {kampusAsal || 'Pilih kampus'}
                  </Text>
                  <ChevronDown color="#8D8D8D" size={12} />
                </TouchableOpacity>
              </View>

              {/* Kampus Mutasi */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Kampus Mutasi</Text>
                <TouchableOpacity 
                  style={styles.dropdownInput}
                  onPress={() => setShowKampusMutasiModal(true)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownText, !kampusMutasi && styles.placeholderText]}>
                    {kampusMutasi || 'Pilih kampus'}
                  </Text>
                  <ChevronDown color="#8D8D8D" size={12} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Data Diri Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Diri</Text>
              
              {/* Nama Lengkap */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nama Lengkap</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Masukan nama lengkap"
                  placeholderTextColor="#BBBBBB"
                  value={namaLengkap}
                  onChangeText={setNamaLengkap}
                />
              </View>

              {/* NIM */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>NIM</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Masukan NIM"
                  placeholderTextColor="#BBBBBB"
                  value={nim}
                  onChangeText={setNim}
                  keyboardType="numeric"
                />
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Masukan emal"
                  placeholderTextColor="#BBBBBB"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* No Telp */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>No Telp</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Masukan no. telp"
                  placeholderTextColor="#BBBBBB"
                  value={noTelp}
                  onChangeText={setNoTelp}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Data Pendukung Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Pendukung</Text>
              
              {/* NIK */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>NIK</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Masukan NIK anda"
                  placeholderTextColor="#BBBBBB"
                  value={nik}
                  onChangeText={setNik}
                  keyboardType="numeric"
                />
              </View>

              {/* Nama Ayah */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nama Ayah</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Masukan nama ayah"
                  placeholderTextColor="#BBBBBB"
                  value={namaAyah}
                  onChangeText={setNamaAyah}
                />
              </View>

              {/* Nama Ibu */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nama Ibu</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Masukan nama ibu"
                  placeholderTextColor="#BBBBBB"
                  value={namaIbu}
                  onChangeText={setNamaIbu}
                />
              </View>

              {/* Nama Wali (Optional) */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nama Wali (opsional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="(opsional)"
                  placeholderTextColor="#BBBBBB"
                  value={namaWali}
                  onChangeText={setNamaWali}
                />
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Fixed Button at Bottom */}
        <View style={styles.footerWrapper}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Selanjutnya</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Kampus Asal */}
      <Modal
        visible={showKampusAsalModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowKampusAsalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Kampus Asal</Text>
              <TouchableOpacity 
                onPress={() => setShowKampusAsalModal(false)}
                style={styles.modalCloseButton}
              >
                <X color="#000000" size={24} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={KAMPUS_LIST}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    kampusAsal === item.name && styles.modalItemSelected,
                  ]}
                  onPress={() => handleSelectKampusAsal(item.name)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.modalItemText,
                    kampusAsal === item.name && styles.modalItemTextSelected,
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
            />
          </View>
        </View>
      </Modal>

      {/* Modal Kampus Mutasi */}
      <Modal
        visible={showKampusMutasiModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowKampusMutasiModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Kampus Mutasi</Text>
              <TouchableOpacity 
                onPress={() => setShowKampusMutasiModal(false)}
                style={styles.modalCloseButton}
              >
                <X color="#000000" size={24} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={KAMPUS_LIST}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    kampusMutasi === item.name && styles.modalItemSelected,
                  ]}
                  onPress={() => handleSelectKampusMutasi(item.name)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.modalItemText,
                    kampusMutasi === item.name && styles.modalItemTextSelected,
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
            />
          </View>
        </View>
      </Modal>
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
    paddingBottom: 50,
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
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 24,
    flex: 1,
    marginLeft: 12,
  },
  historyButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  contentAreaWrapper: {
    flex: 1,
    marginTop: -40,
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
    paddingBottom: 120,
  },
  formTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#000000',
    lineHeight: 21,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#8D8D8D',
    lineHeight: 18,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '500',
    color: '#000000',
    lineHeight: 18,
    marginBottom: 4,
  },
  textInput: {
    height: 46,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 12,
    fontFamily: 'Poppins-regular',
    fontWeight: '500',
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  dropdownInput: {
    height: 46,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    fontSize: 12,
    fontFamily: 'Poppins-regular',
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  placeholderText: {
    color: '#BBBBBB',
  },
  footerWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 32,
    paddingTop: 12,
    paddingBottom: 46,
    backgroundColor: '#FFFFFF',
  },
  submitButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#1E69DD', // Solid color instead of gradient
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#000000',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  modalItemSelected: {
    backgroundColor: '#E8F2FF',
  },
  modalItemText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    fontWeight: '500',
    color: '#000000',
  },
  modalItemTextSelected: {
    color: '#1E69DD',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  modalSeparator: {
    height: 1,
    backgroundColor: '#F5F5F5',
  },
});

