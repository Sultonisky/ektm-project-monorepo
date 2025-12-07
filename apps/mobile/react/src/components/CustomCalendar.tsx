import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface CustomCalendarProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  selectedDate?: string;
  mode?: 'single' | 'range';
  selectedRange?: { start: string; end: string };
  onSelectRange?: (range: { start: string; end: string }) => void;
}

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CustomCalendar({
  visible,
  onClose,
  onSelectDate,
  selectedDate,
  mode = 'single',
  selectedRange,
  onSelectRange,
}: CustomCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    
    // Add empty days for the start of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const formatDateString = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${dayStr}/${month}/${year}`;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayPress = (day: number) => {
    const dateString = formatDateString(day);
    
    if (mode === 'single') {
      onSelectDate(dateString);
      onClose();
    } else if (mode === 'range') {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        // Start new range
        setRangeStart(dateString);
        setRangeEnd(null);
      } else {
        // Complete range
        setRangeEnd(dateString);
        if (onSelectRange) {
          onSelectRange({ start: rangeStart, end: dateString });
        }
        // Don't close, let user confirm
      }
    }
  };

  const monthYear = `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  const days = getDaysInMonth(currentDate);
  const weeks: (number | null)[][] = [];
  
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.calendar} 
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowButton}>
              <ChevronLeft color="#B5BEC6" size={16} />
            </TouchableOpacity>
            <Text style={styles.monthYearText}>{monthYear}</Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.arrowButton}>
              <ChevronRight color="#B5BEC6" size={16} />
            </TouchableOpacity>
          </View>

          {/* Day Headers */}
          <View style={styles.dayHeaderRow}>
            {DAYS.map((day) => (
              <View key={day} style={styles.dayHeader}>
                <Text style={styles.dayHeaderText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                {week.map((day, dayIndex) => {
                  if (day === null) {
                    return <View key={`empty-${dayIndex}`} style={styles.dayCell} />;
                  }

                  const dateString = formatDateString(day);
                  const isSelected = selectedDate === dateString;

                  return (
                    <TouchableOpacity
                      key={day}
                      style={[styles.dayCell, isSelected && styles.dayCellActive]}
                      onPress={() => handleDayPress(day)}
                    >
                      <Text style={[styles.dayText, isSelected && styles.dayTextActive]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendar: {
    width: 306,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    gap: 22,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 16,
    },
    shadowOpacity: 0.09,
    shadowRadius: 19,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrowButton: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthYearText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 14,
    textAlign: 'center',
    color: '#4A5660',
  },
  dayHeaderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dayHeader: {
    width: 30,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayHeaderText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'center',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#B3B3B3',
  },
  calendarGrid: {
    gap: 8,
  },
  weekRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dayCell: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCellActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 29,
  },
  dayText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 18,
    textAlign: 'center',
    color: '#838383',
  },
  dayTextActive: {
    color: '#000000',
  },
});

