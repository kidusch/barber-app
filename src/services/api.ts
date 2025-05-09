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

// Use 10.0.2.2 for Android and localhost for iOS
const API_BASE_URL = Platform.select({
  android: "http://10.0.2.2:8000",
  ios: "http://localhost:8000",
}) || "http://localhost:8000";

export class ApiService {
  // Auth
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }): Promise<User> {
    console.log('Making registration API call to:', `${API_BASE_URL}/api/register`);
    console.log('With data:', { ...data, password: '***' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      console.log('Registration response status:', response.status);
      const responseData = await response.json();
      console.log('Registration response data:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Registration failed');
      }
      
      return responseData;
    } catch (error) {
      console.error('Registration API error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Registration failed. Please try again.');
    }
  }

  async login(email: string, password: string): Promise<User> {
    console.log('Attempting login with:', { email, password: '***' });
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      console.log('Login response:', response.status);
      
      const responseData = await response.json();
      console.log('Login response data:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Invalid credentials');
      }
      return responseData;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed. Please try again.');
    }
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
    const response = await fetch(`${API_BASE_URL}/api/appointments?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return response.json();
  }

  async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment)
    });
    if (!response.ok) throw new Error('Failed to create appointment');
    return response.json();
  }

  async updateAppointment(id: string, status: Appointment['status']): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update appointment');
    return response.json();
  }

  // User info (current user)
  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/users/me`);
    if (!response.ok) throw new Error('Failed to fetch user info');
    return response.json();
  }

  // Reviews
  async getBarberReviews(barberId: string): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/api/reviews?barberId=${barberId}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  }

  async createReview(review: Omit<Review, 'id' | 'date'>): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    if (!response.ok) throw new Error('Failed to create review');
    return response.json();
  }
} 