import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

type MenuItem = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export const ProfileScreen = () => {
  const { user, logout } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  React.useEffect(() => {
    if (!user) {
      navigation.navigate('Auth');
    }
  }, [user, navigation]);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: () => logout() },
      ],
      { cancelable: true }
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'account',
      title: 'Mon compte',
      icon: 'person-outline',
      onPress: () => navigation.navigate('MonCompte'),
    },
    {
      id: 'appointments',
      title: 'Rendez-vous actifs',
      icon: 'calendar-outline',
      onPress: () => navigation.navigate('ActiveAppointments'),
    },
    {
      id: 'history',
      title: 'Historique des rendez-vous',
      icon: 'time-outline',
      onPress: () => {},
    },
    {
      id: 'privacy',
      title: 'Intimité',
      icon: 'shield-outline',
      onPress: () => {},
    },
    {
      id: 'about',
      title: 'À propos de',
      icon: 'information-circle-outline',
      onPress: () => {},
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.split(' ')[0]?.[0]?.toUpperCase() || ''}
              {user?.name?.split(' ')[1]?.[0]?.toUpperCase() || ''}
            </Text>
          </View>
          <Text style={styles.name}>
            {user?.name}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemContent}>
              <Ionicons
                name={item.icon}
                size={24}
                color={COLORS.primary}
                style={styles.menuItemIcon}
              />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={COLORS.gray}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.logoutContainer}>
        <Button
          title="Se déconnecter"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  userInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.primary,
  },
  name: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white + '99',
  },
  menuContainer: {
    padding: SPACING.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: SPACING.md,
  },
  menuItemText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  logoutContainer: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  logoutButton: {
    borderColor: COLORS.error,
  },
}); 