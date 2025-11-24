import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './providers/AuthProvider';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0b1b3f" />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
