import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ApiService } from '../services/api';
import { useApp } from '../context/AppContext';

interface Appointment {
  id: string;
  service: string;
  barber: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
}

const ActiveAppointmentsScreen = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const { user } = useApp();

  console.log('ActiveAppointmentsScreen rendered, user:', user);

  useEffect(() => {
    console.log('Effect triggered, user:', user);
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('user:', user);
        const api = new ApiService();
        let data;
        if (user?.id) {
          console.log('About to call api.getAppointments()');
          data = await api.getAppointments();
          console.log('api.getAppointments() returned', data);
        } else {
          setAppointments([]);
          setLoading(false);
          return;
        }
        if (Array.isArray(data)) {
          setAppointments(data);
          console.log('Fetched appointments (array):', data);
        } else if (data && typeof data === 'object' && 'appointments' in data && Array.isArray((data as any).appointments)) {
          setAppointments((data as any).appointments);
          console.log('Fetched appointments (object.appointments):', (data as any).appointments);
        } else {
          setAppointments([]);
          console.log('Fetched appointments: [] or unexpected structure', data);
        }
      } catch (err: any) {
        console.log('Error fetching appointments:', err, err?.stack);
        setError(err.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    try {
      if (user?.id) fetchAppointments();
    } catch (e) {
      console.log('Top-level error in useEffect:', e, (e as any)?.stack);
    }
  }, [user?.id]);

  const handleCancel = (id: string) => {
    // Show confirmation dialog
    Alert.alert(
      'Annuler le rendez-vous',
      'Êtes-vous sûr de vouloir annuler ce rendez-vous ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui',
          style: 'destructive',
          onPress: () => {
            // Placeholder: remove from list
            setAppointments((prev) => prev.filter((a) => a.id !== id));
            // TODO: Call backend to cancel
          },
        },
      ]
    );
  };

  const handleModify = (id: string) => {
    (navigation as any).navigate('ModifyAppointment', { appointmentId: id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rendez-vous actifs</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#16a34a" style={{ marginTop: 40 }} />
      ) : appointments.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyText}>Aucun rendez-vous actif</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.service}>{item.service?.name}</Text>
                <Text style={styles.price}>{item.service?.price}€</Text>
              </View>
              <Text style={styles.barber}>Coiffeur: {item.barber?.firstName} {item.barber?.lastName}</Text>
              <View style={styles.rowBetween}>
                <Text style={styles.date}>{formatDate(item.date)}</Text>
                <Text style={styles.time}>{item.startTime} - {item.endTime}</Text>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.modifyButton} onPress={() => handleModify(item.id)}>
                  <Text style={styles.modifyButtonText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(item.id)}>
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 18,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  service: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16a34a',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  barber: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 4,
  },
  date: {
    fontSize: 15,
    color: '#4b5563',
  },
  time: {
    fontSize: 15,
    color: '#4b5563',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 10,
  },
  modifyButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginRight: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  modifyButtonText: {
    color: '#16a34a',
    fontWeight: '600',
    fontSize: 15,
  },
  cancelButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#ef4444',
  },
  cancelButtonText: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 15,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 18,
    marginTop: 16,
  },
});

export default ActiveAppointmentsScreen; 