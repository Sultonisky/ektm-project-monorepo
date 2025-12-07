import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, QrCode, Flashlight, FlashlightOff } from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/AppNavigator';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ScannerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [isFlashOn, setIsFlashOn] = useState(false);

  const toggleFlash = () => {
    setIsFlashOn(!isFlashOn);
  };

  const handleBarcodePress = () => {
    navigation.navigate('Barcode');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft color="#000000" size={24} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Scanner</Text>
        </View>
        
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>Scan Barcode Disini</Text>
      </View>

      {/* Scanner Area */}
      <View style={styles.scannerArea}>
        <View style={styles.scannerFrameContainer}>
          {/* Camera Placeholder */}
          <View style={styles.cameraContainer}>
            <View style={styles.cameraPlaceholder}>
              <QrCode color="rgba(0,0,0,0.2)" size={80} />
              <Text style={styles.placeholderText}>
                Camera akan ditampilkan di sini
              </Text>
            </View>
          </View>
          
          {/* Custom Frame Overlay */}
          <View style={styles.frameOverlay}>
            <ScannerFrame />
          </View>
        </View>
      </View>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Gunakan barcode untuk absen kegiatan.
          </Text>
        </View>

        <View style={styles.buttonsRow}>
          {/* Barcode Button */}
          <TouchableOpacity
            onPress={handleBarcodePress}
            style={styles.barcodeButton}
            activeOpacity={0.8}
          >
            <View style={styles.barcodeButtonGradient}>
              <QrCode color="#FFFFFF" size={24} />
              <Text style={styles.barcodeButtonText}>Barcode</Text>
            </View>
          </TouchableOpacity>

          {/* Flash Button */}
          <TouchableOpacity
            onPress={toggleFlash}
            style={styles.flashButton}
            activeOpacity={0.8}
          >
            <View style={styles.flashButtonGradient}>
              {isFlashOn ? (
                <Flashlight color="#FFFFFF" size={24} />
              ) : (
                <FlashlightOff color="#FFFFFF" size={24} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Scanner Frame Component with corner decorations
const ScannerFrame: React.FC = () => {
  const frameSize = 366;
  const cornerLength = 32;
  const strokeWidth = 3;

  return (
    <View style={[styles.frame, { width: frameSize, height: frameSize }]}>
      {/* Top Left Corner */}
      <View style={styles.topLeftCorner}>
        <View style={[styles.cornerLine, { width: cornerLength, height: strokeWidth, top: 0, left: 12 }]} />
        <View style={[styles.cornerLine, { width: strokeWidth, height: cornerLength, top: 12, left: 0 }]} />
        <View style={[styles.cornerArc, styles.topLeftArc]} />
      </View>

      {/* Top Right Corner */}
      <View style={styles.topRightCorner}>
        <View style={[styles.cornerLine, { width: cornerLength, height: strokeWidth, top: 0, right: 12 }]} />
        <View style={[styles.cornerLine, { width: strokeWidth, height: cornerLength, top: 12, right: 0 }]} />
        <View style={[styles.cornerArc, styles.topRightArc]} />
      </View>

      {/* Bottom Left Corner */}
      <View style={styles.bottomLeftCorner}>
        <View style={[styles.cornerLine, { width: cornerLength, height: strokeWidth, bottom: 0, left: 12 }]} />
        <View style={[styles.cornerLine, { width: strokeWidth, height: cornerLength, bottom: 12, left: 0 }]} />
        <View style={[styles.cornerArc, styles.bottomLeftArc]} />
      </View>

      {/* Bottom Right Corner */}
      <View style={styles.bottomRightCorner}>
        <View style={[styles.cornerLine, { width: cornerLength, height: strokeWidth, bottom: 0, right: 12 }]} />
        <View style={[styles.cornerLine, { width: strokeWidth, height: cornerLength, bottom: 12, right: 0 }]} />
        <View style={[styles.cornerArc, styles.bottomRightArc]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#000000',
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    lineHeight: 24,
  },
  headerPlaceholder: {
    width: 40,
  },
  instructionContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  instructionText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    lineHeight: 21,
  },
  scannerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 180,
  },
  scannerFrameContainer: {
    width: 366,
    height: 366,
    position: 'relative',
  },
  cameraContainer: {
    width: 366,
    height: 366,
    borderRadius: 20,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'rgba(0,0,0,0.4)',
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  frameOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  frame: {
    position: 'relative',
    borderRadius: 20,
  },
  topGradientRectangle: {
    position: 'absolute',
    width: 366,
    height: 51,
    top: -49,
    left: 0,
    backgroundColor: 'rgba(16, 57, 119, 0.1)',
  },
  cornerLine: {
    // backgroundColor: '#000000',
    // position: 'absolute',
  },
  topLeftCorner: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topRightCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bottomLeftCorner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  bottomRightCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  cornerArc: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#000000',
  },
  topLeftArc: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 24,
  },
  topRightArc: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 24,
  },
  bottomLeftArc: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 24,
  },
  bottomRightArc: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomPanel: {
    position: 'absolute',
    width: '100%',
    height: 166,
    bottom: 16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 28,
    paddingBottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  infoBox: {
    width: 277,
    height: 34,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2728D1',
    borderRadius: 12,
    marginBottom: 16,
    marginLeft: 32,
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 11.4,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Poppins-Medium',
    lineHeight: 18,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 32,
    right: 32,
    bottom: 16,
    height: 60,
    justifyContent: 'space-between',
    paddingBottom: 0,
  },
  barcodeButton: {
    width: 277,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  barcodeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    backgroundColor: '#1E69DD',
  },
  barcodeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    lineHeight: 24,
  },
  flashButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  flashButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#1E69DD',
  },
  permissionButton: {
    backgroundColor: '#3A8DFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
});
