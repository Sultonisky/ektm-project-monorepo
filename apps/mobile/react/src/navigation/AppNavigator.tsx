import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  SplashScreen,
  WelcomeScreen,
  EKtmScreen,
  ScannerScreen,
  RincianPembayaranScreen,
  MenungguPembayaranScreen,
  PembayaranSuksesScreen,
  CutiAkademikScreen,
  FormPengajuanScreen,
  CutiSuksesScreen,
} from '../screens';
import LoginScreen from '../screens/login/LoginScreen';
import MainNavigator from '../components/MainNavigator';
import KampusUBSIPages from '../screens/profile/kampus/kampus';
import TentangScreen from '../screens/profile/TentangScreen';
import useAuth from '../hooks/useAuth';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Main: { initialTab?: 'ektm' | 'infobayar' | 'berita' | 'profile' } | undefined;
  EKtm: undefined;
  Scanner: undefined;
  KampusUBSI: undefined;
  Tentang: undefined;
  RincianPembayaran: {
    nama?: string;
    nim?: string;
    rincian?: Array<{ label: string; value: string }>;
    total?: string;
    semester?: string;
    status?: 'belum' | 'pending' | 'lunas';
    paymentCode?: string;
    biayaComponents?: {
      biayaPokok?: number;
      biayaTambahanJurusan?: number;
      biayaPraktikum?: number;
      biayaUjian?: number;
      biayaKegiatan?: number;
      total?: number;
    } | null;
  };
  MenungguPembayaran: {
    invoiceId?: string;
    bankKey?: 'bca' | 'bni' | 'bri' | 'bsi' | 'cimb' | 'mandiri' | 'permata';
    nama?: string;
    nim?: string;
    rincian?: Array<{ label: string; value: string }>;
    total?: string;
  };
  PembayaranSukses: {
    invoiceId?: string;
  } | undefined;
  CutiAkademik: undefined;
  FormPengajuan: undefined;
  CutiSukses: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { status } = useAuth();
  const isAuthenticated = status === 'authenticated';

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashRoute} />

        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen name="EKtm" component={EKtmScreen} />
            <Stack.Screen name="Scanner" component={ScannerScreen} />
            <Stack.Screen name="KampusUBSI" component={KampusUBSIPages} />
            <Stack.Screen name="Tentang" component={TentangScreen} />
            <Stack.Screen name="RincianPembayaran" component={RincianPembayaranScreen} />
            <Stack.Screen name="MenungguPembayaran" component={MenungguPembayaranScreen} />
            <Stack.Screen name="PembayaranSukses" component={PembayaranSuksesScreen} />
            <Stack.Screen name="CutiAkademik" component={CutiAkademikScreen} />
            <Stack.Screen name="FormPengajuan" component={FormPengajuanScreen} />
            <Stack.Screen name="CutiSukses" component={CutiSuksesScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeRoute} />
            <Stack.Screen name="Login" component={LoginRoute} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

function SplashRoute({ navigation }: any) {
  const { status } = useAuth();
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isFinished) return;
    if (status === 'loading') return;

    if (status === 'authenticated') {
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    }
  }, [isFinished, status, navigation]);

  return <SplashScreen onFinished={() => setIsFinished(true)} />;
}

function WelcomeRoute({ navigation }: any) {
  return <WelcomeScreen onLogin={() => navigation.navigate('Login')} />;
}

function LoginRoute({ navigation }: any) {
  const { loginMahasiswa } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (nim: string, password: string) => {
    if (!nim || !password) {
      setErrorMessage('NIM dan password harus diisi.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      await loginMahasiswa(nim, password);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error?.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginScreen
      onSubmit={handleLogin}
      onBack={() => navigation.goBack()}
      loading={loading}
      errorMessage={errorMessage}
    />
  );
}


