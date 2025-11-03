import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ImageBackground,
} from 'react-native';
import { 
  CreditCard, 
  Receipt, 
  Newspaper, 
  User,
  QrCode
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface TabItem {
  key: string;
  title: string;
  icon: React.ComponentType<any>;
  onPress: () => void;
}

interface CustomBottomNavigationProps {
  activeTab: string;
  onTabPress: (tabKey: string) => void;
  onQRPress: () => void;
}

const CustomBottomNavigation: React.FC<CustomBottomNavigationProps> = ({
  activeTab,
  onTabPress,
  onQRPress,
}) => {
  const tabs: TabItem[] = [
    {
      key: 'ektm',
      title: 'E-KTM',
      icon: CreditCard,
      onPress: () => onTabPress('ektm'),
    },
    {
      key: 'infobayar',
      title: 'Info Bayar',
      icon: Receipt,
      onPress: () => onTabPress('infobayar'),
    },
    {
      key: 'berita',
      title: 'Berita',
      icon: Newspaper,
      onPress: () => onTabPress('berita'),
    },
    {
      key: 'profile',
      title: 'Profile',
      icon: User,
      onPress: () => onTabPress('profile'),
    },
  ];

  const renderTabItem = (tab: TabItem, index: number) => {
    const isActive = activeTab === tab.key;
    const IconComponent = tab.icon;

    // Determine the correct style based on tab position
    let tabStyle = styles.tabItem;
    switch (index) {
      case 0:
        tabStyle = styles.tabItemFirst;
        break;
      case 1:
        tabStyle = styles.tabItemSecond;
        break;
      case 2:
        tabStyle = styles.tabItemThird;
        break;
      case 3:
        tabStyle = styles.tabItemFourth;
        break;
      default:
        tabStyle = styles.tabItem;
    }

    return (
      <TouchableOpacity
        key={tab.key}
        style={tabStyle}
        onPress={tab.onPress}
        activeOpacity={0.7}
      >
        <View style={styles.tabIconContainer}>
          <IconComponent 
            size={24} 
            color={isActive ? '#1E69DD' : '#82A0C8'} 
          />
        </View>
        <Text 
          style={[
            styles.tabLabel,
            { 
              color: isActive ? '#1E69DD' : '#82A0C8',
            }
          ]}
        >
          {tab.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background container with PNG image */}
      <ImageBackground
        source={require('../../assets/images/bg_bottombar-light.png')}
        style={styles.backgroundContainer}
        resizeMode="stretch"
      >
        {/* Menu container */}
        <View style={styles.menuContainer}>
          {/* Left side tabs - Frame 1969 */}
          <View style={styles.leftTabsContainer}>
            {tabs.slice(0, 2).map((tab, index) => renderTabItem(tab, index))}
          </View>
          
          {/* Right side tabs - Frame 1970 */}
          <View style={styles.rightTabsContainer}>
            {tabs.slice(2).map((tab, index) => renderTabItem(tab, index + 2))}
          </View>
        </View>
      </ImageBackground>
      
      {/* Floating QR Button */}
      <TouchableOpacity
        style={styles.floatingQRButton}
        onPress={onQRPress}
        activeOpacity={0.8}
      >
        {/* Gradient Border Effect */}
        <View style={styles.gradientBorderOuter}>
          <View style={styles.gradientBorderInner}>
            <View style={styles.qrIconContainer}>
              <QrCode size={21.6} color="#FFFFFF" />
            </View>
            <Text style={styles.qrButtonText}>E-Wallet</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: width,
    height: 98,
    left: 0,
    bottom: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -98 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  backgroundContainer: {
    position: 'absolute',
    width: width,
    height: 98,
    justifyContent: 'flex-end',
  },
  menuContainer: {
    width: width,
    height: 88,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 77,
    paddingBottom: 10,
  },
  leftTabsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: 162,
    height: 69,
    gap: 10,
    margin: 0,
    zIndex: 0,
  },
  rightTabsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: 149,
    height: 69,
    margin: 0,
    zIndex: 1,
  },
  tabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12.5,
    paddingHorizontal: 15,
    gap: 5,
    height: 69,
    justifyContent: 'center',
  },
  tabItemFirst: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12.5,
    paddingHorizontal: 15,
    gap: 5,
    width: 70,
    height: 69,
    justifyContent: 'center',
  },
  tabItemSecond: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12.5,
    paddingHorizontal: 10,
    gap: 5,
    width: 82,
    height: 69,
    justifyContent: 'center',
  },
  tabItemThird: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12.5,
    paddingHorizontal: 15,
    gap: 5,
    width: 77,
    height: 69,
    justifyContent: 'center',
  },
  tabItemFourth: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12.5,
    paddingHorizontal: 16,
    gap: 5,
    width: 72,
    height: 69,
    justifyContent: 'center',
  },
  tabIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  floatingQRButton: {
    position: 'absolute',
    width: 72,
    height: 72,
    left: (width - 72) / 2 + 5,
    top: -50,
    borderRadius: 36,
    zIndex: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  gradientBorderOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#57D4D4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  gradientBorderInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#1E69DD',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  qrIconContainer: {
    width: 29.6,
    height: 29.6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    gap: 8,
  },
  qrButtonText: {
    position: 'absolute',
    width: 52,
    height: 15,
    left: (72 - 52) / 2 + 7,
    top: (72 - 15) / 2 + 14.5,
    fontSize: 11,
    lineHeight: 14,
    color: '#1E69DD',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
});

export default CustomBottomNavigation;
