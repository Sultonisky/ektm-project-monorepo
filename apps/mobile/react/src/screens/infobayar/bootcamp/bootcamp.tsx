import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

const BootcampScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color="#000000" />
          <Text style={styles.headerTitle}>Bootcamp</Text>
        </TouchableOpacity>
      </View>

      {/* Empty State Content */}
      <View style={styles.emptyStateContainer}>
        <View style={styles.contentWrapper}>
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require('../../../../assets/images/bootcamp.png')}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Belum Ada Bootcamp yang Tersedia
            </Text>
            <Text style={styles.description}>
              Saat ini belum ada program bootcamp yang dibuka. Tetap pantau halaman ini untuk kesempatan belajar berikutnya!
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: 122,
    height: 24,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#000000',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  contentWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
    width: 366,
  },
  illustrationContainer: {
    width: 366,
    height: 284.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    width: 342,
    height: 82,
  },
  title: {
    width: 342,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#000000',
  },
  description: {
    width: 342,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: '#000000',
  },
});

export default BootcampScreen;

