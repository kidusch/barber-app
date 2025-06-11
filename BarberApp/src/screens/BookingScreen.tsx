import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Booking: undefined;
  Profile: undefined;
};

type BookingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Booking'>;
};

export default function BookingScreen({ navigation }: BookingScreenProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('');

  const handleBooking = () => {
    // TODO: Implement booking logic
    alert('Booking submitted!');
    navigation.navigate('Home');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book Your Appointment</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          placeholder="Select date"
          value={date}
          onChangeText={setDate}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Time</Text>
        <TextInput
          style={styles.input}
          placeholder="Select time"
          value={time}
          onChangeText={setTime}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Service</Text>
        <TextInput
          style={styles.input}
          placeholder="Select service"
          value={service}
          onChangeText={setService}
        />
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={handleBooking}
      >
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
}); 