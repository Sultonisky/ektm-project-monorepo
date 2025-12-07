import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './providers/AuthProvider';
import { NotificationProvider } from './providers/NotificationProvider';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NotificationProvider>
          <StatusBar barStyle="light-content" backgroundColor="#0b1b3f" />
          <AppNavigator />
        </NotificationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
