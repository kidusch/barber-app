import { 
  mockBarbers, 
  mockServices, 
  mockUsers, 
  mockAppointments, 
  mockReviews 
} from '../mocks/data';
import { 
  User, 
  Barber, 
  Service, 
  Appointment, 
  Review, 
  AppointmentDetails 
} from '../types';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use 10.0.2.2 for Android and local IP for iOS
const API_BASE_URL = Platform.select({
  android: "http://10.0.2.2:8000",
  ios: "http://192.168.1.181:8000",
}) || "http://192.168.1.181:8000";

export class ApiService {
  // Auth
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || 'Registration failed');
    }
    
    return responseData;
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || 'Invalid credentials');
      }
      return responseData;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed. Please try again.');
    }
  }

  // Helper: refresh JWT token
  private async refreshTokenIfNeeded(): Promise<string | null> {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/api/token/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to refresh token');
      await AsyncStorage.setItem('token', data.token);
      if (data.refresh_token) {
        await AsyncStorage.setItem('refreshToken', data.refresh_token);
      }
      return data.token;
    } catch (err) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      return null;
    }
  }

  // Helper: fetch with auto token refresh
  private async fetchWithAuthRetry(url: string, options: any = {}, retry = true): Promise<Response> {
    let token = await AsyncStorage.getItem('token');
    options.headers = {
      ...(options.headers || {}),
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
    let response = await fetch(url, options);
    if (response.status === 401 && retry) {
      // Try to refresh token
      const newToken = await this.refreshTokenIfNeeded();
      if (newToken) {
        options.headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, options);
      }
    }
    return response;
  }

  // Barbers
  async getBarbers(): Promise<Barber[]> {
    const response = await fetch(`${API_BASE_URL}/api/barbers`);
    if (!response.ok) throw new Error('Failed to fetch barbers');
    return response.json();
  }

  async getBarber(id: string): Promise<Barber> {
    const response = await fetch(`${API_BASE_URL}/api/barbers/${id}`);
    if (!response.ok) throw new Error('Barber not found');
    return response.json();
  }

  // Services
  async getServices(): Promise<Service[]> {
    const response = await fetch(`${API_BASE_URL}/api/services`);
    if (!response.ok) throw new Error('Failed to fetch services');
    return response.json();
  }

  async getService(id: string): Promise<Service> {
    const response = await fetch(`${API_BASE_URL}/api/services/${id}`);
    if (!response.ok) throw new Error('Service not found');
    const data = await response.json();
    return data.service;
  }

  // Appointments
  async getAppointments(userId: string): Promise<AppointmentDetails[]> {
    const response = await this.fetchWithAuthRetry(`${API_BASE_URL}/api/appointments?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return response.json();
  }

  async createAppointment(appointment: {
    serviceId: string;
    barberId: string;
    startTime: string;
    endTime: string;
  }): Promise<any> {
    const response = await this.fetchWithAuthRetry(`${API_BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment)
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      throw new Error('Failed to create appointment: ' + errorText);
    }
    return response.json();
  }

  async updateAppointment(id: string, status: Appointment['status']): Promise<Appointment> {
    const response = await this.fetchWithAuthRetry(`${API_BASE_URL}/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update appointment');
    return response.json();
  }

  // User info (current user)
  async getCurrentUser(): Promise<User> {
    const response = await this.fetchWithAuthRetry(`${API_BASE_URL}/api/users/me`);
    if (!response.ok) throw new Error('Failed to fetch current user');
    return response.json();
  }
}