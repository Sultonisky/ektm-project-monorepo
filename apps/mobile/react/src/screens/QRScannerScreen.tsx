import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { X, QrCode, Flashlight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface QRScannerScreenProps {
  onClose: () => void;
  onScan?: (data: string) => void;
}

const QRScannerScreen: React.FC<QRScannerScreenProps> = ({
  onClose,
  onScan,
}) => {
  const [flashEnabled, setFlashEnabled] = useState(false);

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <X size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <TouchableOpacity 
          style={styles.flashButton}
          onPress={toggleFlash}
        >
          <Flashlight 
            size={24} 
            color={flashEnabled ? '#FFD700' : 'white'} 
          />
        </TouchableOpacity>
      </View>

      {/* Scanner Area */}
      <View style={styles.scannerContainer}>
        {/* Camera placeholder - replace with actual camera component */}
        <View style={styles.cameraPlaceholder}>
          <QrCode size={100} color="rgba(255, 255, 255, 0.3)" />
          <Text style={styles.placeholderText}>
            Camera akan ditampilkan di sini
          </Text>
        </View>

        {/* Scanner Overlay */}
        <View style={styles.overlay}>
          {/* Top overlay */}
          <View style={styles.overlayTop} />
          
          {/* Middle section with scanner frame */}
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.scannerFrame}>
              {/* Corner indicators */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <View style={styles.overlaySide} />
          </View>
          
          {/* Bottom overlay */}
          <View style={styles.overlayBottom} />
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Arahkan kamera ke QR code untuk memindai
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  flashButton: {
    padding: 8,
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: 250,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#75ABFF',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  instructions: {
    paddingHorizontal: 40,
    paddingVertical: 30,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Poppins-Regular',
  },
});

export default QRScannerScreen;
