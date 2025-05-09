import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { COLORS } from '../constants/theme';

type BarberDetailsRouteProp = RouteProp<RootStackParamList, 'BarberDetails'>;

export const BarberDetailsScreen = () => {
  const route = useRoute<BarberDetailsRouteProp>();
  const { barber } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: barber.profileImage }} 
          style={styles.profileImage}
        />
        <Text style={styles.name}>{barber.name}</Text>
        <Text style={styles.rating}>⭐ {barber.rating}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{barber.bio}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        {barber.services.map((service, index) => (
          <View key={index} style={styles.serviceItem}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.servicePrice}>${service.price}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        <Text style={styles.availability}>
          {barber.availability ? 'Available Now' : 'Not Available'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  rating: {
    fontSize: 18,
    color: COLORS.primary,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  serviceName: {
    fontSize: 16,
    color: COLORS.text,
  },
  servicePrice: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  availability: {
    fontSize: 16,
    color: COLORS.text,
  },
}); 