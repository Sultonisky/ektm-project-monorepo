import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Animated,
  PanResponder,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { ChevronLeft, User, Lock, Eye, EyeOff, Pencil as PencilIcon } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SNAP_POINT_60 = SCREEN_HEIGHT * 0.4; // 60% terlihat (40% dari atas)
const SNAP_POINT_90 = SCREEN_HEIGHT * 0.15; // 85% terlihat (15% dari atas, tidak menutupi navbar)
const SNAP_POINT_CLOSED = SCREEN_HEIGHT; // Tertutup penuh

interface UpdateDataBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

export default function UpdateDataBottomSheet({ visible, onClose }: UpdateDataBottomSheetProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const translateY = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translateY.setOffset(lastGestureDy.current);
      },
      onPanResponderMove: (_, gesture) => {
        // Allow dragging both up and down
        translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        translateY.flattenOffset();
        const currentPosition = lastGestureDy.current + gesture.dy;
        
        // Determine snap point based on current position and velocity
        let snapTo = SNAP_POINT_60;
        
        if (currentPosition > SNAP_POINT_60 + 100) {
          // Close if dragged down significantly
          snapTo = SNAP_POINT_CLOSED;
        } else if (currentPosition < SNAP_POINT_60 / 2) {
          // Snap to 90% if dragged up
          snapTo = SNAP_POINT_90;
        } else {
          // Snap to 60%
          snapTo = SNAP_POINT_60;
        }

        if (snapTo === SNAP_POINT_CLOSED) {
          closeSheet();
        } else {
          Animated.spring(translateY, {
            toValue: snapTo,
            useNativeDriver: true,
            friction: 9,
          }).start();
          lastGestureDy.current = snapTo;
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
        toValue: SNAP_POINT_60, // Start at 60%
        useNativeDriver: true,
        friction: 9,
      }).start();
      lastGestureDy.current = SNAP_POINT_60;
    }
  }, [visible]);

  const handleUpdate = () => {
    // TODO: Implement update logic
    console.log('Update data:', { email, phone, oldPassword, newPassword, confirmPassword });
    closeSheet();
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
            
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={closeSheet} style={styles.backButton}>
                <ChevronLeft color="#FFFFFF" size={24} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Update Data</Text>
            </View>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoid}
          >
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Description */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>
                  Yuk, pastikan data kamu selalu up to date!
                </Text>
                <Text style={styles.descriptionText}>
                  Perbarui informasi mahasiswa agar tetap akurat dan lengkap.
                </Text>
              </View>

              {/* Update Data Personal */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Update Data Personal</Text>
                  <User color="#2728D1" size={20} />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Email Baru"
                      placeholderTextColor="#838383"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>No Telepon</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="No Telepon Baru"
                      placeholderTextColor="#838383"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </View>

              {/* Update Password */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Update Password</Text>
                  <Lock color="#2728D1" size={20} />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Password Lama</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Password Lama"
                      placeholderTextColor="#838383"
                      value={oldPassword}
                      onChangeText={setOldPassword}
                      secureTextEntry={!showOldPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowOldPassword(!showOldPassword)}
                      style={styles.eyeIcon}
                    >
                      {showOldPassword ? (
                        <Eye color="#8C8C8C" size={16} />
                      ) : (
                        <EyeOff color="#8C8C8C" size={16} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Password Baru</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Password Baru"
                      placeholderTextColor="#838383"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showNewPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowNewPassword(!showNewPassword)}
                      style={styles.eyeIcon}
                    >
                      {showNewPassword ? (
                        <Eye color="#8C8C8C" size={16} />
                      ) : (
                        <EyeOff color="#8C8C8C" size={16} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Confirm Password Baru</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Confirmasi Password Baru"
                      placeholderTextColor="#838383"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeIcon}
                    >
                      {showConfirmPassword ? (
                        <Eye color="#8C8C8C" size={16} />
                      ) : (
                        <EyeOff color="#8C8C8C" size={16} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Info Text */}
              <Text style={styles.infoText}>
                Ubah Password defult <Text style={styles.infoTextBold}>"Ubsi2023"</Text> dengan password baru kamu
              </Text>

              {/* Update Button */}
              <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <PencilIcon color="#FFFFFF" size={20} />
                <Text style={styles.updateButtonText}>Update Data</Text>
              </TouchableOpacity>

              <View style={{ height: 200 }} />
            </ScrollView>
          </KeyboardAvoidingView>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 16,
    paddingBottom: 12,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#1E69DD',
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#1E69DD',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 5,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 32,
    paddingTop: 24,
    gap: 24,
  },
  descriptionContainer: {
    gap: 8,
  },
  descriptionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 21,
    color: '#000000',
  },
  descriptionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 18,
    color: '#5C5C5C',
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 21,
    color: '#000000',
  },
  formGroup: {
    gap: 4,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 18,
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A7A7A7',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 18,
    color: '#000000',
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  infoText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 18,
    color: '#000000',
    marginTop: -8,
  },
  infoTextBold: {
    color: '#1E69DD',
    fontFamily: 'Poppins-SemiBold',
  },
  updateButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 8,
    backgroundColor: '#1E69DD',
    boxShadow: '0px 2px 16px rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 5,
  },
  updateButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 21,
    color: '#FFFFFF',
  },
});

