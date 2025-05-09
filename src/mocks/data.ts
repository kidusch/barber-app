import { User, Barber, Service, Appointment, Review } from '../types';

export const mockBarbers: Barber[] = [
  {
    id: 'b1',
    name: 'John Smith',
    email: 'john.smith@barbershop.com',
    phoneNumber: '+41 76 123 45 67',
    role: 'barber',
    profileImage: 'https://example.com/john-smith.jpg',
    specialties: ['Classic Cuts', 'Beard Trimming', 'Hot Towel Shave'],
    rating: 4.8,
    experience: 8,
    availability: {
      'monday': { start: '09:00', end: '17:00' },
      'tuesday': { start: '09:00', end: '17:00' },
      'wednesday': { start: '09:00', end: '17:00' },
      'thursday': { start: '09:00', end: '17:00' },
      'friday': { start: '09:00', end: '17:00' },
    }
  },
  {
    id: 'b2',
    name: 'Mike Johnson',
    email: 'mike.johnson@barbershop.com',
    phoneNumber: '+41 76 234 56 78',
    role: 'barber',
    profileImage: 'https://example.com/mike-johnson.jpg',
    specialties: ['Modern Styles', 'Hair Coloring', 'Fades'],
    rating: 4.9,
    experience: 12,
    availability: {
      'monday': { start: '10:00', end: '18:00' },
      'tuesday': { start: '10:00', end: '18:00' },
      'wednesday': { start: '10:00', end: '18:00' },
      'thursday': { start: '10:00', end: '18:00' },
      'saturday': { start: '09:00', end: '16:00' },
    }
  }
];

export const mockServices: Service[] = [
  {
    id: 's1',
    name: 'Classic Haircut',
    description: 'Traditional haircut with scissors and clippers',
    duration: 30,
    price: 35,
    image: 'https://example.com/classic-haircut.jpg'
  },
  {
    id: 's2',
    name: 'Beard Trim',
    description: 'Professional beard trimming and shaping',
    duration: 20,
    price: 25,
    image: 'https://example.com/beard-trim.jpg'
  },
  {
    id: 's3',
    name: 'Hot Towel Shave',
    description: 'Luxurious traditional straight razor shave',
    duration: 45,
    price: 40,
    image: 'https://example.com/hot-towel-shave.jpg'
  },
  {
    id: 's4',
    name: 'Hair & Beard Combo',
    description: 'Complete haircut and beard grooming service',
    duration: 60,
    price: 55,
    image: 'https://example.com/hair-beard-combo.jpg'
  }
];

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'David Brown',
    email: 'david.brown@example.com',
    phoneNumber: '+41 76 345 67 89',
    role: 'client',
    profileImage: 'https://example.com/david-brown.jpg'
  },
  {
    id: 'u2',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phoneNumber: '+41 76 456 78 90',
    role: 'client',
    profileImage: 'https://example.com/sarah-wilson.jpg'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    clientId: 'u1',
    barberId: 'b1',
    serviceId: 's1',
    date: '2024-03-15T14:00:00.000Z',
    status: 'confirmed',
    notes: 'Regular customer, prefers scissors over clippers'
  },
  {
    id: 'a2',
    clientId: 'u2',
    barberId: 'b2',
    serviceId: 's4',
    date: '2024-03-16T10:00:00.000Z',
    status: 'pending'
  }
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    appointmentId: 'a1',
    clientId: 'u1',
    barberId: 'b1',
    rating: 5,
    comment: 'Great service as always! John really knows what he\'s doing.',
    date: '2024-03-15T15:00:00.000Z'
  }
]; 