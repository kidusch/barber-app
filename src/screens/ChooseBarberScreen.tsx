import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { ApiService } from '../services/api';
import { Barber } from '../types';

export const ChooseBarberScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { serviceId } = (route.params || {}) as { serviceId: string };

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      setLoading(true);
      setError(null);
      try {
        const api = new ApiService();
        const response = await api.getBarbers();
        // The backend returns { barbers: [...] } or just an array
        if (Array.isArray(response)) {
          setBarbers(response);
        } else if (response && Array.isArray(response.barbers)) {
          setBarbers(response.barbers);
        } else {
          setBarbers([]);
        }
      } catch (err: any) {
        setError('Failed to fetch barbers');
      } finally {
        setLoading(false);
      }
    };
    fetchBarbers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Barber</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : (
        <FlatList
          data={barbers}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const displayName = (item as any).firstName && (item as any).lastName
              ? `${(item as any).firstName} ${(item as any).lastName}`
              : item.name || item.email || 'Barber';
            const avatar = (item as any).profileImage || (item as any).avatar || 'https://randomuser.me/api/portraits/men/1.jpg';
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('ChooseTimeSlot' as never, { serviceId, barberId: item.id } as never)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <Text style={styles.barberName}>{displayName}</Text>
              </TouchableOpacity>
            );
          }}
        />
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
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    alignSelf: 'center',
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  barberName: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    fontWeight: '600',
  },
}); 