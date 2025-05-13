import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';

// Define the expected params for this screen
interface BookingConfirmationParams {
  service: { name: string; price: number };
  barber: { firstName: string; lastName: string };
  date: string; // ISO string
  startTime: string; // e.g. '14:00'
  endTime: string; // e.g. '14:30'
}

type RouteParams = {
  params: BookingConfirmationParams;
};

const BookingConfirmationScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const { service, barber, date, startTime, endTime } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>✔️</Text>
      </View>
      <Text style={styles.title}>Rendez-vous confirmé</Text>
      <Text style={styles.subtitle}>Votre rendez-vous a été réservé avec succès !</Text>
      <View style={styles.summary}>
        <SummaryRow label="Service" value={service.name} />
        <SummaryRow label="Coiffeur" value={`${barber.firstName} ${barber.lastName}`} />
        <SummaryRow label="Date" value={formatDate(date)} />
        <SummaryRow label="Heure" value={`${startTime} - ${endTime}`} />
        <SummaryRow label="Prix" value={`${service.price}€`} />
      </View>
      <View style={styles.actions}>
        <Button title="Voir mes rendez-vous" onPress={() => navigation.navigate('Main', { screen: 'Appointments' })} />
        <Button title="Retour à l'accueil" onPress={() => navigation.navigate('Main', { screen: 'Home' })} />
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconWrapper: {
    backgroundColor: '#22c55e',
    borderRadius: 50,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 40,
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  label: {
    fontWeight: '500',
    color: '#4b5563',
  },
  value: {
    fontWeight: '600',
    color: '#111827',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
});

export default BookingConfirmationScreen; 