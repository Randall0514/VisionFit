import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity
} from 'react-native';

export default function HistoryScreen() {
  const tests = [
    {
      id: 1,
      date: 'MAY 20 · 10:30 AM',
      title: 'Visual acuity test',
      result: 'Result: Good',
      icon: '👁',
    },
    {
      id: 2,
      date: 'MAY 20 · 10:32 AM',
      title: 'Color perception test',
      result: 'Result: Typical',
      icon: '◎',
    },
    {
      id: 3,
      date: 'MAY 20 · 10:35 AM',
      title: 'Face shape analysis',
      result: 'Result: Oval',
      icon: '❋',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.overlineText}>OVERVIEW</Text>
            <Text style={styles.title}>My test history</Text>
          </View>
          <TouchableOpacity style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
        </View>

        {/* Wellness Card */}
        <View style={styles.wellnessCard}>
          <View>
            <Text style={styles.wellnessLabel}>Overall visual wellness</Text>
            <Text style={styles.wellnessValue}>Good</Text>
          </View>
          <Text style={styles.wellnessEmoji}>🙂</Text>
        </View>

        {/* Filter Pills */}
        <View style={styles.pills}>
          {['All', 'Acuity', 'Color', 'Face shape'].map((label, i) => (
            <TouchableOpacity
              key={label}
              style={[styles.pill, i === 0 && styles.pillActive]}
            >
              <Text style={[styles.pillText, i === 0 && styles.pillTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Test Items */}
        {tests.map((test) => (
          <TouchableOpacity key={test.id} style={styles.testItem}>
            <View style={styles.testIconWrap}>
              <Text style={styles.testIcon}>{test.icon}</Text>
            </View>
            <View style={styles.testInfo}>
              <Text style={styles.testDate}>{test.date}</Text>
              <Text style={styles.testTitle}>{test.title}</Text>
              <Text style={styles.testResult}>{test.result}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7F2' },
  content: { padding: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 10,
  },
  overlineText: { fontSize: 11, fontWeight: '700', color: '#888', letterSpacing: 0.5, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#222' },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
  },
  backBtnText: { fontSize: 22, color: '#444' },
  wellnessCard: {
    backgroundColor: '#EBF3EC',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  wellnessLabel: { fontSize: 13, color: '#618264', marginBottom: 4 },
  wellnessValue: { fontSize: 22, fontWeight: 'bold', color: '#2D3930' },
  wellnessEmoji: { fontSize: 32 },
  pills: { flexDirection: 'row', marginBottom: 20, gap: 8 },
  pill: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#FFF',
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  pillActive: { backgroundColor: '#2D3930', borderColor: '#2D3930' },
  pillText: { fontSize: 13, color: '#555', fontWeight: '600' },
  pillTextActive: { color: '#FFF' },
  testItem: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  testIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#F2F5F2',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 14,
  },
  testIcon: { fontSize: 18 },
  testInfo: { flex: 1 },
  testDate: { fontSize: 11, color: '#999', marginBottom: 2 },
  testTitle: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 2 },
  testResult: { fontSize: 13, color: '#777' },
  chevron: { fontSize: 22, color: '#CCC' },
});
