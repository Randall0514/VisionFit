import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Glasses from '../components/Glasses';
import ProductImage from '../components/ProductImage';
import api from '../services/api';

const HERO_1 = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=82';
const HERO_2 = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=82';
const FACE_AVATARS = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=82',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=82',
];

const FRAME_SHAPES = ['SQUARE', 'RECTANGLE', 'ROUND', 'CAT-EYE', 'BROWLINE', 'AVIATOR'];
const FACE_SHAPES = ['ROUND', 'HEART', 'DIAMOND', 'OVAL', 'SQUARE'];
const LIFE_FRAMES = ['EYEGLASS', 'SUNGLASSES', 'BLUE LIGHT', 'SPORTS', 'TRANSITIONS'];

function Section({ title, subtitle, onSeeAll, children }) {
  return (
    <View style={s.section}>
      <View style={s.sectionHead}>
        <View style={{ flex: 1 }}>
          <Text style={s.sectionTitle}>{title}</Text>
          {subtitle ? <Text style={s.sectionSubtitle}>{subtitle}</Text> : null}
        </View>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll} style={s.seeAllBtn}>
            <Text style={s.seeAllText}>See all</Text>
            <Ionicons name="chevron-forward" size={14} color="#6C3BC6" />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

export default function DashboardScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const gutter = 16;
  const inner = width - gutter * 2;
  const tileW = (inner - 8) / 2;
  const cardW = (inner - 16) / 3;
  const heroH = Math.min(Math.max(width * 0.65, 220), 300);
  const go = () => navigation.navigate('Category');

  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = () => {
    api.getProducts({ limit: 3 })
      .then((data) => setProducts(data.products || []))
      .catch(() => {});
  };

  useEffect(() => { fetchProducts(); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={s.header}>
          <Text style={s.logo}>VISIONFIT</Text>
          <TouchableOpacity style={s.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color="#111" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={s.search} onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search-outline" size={17} color="#888" />
          <Text style={s.searchPlaceholder}>Search frames, styles, brands</Text>
          <Ionicons name="camera-outline" size={19} color="#888" />
        </TouchableOpacity>

        <View style={[s.hero, { height: heroH }]}>
          <Image source={{ uri: HERO_1 }} style={s.heroImage} />
          <View style={s.heroOverlay}>
            <Text style={s.heroTitle}>New Summer{'\n'}Collection</Text>
            <TouchableOpacity style={s.heroBtn} onPress={go}>
              <Text style={s.heroBtnText}>Shop now</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Section
          title="Shop by frame shape"
          subtitle="Discover frames for every face, style and moment."
          onSeeAll={go}
        >
          <View style={s.tileGrid}>
            {FRAME_SHAPES.map((shape, i) => (
              <TouchableOpacity key={shape} style={[s.tile, { width: tileW }]} onPress={go}>
                <Glasses gold={i > 3} round={i === 2 || i === 3} />
                <Text style={s.tileLabel}>{shape}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <View style={[s.heroSmall, { height: heroH * 0.7 }]}>
          <Image source={{ uri: HERO_2 }} style={s.heroImage} />
          <View style={s.heroOverlay}>
            <Text style={s.heroSmallTitle}>Premium Acetate{'\n'}Frames</Text>
            <TouchableOpacity style={s.heroBtn} onPress={go}>
              <Text style={s.heroBtnText}>Shop now</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Section title="Under ₱1,000 picks" onSeeAll={go}>
          <View style={s.cardRow}>
            {products.length > 0 ? products.map((p) => (
              <TouchableOpacity key={p._id} style={[s.productCard, { width: cardW }]} onPress={() => navigation.navigate('Product', { productId: p._id })}>
                <View style={s.cardArt}>
                  <ProductImage product={p} style={{ width: '100%', height: '100%' }} glassesSize="md" />
                  <TouchableOpacity style={s.heartBtn}>
                    <Ionicons name="heart-outline" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
                <View style={s.cardInfo}>
                  <Text style={s.cardName} numberOfLines={1}>{p.name}</Text>
                  <Text style={s.cardPrice}>₱{p.price?.toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
            )) : [0, 1, 2].map((i) => (
              <TouchableOpacity key={i} style={[s.productCard, { width: cardW }]} onPress={go}>
                <View style={s.cardArt}>
                  <Glasses gold={i === 1} round={i === 1} />
                  <TouchableOpacity style={s.heartBtn}>
                    <Ionicons name="heart-outline" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
                <View style={s.cardInfo}>
                  <Text style={s.cardName}>Margaret</Text>
                  <Text style={s.cardPrice}>₱999</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section
          title="Shop by face shape"
          subtitle="Find your most flattering fit in a few easy steps."
          onSeeAll={() => navigation.navigate('FaceScan')}
        >
          <View style={s.faceRow}>
            {FACE_SHAPES.map((shape, i) => (
              <TouchableOpacity key={shape} style={s.faceTile} onPress={() => navigation.navigate('FaceScan')}>
                <Image source={{ uri: FACE_AVATARS[i % 2] }} style={s.faceAvatar} />
                <Text style={s.faceLabel}>{shape}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={s.faceScanBtn} onPress={() => navigation.navigate('FaceScan')}>
            <Ionicons name="camera-outline" size={18} color="#fff" />
            <Text style={s.faceScanBtnText}>Try face scan</Text>
          </TouchableOpacity>
        </Section>

        <Section
          title="Frames for your life"
          subtitle="Explore lenses and frames designed around how you live."
          onSeeAll={go}
        >
          <View style={s.tileGrid}>
            {LIFE_FRAMES.map((name, i) => (
              <TouchableOpacity key={name} style={[s.tile, { width: tileW }]} onPress={go}>
                <Glasses gold={i === 4} round={i === 2} />
                <Text style={s.tileLabel}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  content: { paddingBottom: 30 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, backgroundColor: '#fff',
  },
  logo: { fontSize: 24, fontWeight: '900', letterSpacing: -1.2, color: '#111' },
  notifBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F3F3',
    alignItems: 'center', justifyContent: 'center',
  },

  search: {
    marginHorizontal: 16, marginTop: 10, height: 44, borderRadius: 22,
    backgroundColor: '#F0F0F0', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, gap: 10,
  },
  searchPlaceholder: { flex: 1, fontSize: 14, color: '#999' },

  hero: { marginHorizontal: 16, marginTop: 16, borderRadius: 16, overflow: 'hidden' },
  heroSmall: { marginHorizontal: 16, marginTop: 16, borderRadius: 16, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', padding: 20, paddingBottom: 22,
  },
  heroTitle: { color: '#fff', fontSize: 26, fontWeight: '900', lineHeight: 30, letterSpacing: -0.5 },
  heroSmallTitle: { color: '#fff', fontSize: 20, fontWeight: '900', lineHeight: 24, letterSpacing: -0.3 },
  heroBtn: {
    marginTop: 14, alignSelf: 'flex-start', height: 40, paddingHorizontal: 20,
    borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  heroBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#111', letterSpacing: -0.4 },
  sectionSubtitle: { fontSize: 12, color: '#888', marginTop: 3, lineHeight: 16 },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingTop: 4 },
  seeAllText: { fontSize: 13, fontWeight: '600', color: '#6C3BC6' },

  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: {
    height: 100, borderWidth: 1.5, borderColor: '#D9D9D9', borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
  },
  tileLabel: { fontSize: 9, fontWeight: '800', marginTop: 7, color: '#333', letterSpacing: 0.3 },

  cardRow: { flexDirection: 'row', gap: 10 },
  productCard: {
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#EBEBEB',
    overflow: 'hidden',
  },
  cardArt: {
    height: 100, backgroundColor: '#F2F4F3', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  heartBtn: { position: 'absolute', top: 8, right: 8 },
  cardInfo: { padding: 10 },
  cardName: { fontSize: 13, fontWeight: '800', color: '#111' },
  cardPrice: { fontSize: 12, fontWeight: '700', color: '#444', marginTop: 2 },

  faceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  faceTile: { alignItems: 'center', width: 64 },
  faceAvatar: {
    width: 56, height: 56, borderRadius: 28, borderWidth: 2.5, borderColor: '#111',
  },
  faceLabel: { fontSize: 9, fontWeight: '800', marginTop: 6, color: '#333', letterSpacing: 0.3 },
  faceScanBtn: {
    marginTop: 14, height: 44, borderRadius: 22, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  faceScanBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
