import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  BarberDetails: { barberId: string };
  ChooseBarber: { serviceId: string };
  ChooseTimeSlot: { serviceId: string; barberId: string };
  Booking: { serviceId: string; barberId: string; timeSlot: string };
};

export type MainTabParamList = {
  Home: undefined;
  Appointments: undefined;
  Profile: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = 
  NativeStackScreenProps<MainTabParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = 
  NativeStackScreenProps<AuthStackParamList, T>;

export type AppointmentStackParamList = {
  AppointmentList: undefined;
  AppointmentDetails: { appointmentId: number };
  BookAppointment: undefined;
  ConfirmAppointment: {
    barberId: number;
    serviceId: number;
    date: string;
    time: string;
  };
}; 