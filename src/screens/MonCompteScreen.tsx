import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export const MonCompteScreen = () => {
  const { user, api, setUser } = useApp();

  console.log('User in MonCompteScreen:', user);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [editFirstName, setEditFirstName] = React.useState(user?.firstName || '');
  const [editLastName, setEditLastName] = React.useState(user?.lastName || '');
  const [editPhone, setEditPhone] = React.useState(user?.phoneNumber || '');
  const [editPassword, setEditPassword] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  if (!user) {
    return null;
  }

  const fullName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.firstName || user.lastName || user.email;

  const openEditModal = () => {
    setEditFirstName(user.firstName || '');
    setEditLastName(user.lastName || '');
    setEditPhone(user.phoneNumber || '');
    setEditPassword('');
    setCurrentPassword('');
    setModalVisible(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedUser = await api.updateCurrentUser({
        firstName: editFirstName,
        lastName: editLastName,
        phoneNumber: editPhone,
      });
      setUser(updatedUser);
      if (editPassword) {
        if (!currentPassword) {
          Alert.alert('Erreur', 'Veuillez entrer votre mot de passe actuel pour changer le mot de passe.');
          setSaving(false);
          return;
        }
        await api.changePassword(currentPassword, editPassword);
        Alert.alert('Succès', 'Votre profil et mot de passe ont été mis à jour.');
      } else {
        Alert.alert('Succès', 'Votre profil a été mis à jour.');
      }
      setModalVisible(false);
    } catch (err) {
      console.log('Erreur lors de la mise à jour du profil:', err);
      Alert.alert('Erreur', 'La mise à jour a échoué.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={80} color={COLORS.primary} style={styles.avatar} />
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nom</Text>
        <Text style={styles.value}>{fullName}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>
        <Text style={styles.label}>Téléphone</Text>
        <Text style={styles.value}>{user.phoneNumber}</Text>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
        <Text style={styles.editButtonText}>Modifier</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier mon compte</Text>
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              value={editFirstName}
              onChangeText={setEditFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Nom de famille"
              value={editLastName}
              onChangeText={setEditLastName}
            />
            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              value={editPhone}
              onChangeText={setEditPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Nouveau mot de passe"
              value={editPassword}
              onChangeText={setEditPassword}
              secureTextEntry
            />
            {editPassword ? (
              <TextInput
                style={styles.input}
                placeholder="Mot de passe actuel"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
            ) : null}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                disabled={saving}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.modalButtonText}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatar: {
    marginBottom: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginTop: SPACING.sm,
  },
  value: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  editButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
    color: COLORS.primary,
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  modalButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginHorizontal: SPACING.sm,
  },
  cancelButton: {
    backgroundColor: COLORS.gray,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  modalButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.md,
  },
}); 