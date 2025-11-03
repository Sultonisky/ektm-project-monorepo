import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, ScrollView, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
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
      <View style={{ paddingHorizontal: screenWidth * 0.04, paddingVertical: screenHeight * 0.015 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: screenWidth * 0.1,
              height: screenWidth * 0.1,
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: screenWidth * 0.05, fontFamily: 'Poppins-Regular' }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: '#000', fontFamily: 'Poppins-Bold', fontSize: titleFontSize }}>Barcode</Text>
          </View>
          <View style={{ width: screenWidth * 0.1 }} />
        </View>
      </View>

      <View style={{ height: screenHeight * 0.02 }} />
      <View style={{ height: screenHeight * 0.06 }} />

      {/* Main Content */}
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
          <View style={{ width: cardWidth, maxHeight: cardHeight, minHeight: screenHeight * 0.4 }}>
            <View style={styles.card}>
              <View style={{ paddingHorizontal: screenWidth * 0.06, paddingVertical: screenHeight * 0.025 }}>
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

                <Text style={{ textAlign: 'center', fontFamily: 'Poppins-Bold', fontSize: Math.max(12, Math.min(fontSize * 0.875, 16)) }}>
                  Gunakan barcode untuk absen kegiatan.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Bottom Bar */}
      <View style={{ backgroundColor: 'transparent' }}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: -2 },
            elevation: 2,
            paddingLeft: screenWidth * 0.04,
            paddingRight: screenWidth * 0.04,
            paddingTop: screenHeight * 0.025,
            paddingBottom: screenHeight * 0.04,
          }}
        >
          {/* Info */}
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#3A8DFF',
              paddingVertical: screenHeight * 0.015,
              paddingHorizontal: screenWidth * 0.02,
            }}
          >
            <Text style={{ textAlign: 'center', color: '#000', fontFamily: 'Poppins-Bold', fontSize: Math.max(12, Math.min(fontSize * 0.875, 16)) }}>
              Tap tombol di bawah untuk mulai scan barcode.
            </Text>
          </View>

          <View style={{ height: screenHeight * 0.02 }} />

          {/* Scan Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Scanner')}
            style={{
              height: screenHeight * 0.07,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: '#3A8DFF',
              }}
            />
            <Text style={{ color: '#FFFFFF', fontFamily: 'Poppins-Bold', fontSize: Math.max(16, Math.min(titleFontSize, 20)) }}>Scan</Text>
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


