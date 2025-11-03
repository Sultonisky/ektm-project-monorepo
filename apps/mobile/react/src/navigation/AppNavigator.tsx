import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen, WelcomeScreen, EKtmScreen, ScannerScreen, RincianPembayaranScreen, MenungguPembayaranScreen, PembayaranSuksesScreen, CutiAkademikScreen, FormPengajuanScreen, CutiSuksesScreen } from '../screens';
import LoginScreen from '../screens/login/LoginScreen';
import MainNavigator from '../components/MainNavigator';
import KampusUBSIPages from '../screens/profile/kampus/kampus';
import TentangScreen from '../screens/profile/TentangScreen';

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

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashRoute} />
          <Stack.Screen name="Welcome" component={WelcomeRoute} />
          <Stack.Screen name="Login" component={LoginRoute} />
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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function SplashRoute({ navigation }: any) {
  return (
    <SplashScreen onFinished={() => navigation.replace('Welcome')} />
  );
}

function WelcomeRoute({ navigation }: any) {
  return (
    <WelcomeScreen onLogin={() => navigation.navigate('Login')} />
  );
}

function LoginRoute({ navigation }: any) {
  return (
    <LoginScreen 
      onSubmit={() => navigation.replace('Main')} 
      onBack={() => navigation.goBack()}
    />
  );
}


