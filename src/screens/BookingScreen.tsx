import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';

export const BookingScreen = () => {
  const navigation = useNavigation();
  const { user } = useApp();
  const route = useRoute();

  useEffect(() => {
    if (!user) {
      // Redirect to Auth screen, passing current route params for after login
      navigation.navigate('Auth', {
        redirectTo: 'Booking',
        params: route.params,
      });
    }
  }, [user]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Redirecting to login...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Booking Screen</Text>
      {/* Booking UI goes here */}
      <Button title="Reserve" onPress={() => {/* Reservation logic */}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 