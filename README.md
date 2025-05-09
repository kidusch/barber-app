# Geneva Barbers Mobile App

A React Native mobile application for Geneva Barbers that allows clients to book appointments, manage their bookings, and interact with barber services.

## Features

- User Authentication (Login/Register)
- Browse Available Services
- Book Appointments
- View Active Appointments
- View Appointment History
- Manage User Profile
- Push Notifications for Appointment Reminders

## Prerequisites

- Node.js >= 14
- npm or yarn
- iOS Simulator (for iOS development)
- Android Studio & Android SDK (for Android development)
- Expo CLI

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd barber-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on iOS or Android:
```bash
# For iOS
npm run ios

# For Android
npm run android
```

## Environment Setup

The app requires certain environment variables to be set up. Create a `.env` file in the root directory with the following variables:

```env
API_URL=<your-api-url>
```

## Project Structure

```
src/
├── assets/         # Images, fonts, and other static files
├── components/     # Reusable components
├── constants/      # Constants and theme configuration
├── hooks/         # Custom hooks
├── navigation/    # Navigation configuration
├── screens/       # Screen components
├── services/      # API services
├── store/         # Redux store configuration
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## API Integration

The mobile app integrates with the Geneva Barbers backend API. The API endpoints are configured in `src/services/api.ts`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 