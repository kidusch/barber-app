import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { User, Barber, Service, AppointmentDetails } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppContextType {
  user: User | null;
  barbers: Barber[];
  services: Service[];
  appointments: AppointmentDetails[];
  loading: boolean;
  error: string | null;
  api: ApiService;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAppointments: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<AppointmentDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = new ApiService();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [barbersData, servicesData] = await Promise.all([
        api.getBarbers(),
        api.getServices()
      ]);
      setBarbers(barbersData);
      setServices(servicesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const userProfile = await api.getCurrentUser();
        setUser(userProfile);
        await refreshAppointments();
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      await AsyncStorage.removeItem('token');
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const loginResponse = await api.login(email, password);
      await AsyncStorage.setItem('token', loginResponse.token);

      // Fetch user profile after login
      const userProfile = await api.getCurrentUser();
      setUser(userProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUser(null);
      setAppointments([]);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const refreshAppointments = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const appointmentsData = await api.getAppointments(user.id);
      setAppointments(appointmentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    barbers,
    services,
    appointments,
    loading,
    error,
    api,
    login,
    logout,
    refreshAppointments,
    setUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 