import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Alert, Platform, StatusBar } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { ApiService } from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ModifyAppointmentScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ModifyAppointment'>>();
  const { appointmentId } = route.params;
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const api = new ApiService();
        const url = `/api/appointments/${appointmentId}`;
        console.log('Fetching appointment details for ID:', appointmentId, 'URL:', url);
        const data = await api.getAppointmentById(appointmentId);
        console.log('Fetched appointment details:', data);
        setAppointment(data);
        setDate(data.date);
        setStartTime(data.startTime);
        setEndTime(data.endTime);
      } catch (err: any) {
        console.log('Error fetching appointment details:', err);
        setError(err.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [appointmentId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const api = new ApiService();
      await api.updateAppointmentDetails(appointmentId, {
        startTime: `${date}T${startTime}`,
        endTime: `${date}T${endTime}`,
      });
      Alert.alert('Succès', 'Rendez-vous modifié avec succès', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Modifier le rendez-vous</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#16a34a" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : appointment ? (
        <View style={styles.form}>
          <Text style={styles.label}>Service</Text>
          <TextInput style={styles.input} value={appointment.service.name} editable={false} />
          <Text style={styles.label}>Coiffeur</Text>
          <TextInput style={styles.input} value={appointment.barber.firstName + ' ' + appointment.barber.lastName} editable={false} />
          <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
          <TextInput style={styles.input} value={date} onChangeText={setDate} />
          <Text style={styles.label}>Heure de début (HH:mm)</Text>
          <TextInput style={styles.input} value={startTime} onChangeText={setStartTime} />
          <Text style={styles.label}>Heure de fin (HH:mm)</Text>
          <TextInput style={styles.input} value={endTime} onChangeText={setEndTime} />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
            <Text style={styles.submitButtonText}>{submitting ? 'Modification...' : 'Enregistrer'}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  error: {
    color: '#ef4444',
    fontSize: 16,
    marginTop: 24,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontWeight: '600',
    color: '#374151',
    marginTop: 10,
    marginBottom: 2,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#111827',
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 18,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 