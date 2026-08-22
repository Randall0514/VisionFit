import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity
} from 'react-native';

const frames = [
  { id: 1, name: 'Wayfarer', type: 'Acetate' },
  { id: 2, name: 'Round Metal', type: 'Metal' },
  { id: 3, name: 'Square Pro', type: 'Acetate' },
  { id: 4, name: 'Cat Eye', type: 'Acetate' },
];

function GlassesIcon({ style }) {
  return (
    <View style={[styles.glassesContainer, style]}>
      <View style={styles.glassesLeft} />
      <View style={styles.glassesBridge} />
      <View style={styles.glassesRight} />
    </View>
  );
}

export default function CatalogScreen() {
  const [activeFilter, setActiveFilter] = useState('Face shape');
  const [liked, setLiked] = useState({});

  const filters = ['Face shape', 'Material', 'Style', 'Color'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.overline}>SHOP</Text>
            <Text style={styles.title}>Frame catalog</Text>
          </View>
          <TouchableOpacity style={styles.searchBtn}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillsScroll}
          contentContainerStyle={styles.pills}
        >
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.pill, activeFilter === f && styles.pillActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.pillText, activeFilter === f && styles.pillTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Grid */}
        <View style={styles.grid}>
          {frames.map((frame) => (
            <View key={frame.id} style={styles.frameCard}>
              <View style={styles.frameImageArea}>
                <GlassesIcon />
              </View>
              <View style={styles.frameInfo}>
                <View>
                  <Text style={styles.frameName}>{frame.name}</Text>
                  <Text style={styles.frameType}>{frame.type}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setLiked(prev => ({ ...prev, [frame.id]: !prev[frame.id] }))}
                >
                  <Text style={styles.heartIcon}>{liked[frame.id] ? '❤️' : '♡'}</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    alignItems: 'flex-start', marginBottom: 20, marginTop: 10,
  },
  overline: { fontSize: 11, fontWeight: '700', color: '#888', letterSpacing: 0.5, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#222' },
  searchBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  searchIcon: { fontSize: 18 },
  pillsScroll: { marginBottom: 24 },
  pills: { flexDirection: 'row', gap: 8 },
  pill: {
    paddingHorizontal: 18, paddingVertical: 9,
    borderRadius: 20, backgroundColor: '#FFF',
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  pillActive: { backgroundColor: '#2D3930', borderColor: '#2D3930' },
  pillText: { fontSize: 13, color: '#555', fontWeight: '600' },
  pillTextActive: { color: '#FFF' },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  frameCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: '48%',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  frameImageArea: {
    backgroundColor: '#EBF3EC',
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassesContainer: {
    flexDirection: 'row', alignItems: 'center',
  },
  glassesLeft: {
    width: 46, height: 28, borderRadius: 14,
    borderWidth: 3, borderColor: '#618264',
  },
  glassesBridge: {
    width: 12, height: 3,
    backgroundColor: '#618264',
  },
  glassesRight: {
    width: 46, height: 28, borderRadius: 14,
    borderWidth: 3, borderColor: '#618264',
  },
  frameInfo: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frameName: { fontSize: 14, fontWeight: '700', color: '#222', marginBottom: 2 },
  frameType: { fontSize: 12, color: '#888' },
  heartIcon: { fontSize: 20, color: '#888' },
});
