import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { ChevronLeft, Calendar } from 'lucide-react-native';
import CustomCalendar from '../../../components/CustomCalendar';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SNAP_POINT_70 = SCREEN_HEIGHT * 0.35; // 65% visible (35% from top)
const SNAP_POINT_90 = SCREEN_HEIGHT * 0.1;  // 90% visible (10% from top)
const SNAP_POINT_CLOSED = SCREEN_HEIGHT;

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

interface FilterState {
  dateFrom: string;
  dateTo: string;
  paymentTypes: string[];
  sortBy: string;
}

const paymentTypeOptions = [
  { id: 'ukt', label: 'UKT' },
  { id: 'kegiatan', label: 'Kegiatan' },
  { id: 'seminar', label: 'Seminar' },
  { id: 'bootcamp', label: 'Bootcamp' },
];

const sortOptions = [
  { id: 'abjad', label: 'Abjad A - Z' },
  { id: 'terbaru', label: 'Terbaru' },
  { id: 'terlama', label: 'Terlama' },
];

export default function FilterBottomSheet({ visible, onClose, onApply }: FilterBottomSheetProps) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedPaymentTypes, setSelectedPaymentTypes] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'from' | 'to'>('from');

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
        
        let snapTo = SNAP_POINT_70;
        
        if (currentPosition > SNAP_POINT_70 + 100) {
          snapTo = SNAP_POINT_CLOSED;
        } else if (currentPosition < SNAP_POINT_70 / 2) {
          snapTo = SNAP_POINT_90;
        } else {
          snapTo = SNAP_POINT_70;
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
        toValue: SNAP_POINT_70,
        useNativeDriver: true,
        friction: 9,
      }).start();
      lastGestureDy.current = SNAP_POINT_70;
    }
  }, [visible]);

  const togglePaymentType = (typeId: string) => {
    setSelectedPaymentTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleApplyFilter = () => {
    onApply({
      dateFrom,
      dateTo,
      paymentTypes: selectedPaymentTypes,
      sortBy: selectedSort,
    });
    closeSheet();
  };

  const handleResetFilter = () => {
    setDateFrom('');
    setDateTo('');
    setSelectedPaymentTypes([]);
    setSelectedSort('');
  };

  const handleDateSelect = (date: string) => {
    if (calendarMode === 'from') {
      setDateFrom(date);
    } else {
      setDateTo(date);
    }
    setShowCalendar(false);
  };

  const openCalendarForFrom = () => {
    setCalendarMode('from');
    setShowCalendar(true);
  };

  const openCalendarForTo = () => {
    setCalendarMode('to');
    setShowCalendar(true);
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
                <ChevronLeft color="#000000" size={24} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Riwayat Pembayaran</Text>
            </View>
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Rentan Tanggal */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rentan Tanggal</Text>
              
              <View style={styles.dateRow}>
                <TouchableOpacity style={styles.dateInput} onPress={openCalendarForFrom}>
                  <Text style={[styles.dateInputText, dateFrom && styles.dateInputTextActive]}>
                    {dateFrom || 'Dari tanggal'}
                  </Text>
                  <Calendar color="#8C8C8C" size={16} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.dateInput} onPress={openCalendarForTo}>
                  <Text style={[styles.dateInputText, dateTo && styles.dateInputTextActive]}>
                    {dateTo || 'Sampai tanggal'}
                  </Text>
                  <Calendar color="#8C8C8C" size={16} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Jenis Pembayaran */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Jenis Pembayaran</Text>
              
              <View style={styles.chipRow}>
                {paymentTypeOptions.map(option => {
                  const isSelected = selectedPaymentTypes.includes(option.id);
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.chip,
                        isSelected && styles.chipActive,
                      ]}
                      onPress={() => togglePaymentType(option.id)}
                    >
                      <Text style={[
                        styles.chipText,
                        isSelected && styles.chipTextActive,
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Urutkan */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Urutkan</Text>
              
              <View style={styles.chipRow}>
                {sortOptions.map(option => {
                  const isSelected = selectedSort === option.id;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.chip,
                        isSelected && styles.chipActive,
                      ]}
                      onPress={() => setSelectedSort(option.id)}
                    >
                      <Text style={[
                        styles.chipText,
                        isSelected && styles.chipTextActive,
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.applyButton} 
                onPress={handleApplyFilter}
              >
                <Text style={styles.applyButtonText}>Terapkan Filter</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.resetButton} 
                onPress={handleResetFilter}
              >
                <Text style={styles.resetButtonText}>Reset Filter</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 200 }} />
          </ScrollView>
        </Animated.View>
      </View>

      {/* Custom Calendar Modal */}
      <CustomCalendar
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onSelectDate={handleDateSelect}
        selectedDate={calendarMode === 'from' ? dateFrom : dateTo}
        mode="single"
      />
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
    gap: 12,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 32,
    paddingTop: 24,
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 21,
    color: '#000000',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 46,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A7A7A7',
    borderRadius: 8,
  },
  dateInputText: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 18,
    color: '#838383',
  },
  dateInputTextActive: {
    color: '#000000',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: '#1E69DD',
  },
  chipText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 18,
    color: '#838383',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  actions: {
    gap: 16,
  },
  applyButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#1E69DD',
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
  applyButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 21,
    color: '#FFFFFF',
  },
  resetButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 6,
  },
  resetButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 21,
    color: '#838383',
  },
});

