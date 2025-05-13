import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ApiService } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../context/AppContext';

interface Params {
  serviceId: string;
  barberId: string;
  date: string; // ISO string
  timeSlot: string;
}

type RouteParams = {
  params: Params;
};

const BookingSummaryScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const { serviceId, barberId, date, timeSlot } = route.params;
  const [service, setService] = useState<any>(null);
  const [barber, setBarber] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useApp();

  // Auth check: redirect to login if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!user || !token) {
        navigation.navigate('Auth', {
          screen: 'Login',
          params: {
            redirectTo: 'BookingSummary',
            bookingParams: { serviceId, barberId, date, timeSlot }
          }
        });
      }
    };
    checkAuth();
  }, [user, serviceId, barberId, date, timeSlot]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const api = new ApiService();
        const [serviceRes, barberRes] = await Promise.all([
          api.getService(serviceId),
          api.getBarber(barberId),
        ]);
        setService(serviceRes);
        setBarber(barberRes);
      } catch (err: any) {
        setError('Erreur lors du chargement des détails.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [serviceId, barberId]);

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      // Calculate end time
      const [hour, minute] = timeSlot.split(':').map(Number);
      const startDate = new Date(date);
      startDate.setHours(hour, minute, 0, 0);
      const endDate = new Date(startDate.getTime() + (service.duration || 30) * 60000);
      const api = new ApiService();
      await api.createAppointment({
        serviceId: serviceId,
        barberId: barberId,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      });
      navigation.navigate('BookingSuccess', {
        service: { name: service.name, price: service.price },
        barber: { firstName: barber.firstName, lastName: barber.lastName },
        date,
        startTime: timeSlot,
        endTime: endDate.toTimeString().slice(0,5),
      });
    } catch (err: any) {
      console.error('Booking API error:', err);
      Alert.alert('Erreur', err.message || 'Erreur lors de la réservation.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#22c55e" style={{ flex: 1, justifyContent: 'center' }} />;
  }
  if (error || !service || !barber) {
    return <View style={styles.outerContainer}><Text style={{ color: 'red' }}>{error || 'Erreur inconnue.'}</Text></View>;
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <Ionicons name="checkmark-circle" size={56} color="#22c55e" />
        </View>
        <Text style={styles.title}>Résumé de la réservation</Text>
        <View style={styles.summary}>
          <SummaryRow label="Service" value={service.name} />
          <SummaryRow label="Coiffeur" value={`${barber.firstName} ${barber.lastName}`} />
          <SummaryRow label="Date" value={formatDate(date)} />
          <SummaryRow label="Heure" value={timeSlot} />
          <SummaryRow label="Prix" value={`${service.price}€`} />
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmButtonText}>Confirmer</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  summary: {
    width: '100%',
    marginBottom: 32,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  label: {
    fontWeight: '500',
    color: '#4b5563',
    fontSize: 16,
  },
  value: {
    fontWeight: '600',
    color: '#111827',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
    gap: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});

export default BookingSummaryScreen; 