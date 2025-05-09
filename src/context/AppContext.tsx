import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { User, Barber, Service, AppointmentDetails } from '../types';

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
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

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await api.login(email, password);
      setUser(userData);
      if (userData) {
        await refreshAppointments();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAppointments([]);
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
    refreshAppointments
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