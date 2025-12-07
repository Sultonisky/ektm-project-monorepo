import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomBottomNavigation from './CustomBottomNavigation';
import { 
  EKtmScreen, 
  InfoBayarScreen, 
  InfoBeritaScreen, 
  ProfileScreen 
} from '../screens';

interface MainNavigatorProps {
  // Add any props you need
}

const MainNavigator: React.FC<MainNavigatorProps> = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('ektm');

  // Mock navigation props for screens that need them
  const mockNavigation = {} as any;
  const mockRoute = {} as any;

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const handleQRPress = () => {
    // Navigate directly to Scanner screen
    navigation.navigate('Scanner');
  };

  // Respond to navigation param to set initial/target tab
  useEffect(() => {
    const tabFromParams = route?.params?.initialTab as string | undefined;
    if (tabFromParams && ['ektm','infobayar','berita','profile'].includes(tabFromParams)) {
      setActiveTab(tabFromParams);
    }
  }, [route?.params?.initialTab]);

  const renderActiveScreen = () => {

    switch (activeTab) {
      case 'ektm':
        return (
          <View style={styles.screenContainer}>
            <EKtmScreen />
          </View>
        );
      case 'infobayar':
        return (
          <View style={styles.screenContainer}>
            <InfoBayarScreen navigation={mockNavigation} route={mockRoute} />
          </View>
        );
      case 'berita':
        return (
          <View style={styles.screenContainer}>
            <InfoBeritaScreen />
          </View>
        );
      case 'profile':
        return (
          <View style={styles.screenContainer}>
            <ProfileScreen />
          </View>
        );
      default:
        return (
          <View style={styles.screenContainer}>
            <EKtmScreen />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {renderActiveScreen()}
        </View>
        <CustomBottomNavigation
          activeTab={activeTab}
          onTabPress={handleTabPress}
          onQRPress={handleQRPress}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
});

export default MainNavigator;
