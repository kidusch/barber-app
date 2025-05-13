import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Appointment {
  id: string;
  service: string;
  barber: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
}

const placeholderAppointments: Appointment[] = [
  {
    id: '1',
    service: 'Haircut',
    barber: 'Michael Brown',
    date: '2025-05-19',
    startTime: '13:30',
    endTime: '14:00',
    price: 25,
  },
  {
    id: '2',
    service: 'Beard Trim',
    barber: 'Sarah Lee',
    date: '2025-05-22',
    startTime: '10:00',
    endTime: '10:30',
    price: 15,
  },
];

const ActiveAppointmentsScreen = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setAppointments(placeholderAppointments);
      setLoading(false);
    }, 800);
  }, []);

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
                <Text style={styles.service}>{item.service}</Text>
                <Text style={styles.price}>{item.price}€</Text>
              </View>
              <Text style={styles.barber}>Coiffeur: {item.barber}</Text>
              <View style={styles.rowBetween}>
                <Text style={styles.date}>{formatDate(item.date)}</Text>
                <Text style={styles.time}>{item.startTime} - {item.endTime}</Text>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.modifyButton} onPress={() => {}}>
                  <Text style={styles.modifyButtonText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => {}}>
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