import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
  PanResponder,
} from 'react-native';
import { ChevronLeft, BookOpen } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface Schedule {
  id: number;
  dosen: string;
  dosenCode: string;
  ruangan: string;
  mataKuliah: string;
  waktu: string;
  hasIcon: boolean;
}

interface ScheduleMap {
  [key: number]: Schedule[];
}

const JadwalPerkuliahan = ({ navigation }: any) => {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentDate = today.getDate();
  
  // Convert Sunday (0) to 7 for our week selector (1=Mon, 7=Sun)
  const initialSelectedDay = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;
  
  const [selectedDate, setSelectedDate] = useState<number>(initialSelectedDay);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number>(currentDate);
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [selectedFullDate, setSelectedFullDate] = useState<Date>(today);
  
  // Bottom sheet drag handling
  const SNAP_POINT_TOP = 300; // Expanded position
  const SNAP_POINT_BOTTOM = height - 200; // Collapsed position (default)
  const bottomSheetY = useRef(new Animated.Value(SNAP_POINT_BOTTOM)).current;
  const lastBottomSheetY = useRef(SNAP_POINT_BOTTOM);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond if vertical movement is significant
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        bottomSheetY.setOffset(lastBottomSheetY.current);
        bottomSheetY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        // Limit movement between SNAP_POINT_TOP and SNAP_POINT_BOTTOM
        const newValue = Math.max(
          0,
          Math.min(SNAP_POINT_BOTTOM - SNAP_POINT_TOP, gestureState.dy)
        );
        bottomSheetY.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        bottomSheetY.flattenOffset();
        
        const currentY = lastBottomSheetY.current + gestureState.dy;
        const velocity = gestureState.vy;
        
        // Determine snap point based on position and velocity
        let snapPoint = SNAP_POINT_BOTTOM;
        
        if (velocity < -0.5) {
          // Fast swipe up
          snapPoint = SNAP_POINT_TOP;
        } else if (velocity > 0.5) {
          // Fast swipe down
          snapPoint = SNAP_POINT_BOTTOM;
        } else {
          // Slow drag - snap to nearest point
          const midPoint = (SNAP_POINT_TOP + SNAP_POINT_BOTTOM) / 2;
          snapPoint = currentY < midPoint ? SNAP_POINT_TOP : SNAP_POINT_BOTTOM;
        }
        
        lastBottomSheetY.current = snapPoint;
        
        Animated.spring(bottomSheetY, {
          toValue: snapPoint,
          useNativeDriver: false,
          tension: 50,
          friction: 8,
        }).start();
      },
    })
  ).current;

  // Data reminder
  const reminders = [
    { id: 1, day: 'Thu', date: '18', title: 'Lorem ipsum', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' },
    { id: 2, day: 'Thu', date: '18', title: 'Lorem ipsum', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' },
  ];

  // Generate week days based on selected date
  const getWeekDays = (baseDate: Date) => {
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const currentDay = baseDate.getDay(); // 0 = Sunday
    
    // Calculate Monday of the week containing baseDate
    const monday = new Date(baseDate);
    const dayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    monday.setDate(baseDate.getDate() + dayOffset);
    
    return days.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        id: index + 1,
        day: day,
        date: date.getDate().toString(),
        fullDate: new Date(date),
      };
    });
  };

  const weekDays = getWeekDays(selectedFullDate);

  // Data jadwal kuliah per hari
  const allSchedules: ScheduleMap = {
    1: [ // Senin
      {
        id: 1,
        dosen: 'Wahyutama Fitri Hidayat',
        dosenCode: 'WFH',
        ruangan: 'A-M2',
        mataKuliah: 'MOBILE PROGRAMMING II',
        waktu: '15:00 - 17:30',
        hasIcon: true,
      },
    ],
    2: [ // Selasa
      {
        id: 1,
        dosen: 'Bibit Sudarsono',
        dosenCode: 'BBS',
        ruangan: '203-M2',
        mataKuliah: 'ETIKA PROFESI INFORMATIKA',
        waktu: '10:50 - 13:20',
        hasIcon: true,
      },
    ],
    3: [ // Rabu
      {
        id: 1,
        dosen: 'Yuni Siswantoro',
        dosenCode: 'YWO',
        ruangan: '201-M2',
        mataKuliah: 'JARINGAN KOMPUTER',
        waktu: '14:10 - 17:30',
        hasIcon: true,
      },
    ],
    4: [ // Kamis
      {
        id: 1,
        dosen: 'Risca Lusiana Pratiwi',
        dosenCode: 'RAL',
        ruangan: '201-M2',
        mataKuliah: 'TATA KELOLA TI',
        waktu: '10:50 - 14:10',
        hasIcon: true,
      },
    ],
    5: [ // Jumat
      {
        id: 1,
        dosen: 'Nur Aini Setiyawati',
        dosenCode: 'NII',
        ruangan: '301-M2',
        mataKuliah: 'PENELITIAN SISTEM INFORMASI',
        waktu: '08:20 - 11:40',
        hasIcon: true,
      },
      {
        id: 2,
        dosen: 'Anggi Puspita Sari',
        dosenCode: 'APR',
        ruangan: '301-M2',
        mataKuliah: 'SISTEM OPERASI',
        waktu: '15:00 - 17:30',
        hasIcon: true,
      },
    ],
    6: [ // Sabtu
      // Tidak ada jadwal
    ],
    7: [ // Minggu
      // Tidak ada jadwal
    ],
  };

  // Get schedules for selected date
  const schedules = allSchedules[selectedDate] || [];

  // Generate calendar grid based on current month and year
  const generateCalendar = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay(); // Day of week (0 = Sunday)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Convert Sunday (0) to 7 for Monday-first week
    const firstDayMonday = firstDay === 0 ? 6 : firstDay - 1;
    
    const weeks: number[][] = [];
    let currentWeek: number[] = [];
    
    // Fill empty spaces at the beginning
    for (let i = 0; i < firstDayMonday; i++) {
      currentWeek.push(0); // 0 represents empty cell
    }
    
    // Fill in the dates
    for (let date = 1; date <= daysInMonth; date++) {
      currentWeek.push(date);
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Fill remaining empty spaces
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(0);
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const calendarWeeks = generateCalendar(currentMonth, currentYear);

  // Month names in Indonesian
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Navigation functions
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Handle calendar date click
  const handleCalendarDateClick = (date: number) => {
    setSelectedCalendarDate(date);
    
    // Create full date object
    const fullDate = new Date(currentYear, currentMonth, date);
    setSelectedFullDate(fullDate);
    
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = fullDate.getDay();
    
    // Convert to our format (1 = Monday, 7 = Sunday)
    const selectedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
    setSelectedDate(selectedDay);
  };

  // Animated values based on bottom sheet position
  const reminderOpacity = bottomSheetY.interpolate({
    inputRange: [SNAP_POINT_TOP, SNAP_POINT_BOTTOM],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const calendarOpacity = bottomSheetY.interpolate({
    inputRange: [SNAP_POINT_TOP, SNAP_POINT_BOTTOM],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const weekSelectorOpacity = bottomSheetY.interpolate({
    inputRange: [SNAP_POINT_TOP, SNAP_POINT_BOTTOM],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const blurHeight = bottomSheetY.interpolate({
    inputRange: [SNAP_POINT_TOP, SNAP_POINT_BOTTOM],
    outputRange: [446, 641],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F0F0" />
      
      {/* Animated blur background */}
      <Animated.View style={[styles.blurBackground, { height: blurHeight }]} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft color="#000000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jadwal</Text>
      </View>

      {/* Reminder Section - Fades out when bottom sheet expands */}
      <View style={styles.reminderSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.reminderScroll}
          style={styles.reminderScrollView}
        >
          {reminders.map((reminder) => (
            <Animated.View 
              key={reminder.id} 
              style={[
                styles.reminderCard,
                { opacity: reminderOpacity }
              ]}
            >
              <View style={styles.reminderDateBox}>
                <Text style={styles.reminderDay}>{reminder.day}</Text>
                <Text style={styles.reminderDate}>{reminder.date}</Text>
              </View>
              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>{reminder.title}</Text>
                <Text style={styles.reminderDescription}>{reminder.description}</Text>
              </View>
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {/* Week Selector - Shows when scrolled */}
      <Animated.View style={[styles.weekSelectorContainer, { opacity: weekSelectorOpacity }]}>
        <Text style={styles.weekSelectorTitle}>Hari Tanggal</Text>
        <View style={styles.weekSelector}>
          {weekDays.map((day) => (
            <TouchableOpacity
              key={day.id}
              style={[
                styles.weekDay,
                selectedDate === day.id && styles.weekDaySelected,
              ]}
              onPress={() => setSelectedDate(day.id)}
            >
              <Text style={[styles.weekDayText, selectedDate === day.id && styles.weekDayTextSelected]}>
                {day.day}
              </Text>
              <Text style={[styles.weekDateText, selectedDate === day.id && styles.weekDateTextSelected]}>
                {day.date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Calendar Section - Fades out when bottom sheet expands */}
      <Animated.View style={[styles.calendarSection, { opacity: calendarOpacity }]}>
          <View style={styles.calendarHeader}>
            <View>
              <Text style={styles.calendarYear}>{currentYear}</Text>
              <Text style={styles.calendarMonth}>{monthNames[currentMonth]}</Text>
            </View>
            <View style={styles.calendarNavigation}>
              <TouchableOpacity style={styles.navButtonLeft} onPress={goToPreviousMonth}>
                <ChevronLeft color="#000000" size={14} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButtonRight} onPress={goToNextMonth}>
                <ChevronLeft color="#000000" size={14} style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarContainer}>
            <View style={styles.calendarDaysHeader}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <Text key={day} style={styles.dayHeaderText}>
                  {day}
                </Text>
              ))}
            </View>
            <View style={styles.calendarGrid}>
              {calendarWeeks.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.calendarWeek}>
                  {week.map((date, dateIndex) => (
                    date > 0 ? (
                      <TouchableOpacity
                        key={`${weekIndex}-${dateIndex}`}
                        style={[
                          styles.calendarDate,
                          selectedCalendarDate === date && 
                          currentMonth === selectedFullDate.getMonth() && 
                          currentYear === selectedFullDate.getFullYear() && 
                          styles.calendarDateSelected,
                        ]}
                        onPress={() => handleCalendarDateClick(date)}
                      >
                        <Text
                          style={[
                            styles.calendarDateText,
                            selectedCalendarDate === date && 
                            currentMonth === selectedFullDate.getMonth() && 
                            currentYear === selectedFullDate.getFullYear() && 
                            styles.calendarDateTextSelected,
                          ]}
                        >
                          {date}
                        </Text>
                        {/* Show dot for dates with events - you can customize this logic */}
                        {date === today.getDate() && 
                         currentMonth === today.getMonth() && 
                         currentYear === today.getFullYear() && (
                          <View style={styles.eventDot} />
                        )}
                      </TouchableOpacity>
                    ) : (
                      <View key={`empty-${weekIndex}-${dateIndex}`} style={styles.calendarDate} />
                    )
                  ))}
                </View>
              ))}
            </View>
          </View>
      </Animated.View>

      {/* Bottom Sheet - Jadwal Kuliah */}
      <Animated.View style={[styles.bottomSheet, { top: bottomSheetY }]}>
        <View {...panResponder.panHandlers} style={styles.bottomSheetHandleContainer}>
          <View style={styles.bottomSheetHandle} />
        </View>

        <ScrollView 
          style={styles.scheduleScrollView}
          contentContainerStyle={styles.scheduleList}
          showsVerticalScrollIndicator={false}
        >
          {schedules.length > 0 ? (
            schedules.map((schedule: Schedule, index: number) => (
              <View key={schedule.id}>
                <View style={styles.scheduleItem}>
                  {schedule.hasIcon ? (
                    <View style={styles.iconContainer}>
                      <BookOpen color="#FFFFFF" size={26} />
                    </View>
                  ) : (
                    <View style={styles.iconContainerEmpty}>
                      <BookOpen color="#BBBBBB" size={18} />
                    </View>
                  )}

                  <View style={styles.scheduleContent}>
                    <View style={styles.scheduleMetaRow}>
                      <Text style={styles.scheduleMeta}>{schedule.dosen}</Text>
                      <Text style={styles.scheduleMeta}>{schedule.dosenCode}</Text>
                    </View>
                    <Text style={styles.scheduleTitle}>{schedule.mataKuliah}</Text>
                    <Text style={styles.scheduleRoom}>{schedule.ruangan}</Text>
                    <Text style={styles.scheduleTime}>{schedule.waktu}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Tidak ada jadwal kuliah</Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  blurBackground: {
    position: 'absolute',
    width: width * 1.9,
    left: -width * 0.45,
    top: -122,
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
    gap: 16,
    zIndex: 10,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
  },
  reminderSection: {
    marginTop: 35,
    zIndex: 5,
  },
  reminderScrollView: {
    overflow: 'visible',
  },
  reminderScroll: {
    paddingHorizontal: 32,
    paddingVertical: 10,
    gap: 16,
  },
  reminderCard: {
    flexDirection: 'row',
    width: 289,
    height: 128,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  reminderDateBox: {
    width: 77,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 27.5,
  },
  reminderDay: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: '#8D8D8D',
  },
  reminderDate: {
    fontFamily: 'Poppins-Bold',
    fontWeight: '600',
    fontSize: 32,
    lineHeight: 48,
    textAlign: 'center',
    color: '#000000',
  },
  reminderContent: {
    flex: 1,
    backgroundColor: '#1E69DD',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 4,
  },
  reminderTitle: {
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  reminderDescription: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  weekSelectorContainer: {
    position: 'absolute',
    top: 115,
    left: 21,
    right: 21,
    zIndex: 5,
  },
  weekSelectorTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    marginBottom: 16,
  },
  weekSelector: {
    flexDirection: 'row',
    gap: 4,
  },
  weekDay: {
    flex: 1,
    height: 60,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDaySelected: {
    backgroundColor: '#1E69DD',
    borderColor: '#1E69DD',
  },
  weekDayText: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 10.37,
    lineHeight: 16,
    textAlign: 'center',
    color: '#000000',
  },
  weekDayTextSelected: {
    color: '#FFFFFF',
  },
  weekDateText: {
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    fontSize: 11.86,
    lineHeight: 18,
    textAlign: 'center',
    color: '#000000',
  },
  weekDateTextSelected: {
    color: '#FFFFFF',
  },
  calendarSection: {
    paddingHorizontal: 32,
    paddingTop: 30,
    
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  calendarYear: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
  },
  calendarMonth: {
    fontFamily: 'Poppins-Bold',
    fontWeight: '600',
    fontSize: 32,
    lineHeight: 48,
    color: '#000000',
  },
  calendarNavigation: {
    flexDirection: 'row',
    gap: 16,
  },
  navButtonLeft: {
    width: 30,
    height: 30,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
  },
  navButtonRight: {
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  calendarContainer: {
    gap: 8,
  },
  calendarDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayHeaderText: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: '#000000',
    width: 48,
  },
  calendarGrid: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 16,
    padding: 1,
  },
  calendarWeek: {
    flexDirection: 'row',
  },
  calendarDate: {
    width: 49,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  calendarDateSelected: {
    backgroundColor: '#1E69DD',
    borderRadius: 8,
  },
  calendarDateText: {
    fontFamily: 'Montserrat',
    fontWeight: '700',
    fontSize: 11.86,
    lineHeight: 18,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.8)',
  },
  calendarDateTextSelected: {
    color: '#FFFFFF',
  },
  eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginTop: 5,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: height,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  bottomSheetHandleContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  bottomSheetHandle: {
    width: 35,
    height: 3,
    backgroundColor: '#1E69DD',
    borderRadius: 2,
  },
  scheduleScrollView: {
    flex: 1,
  },
  scheduleList: {
    paddingHorizontal: 32,
    paddingBottom: 100,
  },
  scheduleItem: {
    flexDirection: 'row',
    gap: 43,
    marginBottom: 19,
  },
  iconContainer: {
    width: 55,
    height: 55,
    backgroundColor: '#1E69DD',
    borderRadius: 13.19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerEmpty: {
    width: 52,
    height: 55,
    borderWidth: 1.37,
    borderColor: '#D9D9D9',
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleContent: {
    flex: 1,
    gap: 8.79,
  },
  scheduleMetaRow: {
    flexDirection: 'row',
    gap: 17.59,
  },
  scheduleMeta: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 13.19,
    lineHeight: 20,
    textAlign: 'center',
    color: '#8D8D8D',
  },
  scheduleTitle: {
    fontFamily: 'Poppins-Bold',
    fontWeight: '600',
    fontSize: 17.59,
    lineHeight: 26,
    color: '#000000',
  },
  scheduleRoom: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 13.19,
    lineHeight: 20,
    color: '#8D8D8D',
  },
  scheduleTime: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 17.59,
    lineHeight: 26,
    color: '#000000',
  },

  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '500',
    fontSize: 14,
    color: '#8D8D8D',
  },
});

export default JadwalPerkuliahan;

