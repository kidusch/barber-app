import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

interface Params {
  service: { name: string; price: number };
  barber: { firstName: string; lastName: string };
  date: string;
  startTime: string;
  endTime: string;
}

type RouteParams = {
  params: Params;
};

const BookingSuccessScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const { service, barber, date, startTime, endTime } = route.params;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <Ionicons name="checkmark-circle" size={72} color="#22c55e" />
        </View>
        <Text style={styles.title}>Rendez-vous confirmé !</Text>
        <Text style={styles.subtitle}>Votre rendez-vous a été réservé avec succès.</Text>
        <View style={styles.summary}>
          <SummaryRow label="Service" value={service.name} />
          <SummaryRow label="Coiffeur" value={`${barber.firstName} ${barber.lastName}`} />
          <SummaryRow label="Date" value={formatDate(date)} />
          <SummaryRow label="Heure" value={`${startTime} - ${endTime}`} />
          <SummaryRow label="Prix" value={`${service.price}€`} />
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('ActiveAppointments')}>
            <Text style={styles.primaryButtonText}>Voir mes rendez-vous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
            <Text style={styles.secondaryButtonText}>Retour à l'accueil</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
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
    marginTop: 8,
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#16a34a',
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: 'center',
    marginRight: 5,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: 'center',
    marginLeft: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});

export default BookingSuccessScreen; 