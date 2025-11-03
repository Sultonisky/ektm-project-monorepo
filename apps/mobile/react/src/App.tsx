import React from 'react';
import {
  StatusBar,
  StyleSheet,
} from 'react-native';
import MainNavigator from './components/MainNavigator';

const App: React.FC = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <MainNavigator />
    </>
  );
};

const styles = StyleSheet.create({
  // Add any global styles here if needed
});

export default App;
