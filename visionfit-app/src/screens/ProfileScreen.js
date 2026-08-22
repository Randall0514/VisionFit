import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity
} from 'react-native';

const menuItems = [
  { id: 1, label: 'Personal information', icon: '👤' },
  { id: 2, label: 'Test history', icon: '⏱' },
  { id: 3, label: 'Reminders', icon: '🔔' },
  { id: 4, label: 'Settings', icon: '⚙️' },
  { id: 5, label: 'About VisionFit', icon: 'ℹ️' },
  { id: 6, label: 'Help & support', icon: '❓' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.overline}>ACCOUNT</Text>
            <Text style={styles.title}>My profile</Text>
          </View>
          <TouchableOpacity style={styles.settingsBtn}>
            <Text style={styles.settingsIcon}>✳️</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>AC</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Amara Chen</Text>
            <Text style={styles.profileEmail}>amara@email.com</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === 0 && styles.menuItemFirst,
                index === menuItems.length - 1 && styles.menuItemLast,
              ]}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconWrap}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7F2' },
  content: { padding: 24 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 24, marginTop: 10,
  },
  overline: { fontSize: 11, fontWeight: '700', color: '#888', letterSpacing: 0.5, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#222' },
  settingsBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  settingsIcon: { fontSize: 18 },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  avatarCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#618264',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 14,
  },
  avatarText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: 'bold', color: '#222', marginBottom: 3 },
  profileEmail: { fontSize: 13, color: '#888' },
  editBtn: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0',
  },
  editBtnText: { fontSize: 12, fontWeight: '600', color: '#444' },
  menuList: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16, paddingHorizontal: 18,
    borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  menuItemFirst: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  menuItemLast: { borderBottomWidth: 0, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#F2F5F2',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 14,
  },
  menuIcon: { fontSize: 16 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
  chevron: { fontSize: 22, color: '#CCC' },
});
