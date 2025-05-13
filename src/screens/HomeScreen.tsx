import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { ApiService } from '../services/api';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching services...');
        const api = new ApiService();
        const response = await api.getServices();
        // The backend returns { services: [...] } or just an array
        if (Array.isArray(response)) {
          setServices(response);
          console.log('Set services (array):', response);
        } else if (response && Array.isArray(response.services)) {
          setServices(response.services);
          console.log('Set services (object):', response.services);
        } else {
          setServices([]);
          console.log('Set empty services:', response);
        }
      } catch (err: any) {
        console.error('Service fetch error:', err);
        setError('Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleServicePress = (service: any) => {
    navigation.navigate('ChooseBarber', { serviceId: service.id });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://png.pngtree.com/png-clipart/20220612/original/pngtree-barbershop-logo-png-image_7966220.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.welcomeText}>Welcome to Geneva Barbers</Text>
      </View>

      <View style={styles.servicesContainer}>
        <Text style={styles.sectionTitle}>Our Services</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text style={{ color: 'red' }}>{error}</Text>
        ) : (
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => handleServicePress(service)}
                activeOpacity={0.85}
              >
                <View style={styles.serviceIconContainer}>
                  <Text style={styles.serviceIcon}>{service.icon || '💈'}</Text>
                </View>
                <Text style={styles.serviceName}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logo: {
    width: 120,
    height: 120,
  },
  welcomeText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: SPACING.md,
  },
  servicesContainer: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    width: '48%',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  serviceIcon: {
    fontSize: 36,
  },
  serviceName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },
}); 