import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff, ScanFace } from 'lucide-react-native';

type Props = { 
  onSubmit?: (nim: string, password: string) => void;
  onBack?: () => void;
  loading?: boolean;
  errorMessage?: string | null;
};

export default function LoginScreen({ onSubmit, onBack, loading = false, errorMessage }: Props) {
  const [nim, setNim] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [secure, setSecure] = React.useState(true);

  const handleLoginPress = () => {
    if (loading) {
      return;
    }
    onSubmit?.(nim.trim(), password);
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Navigation Header */}
      <View style={styles.navigationHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} disabled={loading}>
          <ArrowLeft size={20} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.navigationTitle}>Login</Text>
        <View style={styles.headerIcon}>
          <View style={styles.iconEllipse1} />
          <View style={styles.iconEllipse2} />
          <View style={styles.iconEllipse3} />
          <View style={styles.iconEllipse4} />
        </View>
      </View>

      {/* Logo Section */}
      <View style={styles.logoSection}>
        <Image source={require('@images/logo.png')} style={styles.logo} />
        <Text style={styles.brand}>BSI.ID</Text>
      </View>

      {/* NIM Field */}
      <View style={styles.nimField}>
        <Text style={styles.fieldLabel}>NIM</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={nim}
            onChangeText={setNim}
            placeholder="Masukan NIM"
            placeholderTextColor="#838383"
            keyboardType="number-pad"
            style={styles.input}
            editable={!loading}
          />
        </View>
      </View>

      {/* Password Field */}
      <View style={styles.passwordField}>
        <Text style={styles.fieldLabel}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Masukan Password"
            placeholderTextColor="#838383"
            secureTextEntry={secure}
            style={styles.input}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setSecure(s => !s)} style={styles.eyeIcon} disabled={loading}>
            {secure ? <EyeOff size={16} color="#8C8C8C" /> : <Eye size={16} color="#8C8C8C" />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Error Message */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
        onPress={handleLoginPress}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Text style={styles.loginText}>{loading ? 'Memproses...' : 'Login'}</Text>
      </TouchableOpacity>

      {/* Face ID Button */}
      <TouchableOpacity style={styles.faceIdBtn} disabled={loading}>
        <ScanFace size={24} color="#021ABF" />
        <Text style={styles.faceIdText}>Face ID</Text>
      </TouchableOpacity>

      {/* Info Text */}
      <Text style={styles.infoText}>
        Untuk mahasiswa baru menggunakan password standar "ubsi2023" dan langsung ganti password kamu segera.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },

  // Navigation Header
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginTop: 20,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
    color: '#000000',
  },
  headerIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  iconEllipse1: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: '#1B1B1B',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3.6,
  },
  iconEllipse2: {
    position: 'absolute',
    width: 18,
    height: 18,
    backgroundColor: '#373737',
    borderRadius: 9,
    left: 3,
    top: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6.1,
  },
  iconEllipse3: {
    position: 'absolute',
    width: 18,
    height: 18,
    backgroundColor: '#787878',
    borderRadius: 9,
    left: 3,
    top: 3,
  },
  iconEllipse4: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#D8D8D8',
    borderRadius: 6,
    left: 6,
    top: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  // Logo Section
  logoSection: {
    alignItems: 'center',
    padding: 0,
    gap: 16,
    marginTop: 40,
    alignSelf: 'center',
  },
  logo: {
    width: 165,
    height: 165,
    borderRadius: 16,
  },
  brand: {
    width: 165,
    height: 48,
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    lineHeight: 48,
    textAlign: 'center',
    color: '#000000',
  },

  // NIM Field
  nimField: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
    gap: 4,
    marginHorizontal: 32,
    marginTop: 50,
  },
  fieldLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 18,
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
    width: '100%',
    height: 46,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A7A7A7',
    borderRadius: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 18,
    color: '#000000',
    paddingVertical: 0,
  },

  // Password Field
  passwordField: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
    gap: 4,
    marginHorizontal: 32,
    marginTop: 16,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Login Button
  loginBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
    marginHorizontal: 32,
    marginTop: 16,
    height: 53,
    backgroundColor: '#021ABF',
    borderRadius: 8,
  },
  loginText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 21,
    color: '#FFFFFF',
  },
  
  // Face ID Button
  faceIdBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 4,
    marginHorizontal: 32,
    marginTop: 8,
    height: 53,
    borderWidth: 1,
    borderColor: '#021ABF',
    borderRadius: 8,
  },
  faceIdText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 21,
    color: '#021ABF',
  },
  
  // Info Text
  infoText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    lineHeight: 18,
    color: '#000000',
    marginHorizontal: 32,
    marginTop: 12,
    textAlign: 'center',
  },
  loginBtnDisabled: {
    backgroundColor: '#7A90F5',
  },
  errorText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#D92121',
    textAlign: 'center',
    marginHorizontal: 32,
    marginTop: 12,
  },
});


