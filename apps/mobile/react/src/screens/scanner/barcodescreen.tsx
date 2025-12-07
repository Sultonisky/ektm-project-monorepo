import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, ScrollView, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, ScanLine } from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function BarcodeScreen() {
  const navigation = useNavigation<NavigationProp>();

  const userName = 'Nihat Hasannanto';
  const userId = '19230211';
  const barcodeData = '19230211';

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const cardWidth = screenWidth * 0.9;
  const cardHeight = screenHeight * 0.6;
  const qrSize = Math.max(200, Math.min(screenWidth * 0.7, 360));
  const profileRadius = Math.max(20, Math.min(screenWidth * 0.06, 30));
  const fontSize = Math.max(14, Math.min(screenWidth * 0.04, 18));
  const titleFontSize = Math.max(16, Math.min(screenWidth * 0.045, 24));

  return (
    <View style={styles.root}>
      <View style={styles.safeTop} />

      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronLeft color="#000000" size={24} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: '#000', fontFamily: 'Poppins-Bold', fontSize: titleFontSize }}>Barcode</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <View style={{ height: 24 }} />

      {/* Main Content */}
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 40 }}>
          <View style={{ width: cardWidth, maxHeight: cardHeight, minHeight: screenHeight * 0.9 }}>
            <View style={styles.card}>
              <View style={{ paddingHorizontal: screenWidth * 0.09, paddingVertical: screenHeight * 0.025 }}>
                {/* Profile */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={require('../../../assets/images/profile.png')}
                    style={{ width: profileRadius * 2, height: profileRadius * 2, borderRadius: profileRadius }}
                    resizeMode="cover"
                  />
                  <View style={{ width: screenWidth * 0.03 }} />
                  <View style={{ flex: 1 }}>
                    <Text
                      numberOfLines={1}
                      style={{ fontFamily: 'Poppins-Bold', fontSize: fontSize }}
                    >
                      {userName}
                    </Text>
                    <Text style={{ color: '#666', fontFamily: 'Poppins-Regular', fontSize: Math.max(12, Math.min(fontSize * 0.875, 16)) }}>{userId}</Text>
                  </View>
                </View>

                <View style={{ height: screenHeight * 0.04 }} />

                {/* QR */}
                <View style={{ alignItems: 'center' }}>
                  <QRCode value={barcodeData} size={qrSize} />
                </View>

                <View style={{ height: screenHeight * 0.02 }} />

                <Text style={{ textAlign: 'center', fontFamily: 'Poppins-Bold', fontSize: Math.max(12, Math.min(fontSize * 0.875, 12)) }}>
                  Gunakan barcode untuk absen kegiatan.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Bottom Bar */}
      <View style={{ backgroundColor: 'transparent', marginBottom: 16 }}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: -2 },
            elevation: 8,
            paddingLeft: 32,
            paddingRight: 32,
            paddingTop: 28,
            paddingBottom: 16,
          }}
        >
          {/* Info */}
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#2728D1',
              paddingVertical: 8,
              paddingHorizontal: 16,
              marginBottom: 16,
            }}
          >
            <Text style={{ textAlign: 'center', color: '#000', fontFamily: 'Poppins-Medium', fontSize: 11.4, lineHeight: 18, fontWeight: '600' }}>
              Tap tombol di bawah untuk mulai scan barcode.
            </Text>
          </View>

          {/* Scan Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Scanner')}
            style={{
              height: 60,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundColor: '#1E69DD',
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 2 },
              elevation: 4,
              gap: 8,
            }}
          >
            <ScanLine color="#FFFFFF" size={24} />
            <Text style={{ color: '#FFFFFF', fontFamily: 'Poppins-Medium', fontSize: 18, fontWeight: '600', lineHeight: 24 }}>Scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F3F3F3' },
  safeTop: { height: 0 },
  card: {
    backgroundColor: '#F8F6FF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});


