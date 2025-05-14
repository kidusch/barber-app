import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, MainTabParamList, AuthStackParamList } from '../types/navigation';
import { RootState } from '../store';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';

// Screens
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { AppointmentsScreen } from '../screens/AppointmentsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { BarberDetailsScreen } from '../screens/BarberDetailsScreen';
import { BookingScreen } from '../screens/BookingScreen';
import SplashScreen from '../screens/SplashScreen';
import { ChooseBarberScreen } from '../screens/ChooseBarberScreen';
import { ChooseTimeSlotScreen } from '../screens/ChooseTimeSlotScreen';
import { MonCompteScreen } from '../screens/MonCompteScreen';
import BookingSummaryScreen from '../screens/BookingSummaryScreen';
import BookingSuccessScreen from '../screens/BookingSuccessScreen';
import ActiveAppointmentsScreen from '../screens/ActiveAppointmentsScreen';
import ModifyAppointmentScreen from '../screens/ModifyAppointmentScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingBottom: 20,
          paddingTop: 10,
          height: 70,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

export const Navigation = () => {
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={MainNavigator} />
      <Stack.Screen 
        name="BarberDetails" 
        component={BarberDetailsScreen}
        options={{ headerShown: true, title: 'Barber Details' }}
      />
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen}
        options={{ headerShown: true, title: 'Book Appointment' }}
      />
      <Stack.Screen name="ChooseBarber" component={ChooseBarberScreen} options={{ headerShown: true, title: 'Choose Barber' }} />
      <Stack.Screen name="ChooseTimeSlot" component={ChooseTimeSlotScreen} options={{ headerShown: true, title: 'Choose Time Slot' }} />
      <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} options={{ headerShown: true, title: 'Résumé de la réservation' }} />
      <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} options={{ headerShown: true, title: 'Succès de la réservation', headerBackVisible: false }} />
      <Stack.Screen name="ActiveAppointments" component={ActiveAppointmentsScreen} options={{ headerShown: true, title: 'Rendez-vous actifs' }} />
      <Stack.Screen name="ModifyAppointment" component={ModifyAppointmentScreen} options={{ headerShown: true, title: 'Modifier le rendez-vous' }} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="MonCompte" component={MonCompteScreen} options={{ headerShown: true, title: 'Mon compte' }} />
    </Stack.Navigator>
  );
}; 