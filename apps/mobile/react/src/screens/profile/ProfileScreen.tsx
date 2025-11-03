import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  TextProps,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Sun,
  Moon,
  MapPin,
  ShieldPlus,
  Info,
  LogOut,
  Pencil,
  ChevronRight,
} from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

// Wrapper Text component dengan font Poppins sebagai default
const TextComponent = ({ style, ...props }: TextProps) => (
  <Text style={[{ fontFamily: 'Poppins-Regular' }, style]} {...props} />
);

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleEditPress = () => {
    // Handle edit profile action
    console.log('Edit profile');
  };

  const handleModeChange = (mode: 'light' | 'dark') => {
    setThemeMode(mode);
    // Handle theme change
  };

  const handleMenuPress = (menu: string) => {
    switch (menu) {
      case 'kampus':
        navigation.navigate('KampusUBSI');
        break;
      case 'syarat':
        // Navigate to terms and conditions
        console.log('Syarat dan Ketentuan');
        break;
      case 'tentang':
        // Navigate to Tentang screen
        navigation.navigate('Tentang');
        break;
      case 'logout':
        // Handle logout
        console.log('Logout');
        break;
      default:
        break;
    }
  };

  // Animated opacity for header - hide when scroll down
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  return (
    <SafeAreaView style={styles.root} edges={[]}>
      <StatusBar barStyle="light-content" translucent />
      
      {/* Header with Profile Title - Animated hide on scroll */}
      <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
        <TextComponent style={styles.headerTitle}>profile</TextComponent>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Cover Photo */}
        <View style={styles.coverContainer}>
          <Image
            source={require('../../../assets/images/bg_profile.png')}
            style={styles.coverImage}
            resizeMode="cover"
          />
          {/* Gradient overlay on bottom */}
          <View style={styles.coverGradient}>
            <View style={styles.coverGradientTop} />
            {/* <View style={styles.coverGradientBottom} /> */}
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileContent}>
            {/* Profile Photo */}
            <View style={styles.profilePhotoContainer}>
              <Image
                source={require('../../../assets/images/profile.jpeg')}
                style={styles.profilePhoto}
                resizeMode="cover"
              />
            </View>

            {/* Name and NIM */}
            <View style={styles.profileInfo}>
              <TextComponent style={styles.profileName}>
                Nihat Hasannanto
              </TextComponent>
              <TextComponent style={styles.profileNIM}>
                19230211
              </TextComponent>
              
              {/* Edit Button - moved here below Name and NIM */}
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditPress}
                activeOpacity={0.8}
              >
                <View style={styles.editButtonContent}>
                  <Pencil color="#FFFFFF" size={20} />
                  <TextComponent style={styles.editButtonText}>
                    Edit
                  </TextComponent>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Mode Layar Section */}
        <View style={styles.section}>
          <TextComponent style={styles.sectionTitle}>Mode Layar</TextComponent>
          
          <View style={styles.modeContainer}>
            {/* Light Mode */}
            <TouchableOpacity
              style={styles.modeOption}
              onPress={() => handleModeChange('light')}
              activeOpacity={0.7}
            >
              <Sun color="#1C1B1F" size={24} />
              <TextComponent style={styles.modeText}>Light Mode</TextComponent>
              <View style={styles.radioButtonContainer}>
                {themeMode === 'light' ? (
                  <View style={styles.radioButtonSelected}>
                    <View style={styles.radioButtonInner} />
                  </View>
                ) : (
                  <View style={styles.radioButtonUnselected} />
                )}
              </View>
            </TouchableOpacity>

            {/* Dark Mode */}
            <TouchableOpacity
              style={styles.modeOption}
              onPress={() => handleModeChange('dark')}
              activeOpacity={0.7}
            >
              <Moon color="#000000" size={24} />
              <TextComponent style={styles.modeText}>Dark Mode</TextComponent>
              <View style={styles.radioButtonContainer}>
                {themeMode === 'dark' ? (
                  <View style={styles.radioButtonSelected}>
                    <View style={styles.radioButtonInner} />
                  </View>
                ) : (
                  <View style={styles.radioButtonUnselected} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Lainnya Section */}
        <View style={styles.section}>
          <TextComponent style={styles.sectionTitle}>Menu Lainnya</TextComponent>
          
          <View style={styles.menuContainer}>
            {/* Kampus UBSI */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress('kampus')}
              activeOpacity={0.7}
            >
              <MapPin color="#000000" size={24} />
              <TextComponent style={styles.menuText}>Kampus UBSI</TextComponent>
              <ChevronRight color="#000000" size={24} />
            </TouchableOpacity>

            {/* Syarat dan Ketentuan */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress('syarat')}
              activeOpacity={0.7}
            >
              <ShieldPlus color="#000000" size={24} />
              <TextComponent style={styles.menuText}>
                Syarat dan Ketentuan
              </TextComponent>
              <ChevronRight color="#000000" size={24} />
            </TouchableOpacity>

            {/* Tentang BSI.ID */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress('tentang')}
              activeOpacity={0.7}
            >
              <Info color="#000000" size={24} />
              <TextComponent style={styles.menuText}>Tentang BSI.ID</TextComponent>
              <ChevronRight color="#000000" size={24} />
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress('logout')}
              activeOpacity={0.7}
            >
              <LogOut color="#FF0000" size={24} />
              <TextComponent style={[styles.menuText, styles.logoutText]}>
                Logout
              </TextComponent>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingTop: 0,
    marginTop: 0,
  },
  headerContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 24,
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  scrollView: {
    flex: 1,
    marginTop: 0,
    paddingTop: 0,
  },
  scrollContent: {
    paddingBottom: 120, // Space for bottom navigation
    paddingTop: 0,
    marginTop: 0,
  },
  coverContainer: {
    width: '100%',
    height: 268,
    position: 'relative',
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    top: 0,
    zIndex: 0,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  coverGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  coverGradientTop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // coverGradientBottom: {
  //   height: '50%',
  //   backgroundColor: 'rgba(0, 0, 0, 0.4)',
  // },
  profileSection: {
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 32,
    marginTop: -100, // Negative margin to overlap with coverContainer
    backgroundColor: '#F0F0F0',
    position: 'relative',
    zIndex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    gap: 24,
  },
  profilePhotoContainer: {
    width: 134,
    height: 148,
    borderRadius: 24,
    borderWidth: 5,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 19,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingBottom: 0,
    marginTop: -40, // Move up more
  },
  profileName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 21,
    color: '#000000',
    marginBottom: 8,
  },
  profileNIM: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    lineHeight: 21,
    color: '#000000',
    marginBottom: 12,
  },
  editButton: {
    width: 140.5,
    height: 36,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#1E69DD', // Solid blue color
  },
  editButtonContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    height: '100%',
  },
  editButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 18,
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 32,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 21,
    color: '#000000',
    marginBottom: 8,
  },
  modeContainer: {
    gap: 0,
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 16,
  },
  modeText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    lineHeight: 21,
    color: '#000000',
  },
  radioButtonContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2728D1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2728D1',
  },
  radioButtonUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2728D1',
  },
  menuContainer: {
    gap: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    lineHeight: 21,
    color: '#000000',
  },
  logoutText: {
    color: '#FF0000',
  },
});

