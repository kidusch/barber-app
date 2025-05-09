export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'client' | 'barber' | 'admin';
  profileImage?: string;
}

export interface Barber extends User {
  role: 'barber';
  specialties: string[];
  rating: number;
  experience: number; // years
  availability: {
    [key: string]: { // day of week
      start: string; // HH:mm format
      end: string;
    };
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  image?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  date: string; // ISO date string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export interface Review {
  id: string;
  appointmentId: string;
  clientId: string;
  barberId: string;
  rating: number;
  comment: string;
  date: string; // ISO date string
}

export interface AppointmentDetails extends Appointment {
  client: User;
  barber: Barber;
  service: Service;
  review?: Review;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AppointmentState {
  active: Appointment[];
  history: Appointment[];
  isLoading: boolean;
  error: string | null;
} 