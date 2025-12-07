import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { X } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SNAP_POINT_INITIAL = SCREEN_HEIGHT * 0.6; // 40% visible
const SNAP_POINT_CLOSED = SCREEN_HEIGHT;

interface PaymentDetailBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  paymentData?: {
    name: string;
    nim: string;
    details: Array<{ label: string; value: string }>;
    total: string;
  };
}

export default function PaymentDetailBottomSheet({ 
  visible, 
  onClose, 
  paymentData 
}: PaymentDetailBottomSheetProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translateY.setOffset(lastGestureDy.current);
      },
      onPanResponderMove: (_, gesture) => {
        translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        translateY.flattenOffset();
        const currentPosition = lastGestureDy.current + gesture.dy;
        
        if (currentPosition > SNAP_POINT_INITIAL / 2) {
          closeSheet();
        } else {
          Animated.spring(translateY, {
            toValue: SNAP_POINT_INITIAL,
            useNativeDriver: true,
            friction: 9,
          }).start();
          lastGestureDy.current = SNAP_POINT_INITIAL;
        }
      },
    }),
  ).current;

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: SNAP_POINT_CLOSED,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      lastGestureDy.current = 0;
      translateY.setValue(0);
    });
  };

  useEffect(() => {
    if (visible) {
      translateY.setValue(SNAP_POINT_CLOSED);
      Animated.spring(translateY, {
        toValue: SNAP_POINT_INITIAL,
        useNativeDriver: true,
        friction: 9,
      }).start();
      lastGestureDy.current = SNAP_POINT_INITIAL;
    }
  }, [visible]);

  // Default data if not provided
  const data = paymentData || {
    name: 'Nihat Hasannanto',
    nim: '19230211',
    details: [
      { label: 'Biaya kuliah pokok', value: 'Rp 2,580,000' },
      { label: 'Tambahan jurusan', value: 'Rp 700,000' },
      { label: 'Biaya pratikum', value: 'Rp 1,200,000' },
      { label: 'Biaya ujian', value: 'Rp 300,000' },
      { label: 'Biaya kegiatan mahasiswa', value: 'Rp 400,000' },
    ],
    total: 'Rp 3,280,000',
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeSheet}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={closeSheet}
        />
        
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Header dengan Drag Indicator */}
          <View style={styles.header} {...panResponder.panHandlers}>
            <View style={styles.dragIndicator} />
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Title and Close Button */}
            <View style={styles.titleRow}>
              <Text style={styles.title}>Rincian Pembayaran</Text>
              <TouchableOpacity onPress={closeSheet} style={styles.closeButton}>
                <X color="#000000" size={24} />
              </TouchableOpacity>
            </View>

            {/* User Info Card */}
            <View style={styles.userCard}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  {/* Placeholder for profile image */}
                  <View style={styles.avatarPlaceholder} />
                </View>
                <View style={styles.userTextContainer}>
                  <Text style={styles.userName}>{data.name}</Text>
                  <Text style={styles.userNim}>{data.nim}</Text>
                </View>
              </View>
              <View style={styles.bcaLogo}>
                <Image
                  source={require('@images/bca.png')}
                  style={styles.bcaImage}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Payment Details */}
            <View style={styles.detailsContainer}>
              {/* Detail Rows */}
              <View style={styles.detailRows}>
                {data.details.map((detail, index) => (
                  <View key={index} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{detail.label}</Text>
                    <Text style={styles.detailValue}>{detail.value}</Text>
                  </View>
                ))}
              </View>

              {/* Dashed Line */}
              <View style={styles.dashedLine} />

              {/* Total Row */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Biaya</Text>
                <Text style={styles.totalValue}>{data.total}</Text>
              </View>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: SCREEN_HEIGHT,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 5,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 16,
    paddingBottom: 0,
    alignItems: 'center',
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#1E69DD',
    borderRadius: 100,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#BDBDBD',
  },
  userTextContainer: {
    gap: 0,
  },
  userName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 18,
    color: '#000000',
  },
  userNim: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 18,
    color: '#000000',
  },
  bcaLogo: {
    width: 54,
    height: 29,
    backgroundColor: '#1E69DD',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 9,
  },
  bcaImage: {
    width: 36,
    height: 11,
  },
  detailsContainer: {
    gap: 16,
  },
  detailRows: {
    gap: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  detailLabel: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 18,
    color: '#707070',
  },
  detailValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 18,
    color: '#000000',
    textAlign: 'right',
  },
  dashedLine: {
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderStyle: 'dashed',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  totalLabel: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 18,
    color: '#707070',
  },
  totalValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: '#1F1F1F',
    textAlign: 'right',
  },
});

