import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { RootState } from '../store';
import {
  fetchActiveAppointments,
  fetchAppointmentHistory,
  cancelAppointment,
} from '../store/appointmentSlice';
import { Button } from '../components/Button';

export const AppointmentsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const { active, history, isLoading } = useSelector(
    (state: RootState) => state.appointments
  );

  const loadAppointments = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchActiveAppointments()),
      dispatch(fetchAppointmentHistory()),
    ]);
    setRefreshing(false);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancelAppointment = async (id: number) => {
    try {
      await dispatch(cancelAppointment(id)).unwrap();
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  const renderAppointment = (appointment: any, showCancelButton = false) => (
    <View key={appointment.id} style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.barberName}>{appointment.barber.name}</Text>
        <Text
          style={[
            styles.status,
            {
              color:
                appointment.status === 'confirmed'
                  ? COLORS.success
                  : appointment.status === 'cancelled'
                  ? COLORS.error
                  : COLORS.primary,
            },
          ]}
        >
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </Text>
      </View>

      <View style={styles.appointmentDetails}>
        <Text style={styles.serviceName}>{appointment.service.name}</Text>
        <Text style={styles.dateTime}>
          {format(new Date(appointment.date), 'PPP')}
        </Text>
        <Text style={styles.dateTime}>{appointment.time}</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>{appointment.price} CHF</Text>
        {showCancelButton && appointment.status === 'confirmed' && (
          <Button
            title="Cancel"
            onPress={() => handleCancelAppointment(appointment.id)}
            variant="outline"
            size="small"
            style={styles.cancelButton}
          />
        )}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadAppointments} />
      }
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Appointments</Text>
        {active.length === 0 ? (
          <Text style={styles.emptyText}>No active appointments</Text>
        ) : (
          active.map((appointment) => renderAppointment(appointment, true))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Past Appointments</Text>
        {history.length === 0 ? (
          <Text style={styles.emptyText}>No past appointments</Text>
        ) : (
          history.map((appointment) => renderAppointment(appointment))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  section: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  appointmentCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  barberName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  status: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  appointmentDetails: {
    marginBottom: SPACING.md,
  },
  serviceName: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  dateTime: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  cancelButton: {
    minWidth: 100,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.xl,
  },
}); 