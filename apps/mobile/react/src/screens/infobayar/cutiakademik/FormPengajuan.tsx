import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronDown, Check } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  navigation?: any;
  route?: any;
}

export default function FormPengajuan({ navigation: propNavigation, route }: Props) {
  const navigation = useNavigation<NavigationProp>();

  const [step, setStep] = useState<number>(1);

  // Step 1
  const jurusanOptions = useMemo(
    () => [
      'Teknik Informatika',
      'Sistem Informasi',
      'Teknologi Informasi',
      'Manajemen Informatika',
      'Rekayasa Perangkat Lunak',
      'Teknik Komputer',
    ],
    [],
  );
  const semesterOptions = useMemo(
    () => [
      'Semester 1',
      'Semester 2',
      'Semester 3',
      'Semester 4',
      'Semester 5',
      'Semester 6',
      'Semester 7',
      'Semester 8',
    ],
    [],
  );
  const [jurusan, setJurusan] = useState<string>('');
  const [semester, setSemester] = useState<string>('');

  // Step 2
  const [namaLengkap, setNamaLengkap] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [noTelp, setNoTelp] = useState<string>('');

  // Step 3
  const alasanOptions = useMemo(
    () => [
      'Kesehatan',
      'Masalah Keluarga',
      'Keperluan Pribadi',
      'Pekerjaan atau Magang',
      'Alasan Ekonomi',
      'Lainnya',
    ],
    [],
  );
  const [alasan, setAlasan] = useState<string>('');
  const [catatan, setCatatan] = useState<string>('');
  const [setuju, setSetuju] = useState<boolean>(false);

  const canGoNextStep1 = jurusan.length > 0 && semester.length > 0;
  const canGoNextStep2 =
    namaLengkap.trim().length > 0 && email.trim().length > 0 && noTelp.trim().length > 0;
  const canSubmit = alasan.trim().length > 0 && setuju;

  const handleBackPress = () => {
    if (propNavigation?.goBack) {
      propNavigation.goBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const goNext = () => {
    if (step === 1 && canGoNextStep1) setStep(2);
    if (step === 2 && canGoNextStep2) setStep(3);
  };

  const submit = () => {
    if (!canSubmit) return;
    navigation.navigate('CutiSukses');
  };

  const Stepper = () => {
    const items = [
      { key: 1, label: 'Akademik' },
      { key: 2, label: 'Biodata' },
      { key: 3, label: 'Alasan' },
    ];
    return (
      <View style={styles.stepperContainer}>
        {items.map((it, idx) => {
          const active = step === it.key;
          return (
            <React.Fragment key={it.key}>
              <View style={styles.stepperItem}>
                {active ? (
                  <View style={styles.stepActiveContainer}>
                    <View style={styles.stepCircleActive}>
                      <Text style={styles.stepNumberActive}>{it.key}</Text>
                    </View>
                    <Text style={styles.stepLabelActive}>{it.label}</Text>
                  </View>
                ) : (
                  <View style={styles.stepCircleInactive}>
                    <Text style={styles.stepNumberInactive}>{it.key}</Text>
                  </View>
                )}
              </View>
              {idx < items.length - 1 && (
                <View style={[styles.stepperDash, active ? styles.stepperDashActive : styles.stepperDashInactive]} />
              )}
            </React.Fragment>
          );
        })}
      </View>
    );
  };

  const Dropdown = ({
    label,
    placeholder,
    options,
    selected,
    onSelect,
  }: {
    label: string;
    placeholder: string;
    options: string[];
    selected: string;
    onSelect: (val: string) => void;
  }) => {
    const [open, setOpen] = useState<boolean>(false);
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <View>
          <TouchableOpacity
            onPress={() => setOpen(!open)}
            activeOpacity={0.9}
            style={styles.inputCard}
          >
            <Text style={[styles.inputText, selected ? styles.inputTextFilled : styles.inputPlaceholder]}>
              {selected || placeholder}
            </Text>
            <ChevronDown color="#9AA4B2" size={18} />
          </TouchableOpacity>
          {open && (
            <View style={styles.dropdownMenu}>
              <ScrollView style={{ maxHeight: 200 }}>
                {options.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => {
                      onSelect(opt);
                      setOpen(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    );
  };

  const Input = ({
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType,
    multiline,
  }: {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (t: string) => void;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    multiline?: boolean;
  }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
            <View style={[styles.inputCard, multiline && { height: 120, alignItems: 'flex-start', paddingVertical: 12, minHeight: 120 }]}>
        <TextInput
          style={[styles.textInput, multiline && styles.textArea]}
          placeholder={placeholder}
          placeholderTextColor="#BBBBBB"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
        />
      </View>
    </View>
  );

  const Checkbox = ({ checked, onToggle }: { checked: boolean; onToggle: () => void }) => (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8} style={styles.checkboxRow}>
      <View style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]}>
        {checked && <Check color="#FFFFFF" size={14} />}
      </View>
      <Text style={styles.checkboxLabel}>Saya setuju dengan syarat dan ketentuan</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#75ABFF" translucent />
      
      {/* Header with Blue Background */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <ChevronLeft color="#FFFFFF" size={24} />
            </TouchableOpacity>
            
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Form pengajuan cuti</Text>
            </View>
            
            <View style={styles.headerSpacer} />
          </View>
          
          <Stepper />
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
        {step === 1 && (
          <View>
            <Text style={styles.sectionHelper}>Lengkapi data berikut untuk mengajukan cuti akademik</Text>
            <Dropdown
              label="Jurusan"
              placeholder="Jurusan anda saat ini"
              options={jurusanOptions}
              selected={jurusan}
              onSelect={setJurusan}
            />
            <Dropdown
              label="Semester"
              placeholder="Semester anda saat ini"
              options={semesterOptions}
              selected={semester}
              onSelect={setSemester}
            />
            <TouchableOpacity
              onPress={goNext}
              activeOpacity={0.9}
              disabled={!canGoNextStep1}
              style={[styles.primaryButton, !canGoNextStep1 && styles.primaryButtonDisabled]}
            >
              <Text style={styles.primaryButtonText}>Selanjutnya</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.sectionHelper}>Lengkapi data sesuai dengan di E-KTM</Text>
            <Input
              label="Nama Lengkap"
              placeholder="Masukan nama lengkap"
              value={namaLengkap}
              onChangeText={setNamaLengkap}
            />
            <Input
              label="Email"
              placeholder="Masukan email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <Input
              label="No Telp"
              placeholder="Masukan no. telp"
              value={noTelp}
              onChangeText={setNoTelp}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              onPress={goNext}
              activeOpacity={0.9}
              disabled={!canGoNextStep2}
              style={[styles.primaryButton, !canGoNextStep2 && styles.primaryButtonDisabled]}
            >
              <Text style={styles.primaryButtonText}>Selanjutnya</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={styles.sectionHelper}>Berikan alasan mengapa anda ingin cuti</Text>
            <Dropdown
              label="Alasan"
              placeholder="Alasan anda"
              options={alasanOptions}
              selected={alasan}
              onSelect={setAlasan}
            />
            <Input
              label="Catatan (Opsional)"
              placeholder="(Opsional)"
              value={catatan}
              onChangeText={setCatatan}
              multiline
            />
            <Checkbox checked={setuju} onToggle={() => setSetuju(!setuju)} />
            <TouchableOpacity
              onPress={submit}
              activeOpacity={0.9}
              disabled={!canSubmit}
              style={[styles.primaryButton, !canSubmit && styles.primaryButtonDisabled]}
            >
              <Text style={styles.primaryButtonText}>Ajukan Cuti</Text>
            </TouchableOpacity>
          </View>
        )}
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
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerSpacer: {
    width: 32,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: 0,
  },
  stepperItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepActiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
    backgroundColor: '#1E69DD',
    borderRadius: 100,
  },
  stepCircleActive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleInactive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C0DBFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  stepNumberActive: {
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  stepNumberInactive: {
    color: '#9A9A9A',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 4,
  },
  stepperDash: {
    width: 24,
    height: 1.5,
    marginHorizontal: 4,
  },
  stepperDashActive: {
    backgroundColor: '#1E69DD',
  },
  stepperDashInactive: {
    backgroundColor: '#FFFFFF',
  },
  contentAreaWrapper: {
    flex: 1,
    marginTop: -100,
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
  sectionHelper: {
    fontSize: 12,
    color: '#8D8D8D',
    marginBottom: 32,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 18,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 4,
    fontFamily: 'Poppins-Medium',
    lineHeight: 18,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BBBBBB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 46,
  },
  inputText: {
    fontFamily: 'Poppins-Medium',
    flex: 1,
    marginRight: 10,
    fontSize: 12,
    lineHeight: 18,
  },
  inputTextFilled: {
    color: '#000000',
  },
  inputPlaceholder: {
    color: '#BBBBBB',
  },
  textInput: {
    flex: 1,
    color: '#000000',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 18,
  },
  textArea: {
    textAlignVertical: 'top',
  },
  dropdownMenu: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomColor: '#F2F4F7',
    borderBottomWidth: 1,
  },
  dropdownText: {
    color: '#1F2937',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#1E69DD',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxBoxChecked: {
    backgroundColor: '#1E69DD',
  },
  checkboxLabel: {
    color: '#475467',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: '#1E69DD',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
});

