import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, ActivityIndicator, TextInput, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const ACTIONS = [
  ['card-outline', 'Payment'],
  ['location-outline', 'Addresses'],
  ['star-outline', 'Reviews'],
  ['receipt-outline', 'Receipts'],
  ['document-text-outline', 'Terms & policies'],
  ['help-circle-outline', 'Help center'],
];

const INITIAL_COLORS = ['#6C3BC6', '#315B4A', '#B45A3C', '#2D5F8A', '#8B6B2E'];

function getInitials(firstName, lastName) {
  const f = (firstName || '').charAt(0).toUpperCase();
  const l = (lastName || '').charAt(0).toUpperCase();
  return f + l || 'U';
}

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return INITIAL_COLORS[Math.abs(hash) % INITIAL_COLORS.length];
}

function InitialsAvatar({ firstName, lastName, size = 55 }) {
  const name = `${firstName || ''}${lastName || ''}`;
  const bg = getAvatarColor(name);
  const initials = getInitials(firstName, lastName);
  return (
    <View style={[initialsAvatar.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
      <Text style={[initialsAvatar.text, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

const initialsAvatar = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#111' },
  text: { color: '#fff', fontWeight: '800' },
});

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editVisible, setEditVisible] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const data = await api.getMe();
      console.log('PROFILE API RESPONSE:', JSON.stringify(data));
      setUser(data.user);
    } catch (err) {
      console.log('PROFILE API ERROR:', err.message);
      Alert.alert('Error', 'Could not load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchUser);
    return unsubscribe;
  }, [navigation, fetchUser]);

  const openEdit = () => {
    if (!user) return;
    setEditFirstName(user.firstName || '');
    setEditLastName(user.lastName || '');
    setEditEmail(user.email || '');
    setEditVisible(true);
  };

  const handleSave = async () => {
    if (!editFirstName.trim() || !editLastName.trim()) {
      Alert.alert('Error', 'First and last name are required');
      return;
    }
    setSaving(true);
    try {
      const updated = await api.updateMe({
        firstName: editFirstName.trim(),
        lastName: editLastName.trim(),
      });
      setUser(updated.user);
      setEditVisible(false);
      Alert.alert('Success', 'Profile updated');
    } catch (err) {
      Alert.alert('Error', err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const confirmSignOut = () => {
    Alert.alert('Sign out?', 'Are you sure you want to sign out of VisionFit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        <View style={s.loading}>
          <ActivityIndicator size="large" color="#6C3BC6" />
        </View>
      </SafeAreaView>
    );
  }

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'
    : 'User';

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.header}>
          <Text style={s.title}>Profile</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={21} />
          </TouchableOpacity>
        </View>

        <View style={s.user}>
          <InitialsAvatar firstName={user?.firstName} lastName={user?.lastName} />
          <View style={s.userText}>
            <View style={s.nameRow}>
              <Text style={s.name}>{displayName}</Text>
              <TouchableOpacity onPress={openEdit}>
                <Ionicons name="create-outline" size={15} />
              </TouchableOpacity>
            </View>
            <Text style={s.email}>{user?.email || ''}</Text>
            <Text style={s.status}>Style status: Explorer</Text>
          </View>
        </View>

        <View style={s.orders}>
          <View style={s.ordersHead}>
            <Text style={s.ordersTitle}>My orders</Text>
            <TouchableOpacity>
              <Text style={s.all}>All orders</Text>
            </TouchableOpacity>
          </View>
          <View style={s.orderRow}>
            {[
              ['receipt-outline', 'Unpaid'],
              ['time-outline', 'Processing'],
              ['car-outline', 'Shipped'],
              ['cube-outline', 'Delivery'],
            ].map(([icon, label]) => (
              <TouchableOpacity style={s.order} key={label}>
                <Ionicons name={icon} size={25} />
                <Text style={s.orderText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={s.grid}>
          {ACTIONS.map(([icon, label]) => (
            <TouchableOpacity style={s.action} key={label}>
              <View style={s.actionIcon}>
                <Ionicons name={icon} size={21} />
              </View>
              <Text style={s.actionText}>{label}</Text>
              <Ionicons name="chevron-forward" size={15} color="#888" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.fitCard}>
          <View>
            <Text style={s.fitEyebrow}>YOUR EYEWEAR PROFILE</Text>
            <Text style={s.fitTitle}>Complete your fit</Text>
            <Text style={s.fitText}>
              Add your prescription and face shape for tailored recommendations.
            </Text>
          </View>
          <TouchableOpacity
            style={s.fitButton}
            onPress={() => navigation.navigate('Prescription')}
          >
            <Text style={s.fitButtonText}>Set up</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={s.signOut} onPress={confirmSignOut}>
          <Ionicons name="log-out-outline" size={19} color="#9B4DCA" />
          <Text style={s.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={editVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={s.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Edit Profile</Text>

            <Text style={s.fieldLabel}>First Name</Text>
            <TextInput
              style={s.modalInput}
              value={editFirstName}
              onChangeText={setEditFirstName}
              placeholder="First name"
              placeholderTextColor="#999"
            />

            <Text style={s.fieldLabel}>Last Name</Text>
            <TextInput
              style={s.modalInput}
              value={editLastName}
              onChangeText={setEditLastName}
              placeholder="Last name"
              placeholderTextColor="#999"
            />

            <Text style={s.fieldLabel}>Email</Text>
            <TextInput
              style={[s.modalInput, s.modalInputDisabled]}
              value={editEmail}
              editable={false}
              placeholder="Email"
              placeholderTextColor="#999"
            />

            <View style={s.modalButtons}>
              <TouchableOpacity
                style={s.modalCancel}
                onPress={() => setEditVisible(false)}
                disabled={saving}
              >
                <Text style={s.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.modalSave, saving && { opacity: 0.6 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={s.modalSaveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, paddingBottom: 30 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 17,
  },
  title: { fontSize: 25, fontWeight: '900', letterSpacing: -0.6 },
  user: {
    backgroundColor: '#fff',
    borderRadius: 13,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userText: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { fontSize: 16, fontWeight: '900' },
  email: { fontSize: 11, color: '#888', marginTop: 2 },
  status: { fontSize: 11, color: '#6C6C6C', marginTop: 4 },
  orders: {
    backgroundColor: '#fff',
    borderRadius: 13,
    padding: 15,
    marginTop: 12,
  },
  ordersHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  ordersTitle: { fontSize: 15, fontWeight: '900' },
  all: { fontSize: 11, color: '#565656' },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between' },
  order: { alignItems: 'center', width: '24%' },
  orderText: { fontSize: 10, marginTop: 6 },
  grid: {
    backgroundColor: '#fff',
    borderRadius: 13,
    marginTop: 12,
    overflow: 'hidden',
  },
  action: {
    height: 58,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 12,
  },
  actionIcon: { width: 28, alignItems: 'center' },
  actionText: { flex: 1, fontSize: 13, fontWeight: '600' },
  fitCard: {
    backgroundColor: '#E8DDF2',
    borderRadius: 13,
    padding: 17,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fitEyebrow: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: '#6C507B',
  },
  fitTitle: { fontSize: 17, fontWeight: '900', marginTop: 4 },
  fitText: {
    fontSize: 11,
    color: '#514E53',
    lineHeight: 15,
    marginTop: 4,
    width: '78%',
  },
  fitButton: {
    position: 'absolute',
    right: 14,
    bottom: 17,
    height: 33,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  fitButtonText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  signOut: {
    marginTop: 16,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5C8CC',
    backgroundColor: '#FFF7F7',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: { fontSize: 13, fontWeight: '700', color: '#9B4DCA' },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 22,
    paddingBottom: 36,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDD',
    alignSelf: 'center',
    marginBottom: 18,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 20 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  modalInput: {
    height: 50,
    backgroundColor: '#F1F3F4',
    borderWidth: 1,
    borderColor: '#D7DBD8',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#111',
    marginBottom: 14,
  },
  modalInputDisabled: {
    backgroundColor: '#E8E8E8',
    color: '#888',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  modalCancel: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D7DBD8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: { fontSize: 15, fontWeight: '700', color: '#555' },
  modalSave: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#6C3BC6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
