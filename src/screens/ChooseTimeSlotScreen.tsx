import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { ApiService } from '../services/api';

function generateTimeSlots(duration: number, start = '09:00', end = '18:00') {
  const slots = [];
  let [hour, minute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  while (hour < endHour || (hour === endHour && minute < endMinute)) {
    const slot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    slots.push(slot);
    minute += duration;
    while (minute >= 60) {
      hour++;
      minute -= 60;
    }
  }
  return slots;
}

function mockAvailability(slots: string[]) {
  // Randomly mark some slots as unavailable
  return slots.map(slot => ({
    time: slot,
    available: Math.random() > 0.3, // 70% available
  }));
}

export const ChooseTimeSlotScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { serviceId, barberId } = (route.params || {}) as { serviceId: string; barberId: string };
  // Debug logging for params
  console.log('ChooseTimeSlotScreen params:', { serviceId, barberId });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [serviceDuration, setServiceDuration] = useState<number | null>(null);
  const [slots, setSlots] = useState<Array<{ time: string; available: boolean }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch service duration
    const fetchService = async () => {
      setLoading(true);
      setError(null);
      try {
        const api = new ApiService();
        const service = await api.getService(serviceId);
        setServiceDuration(service.duration);
      } catch (err: any) {
        console.error('Service fetch error:', err, 'serviceId:', serviceId);
        setError('Failed to fetch service info');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId]);

  useEffect(() => {
    // Fetch available slots when date, barber, or service changes
    const fetchSlots = async () => {
      if (!serviceDuration) return;
      setLoading(true);
      setError(null);
      try {
        // Use the same API_BASE_URL logic as in ApiService
        const API_BASE_URL =
          Platform.OS === 'android'
            ? 'http://10.0.2.2:8000'
            : 'http://localhost:8000';
        const dateStr = selectedDate.toISOString().split('T')[0];
        const response = await fetch(
          `${API_BASE_URL}/api/barbers/${barberId}/availability?serviceId=${serviceId}`
        );
        if (!response.ok) throw new Error('Failed to fetch availability');
        const data = await response.json();
        const daySlots = data.availability[dateStr];
        if (Array.isArray(daySlots) && daySlots.length > 0) {
          setSlots(
            daySlots.map((slot: { startTime: string; endTime: string }) => ({
              time: slot.startTime,
              available: true,
            }))
          );
        } else {
          setSlots([]);
        }
      } catch (err: any) {
        setError('Failed to fetch available slots');
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDate, barberId, serviceId, serviceDuration]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Date</Text>
      <Calendar
        onDayPress={(day: { dateString: string }) => setSelectedDate(new Date(day.dateString))}
        markedDates={{
          [selectedDate.toISOString().split('T')[0]]: { selected: true, selectedColor: COLORS.primary },
        }}
        theme={{
          selectedDayBackgroundColor: COLORS.primary,
          todayTextColor: COLORS.primary,
        }}
        style={styles.calendar}
      />
      <Text style={styles.title}>Choose a Time Slot</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.timeSlotRow}>
          {Array.isArray(slots) && slots.length === 0 ? (
            <Text>No available slots for this day.</Text>
          ) : (
            Array.isArray(slots) && slots.map(({ time, available }) => {
              const isSelected = time === selectedSlot;
              return (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlotPill,
                    isSelected && styles.timeSlotPillSelected,
                    !available && styles.timeSlotPillUnavailable,
                  ]}
                  disabled={!available}
                  onPress={() => {
                    setSelectedSlot(time);
                    navigation.navigate('Booking' as never, { serviceId, barberId, timeSlot: time } as never);
                  }}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      isSelected && styles.timeSlotTextSelected,
                      !available && styles.timeSlotTextUnavailable,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    alignSelf: 'flex-start',
  },
  calendar: {
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  timeSlotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  timeSlotPill: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginRight: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeSlotPillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeSlotPillUnavailable: {
    backgroundColor: COLORS.gray,
    borderColor: COLORS.gray,
    opacity: 0.5,
  },
  timeSlotText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
  },
  timeSlotTextSelected: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  timeSlotTextUnavailable: {
    color: COLORS.white,
    textDecorationLine: 'line-through',
  },
}); 