import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';\nimport { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>GOOD MORNING</Text>
            <Text style={styles.nameText}>Hi, Amara</Text>
          </View>
          <TouchableOpacity style={styles.bellButton}>
            <Text style={styles.bellEmoji}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Habit Card */}
        <View style={styles.habitCard}>
          <Text style={styles.habitLabel}>DAILY HABIT</Text>
          <Text style={styles.habitTitle}>The 20-20-20 rule</Text>
          <Text style={styles.habitDesc}>
            Every 20 minutes, look 20 feet away for 20 seconds — it gives your focusing muscles a break.
          </Text>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.actionEmoji}>👁</Text>
            </View>
            <Text style={styles.actionText}>Visual acuity</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.actionEmoji}>🎨</Text>
            </View>
            <Text style={styles.actionText}>Color check</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#FFF3E0' }]}>
              <Text style={styles.actionEmoji}>😶</Text>
            </View>
            <Text style={styles.actionText}>Face shape</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#FCE4EC' }]}>
              <Text style={styles.actionEmoji}>🕶</Text>
            </View>
            <Text style={styles.actionText}>Find frames</Text>
          </TouchableOpacity>
        </View>

        {/* Progress */}
        <Text style={styles.sectionTitle}>Your progress</Text>
        <View style={styles.progressCard}>
          <View>
            <Text style={styles.progressNumber}>7</Text>
            <Text style={styles.progressLabel}>screenings completed</Text>
          </View>
          <View style={styles.chartBars}>
            <View style={[styles.bar, { height: 15, backgroundColor: '#D7E3D8' }]} />
            <View style={[styles.bar, { height: 25, backgroundColor: '#D7E3D8' }]} />
            <View style={[styles.bar, { height: 20, backgroundColor: '#D7E3D8' }]} />
            <View style={[styles.bar, { height: 40, backgroundColor: '#618264' }]} />
            <View style={[styles.bar, { height: 30, backgroundColor: '#2D3930' }]} />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F2', // Very light beige/yellow
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  greetingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  nameText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  bellEmoji: { fontSize: 20 },
  actionEmoji: { fontSize: 22 },
  habitCard: {
    backgroundColor: '#618264',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
  },
  habitLabel: {
    color: '#E0EAE1',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  habitTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  habitDesc: {
    color: '#E0EAE1',
    fontSize: 14,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: '#FFF',
    width: '48%',
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  progressCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  progressNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 13,
    color: '#777',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bar: {
    width: 6,
    borderRadius: 3,
    marginLeft: 4,
  },
});
