import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Glasses from '../components/Glasses';
import ProductImage from '../components/ProductImage';
import api from '../services/api';

const WOMEN = 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=82';
const MEN = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=82';
const READING = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=82';

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Eyeglass', value: 'eyeglass' },
  { label: 'Sunglasses', value: 'sunglasses' },
  { label: 'Blue Light', value: 'blue light' },
  { label: 'Sports', value: 'sports' },
  { label: 'Transitions', value: 'transitions' },
];

const SHAPES = ['SQUARE', 'RECTANGLE', 'ROUND', 'CAT-EYE', 'BROWLINE', 'AVIATOR'];

const COLORS = [
  { label: 'Black', hex: '#151515' },
  { label: 'Brown', hex: '#6E3A27' },
  { label: 'Green', hex: '#72CF51' },
  { label: 'Gray', hex: '#B8B8B8' },
  { label: 'Purple', hex: '#6510A4' },
  { label: 'White', hex: '#FFF' },
  { label: 'Red', hex: '#A6070A' },
  { label: 'Pink', hex: '#FA74A8' },
  { label: 'Blue', hex: '#0766B2' },
];

const MATERIALS = ['Acetate', 'Metal', 'Titanium', 'TR90', 'Wood'];

function Section({ title, onSeeAll, children }) {
  return (
    <View style={s.section}>
      <View style={s.sectionHead}>
        <Text style={s.sectionTitle}>{title}</Text>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={s.seeAll}>See all</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

export default function CatalogScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const gutter = 16;
  const inner = width - gutter * 2;
  const tileW = (inner - 10) / 3;
  const colorTileW = (inner - 16) / 3;
  const cardW = (inner - 12) / 2;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async (cat) => {
    try {
      const params = {};
      if (cat) params.category = cat;
      const data = await api.getProducts(params);
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts(selectedCategory);
  };

  const goSearch = (params) => navigation.navigate('Search', params);

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.topBar}>
        <Text style={s.topTitle}>Catalog</Text>
        <TouchableOpacity style={s.filterToggle} onPress={() => setShowFilters(!showFilters)}>
          <Ionicons name={showFilters ? 'close-outline' : 'options-outline'} size={18} />
          <Text style={s.filterToggleText}>Filters</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={s.search} onPress={() => navigation.navigate('Search')}>
        <Ionicons name="search-outline" size={17} color="#888" />
        <Text style={s.searchPlaceholder}>Search frames, styles, brands</Text>
      </TouchableOpacity>

      {showFilters && (
        <View style={s.filterPanel}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipRow}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c.value}
                style={[s.chip, selectedCategory === c.value && s.chipActive]}
                onPress={() => {
                  setSelectedCategory(c.value);
                  fetchProducts(c.value);
                }}
              >
                <Text style={[s.chipText, selectedCategory === c.value && s.chipTextActive]}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Section title="Shop by category">
          <View style={s.categoryGrid}>
            <TouchableOpacity style={s.categoryTile} onPress={() => goSearch({ category: 'eyeglass' })}>
              <Image source={{ uri: WOMEN }} style={s.categoryImage} />
              <View style={s.categoryOverlay}>
                <Text style={s.categoryLabel}>Women's</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={s.categoryTile} onPress={() => goSearch({ category: 'sunglasses' })}>
              <Image source={{ uri: MEN }} style={s.categoryImage} />
              <View style={s.categoryOverlay}>
                <Text style={s.categoryLabel}>Men's</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={s.categoryTile} onPress={() => goSearch({ category: 'blue light' })}>
              <Image source={{ uri: READING }} style={s.categoryImage} />
              <View style={s.categoryOverlay}>
                <Text style={s.categoryLabel}>Reading</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Section>

        <Section title="Shop by frame shape">
          <View style={s.shapeGrid}>
            {SHAPES.map((shape, i) => (
              <TouchableOpacity key={shape} style={s.shapeTile} onPress={() => goSearch({ frameShape: shape.toLowerCase() })}>
                <Glasses gold={i > 3} round={i === 2 || i === 3} />
                <Text style={s.shapeLabel}>{shape}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section title="Shop by color">
          <View style={s.colorGrid}>
            {COLORS.map((c) => (
              <TouchableOpacity key={c.label} style={[s.colorTile, { width: colorTileW }]} onPress={() => goSearch({ color: c.label })}>
                <View style={[s.colorDot, { backgroundColor: c.hex }]} />
                <Text style={s.colorLabel}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section title="Shop by material">
          <View style={s.materialRow}>
            {MATERIALS.map((m) => (
              <TouchableOpacity key={m} style={s.materialChip}>
                <Text style={s.materialText}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section title="Best sellers" onSeeAll={() => goSearch({ sort: '-createdAt' })}>
          {loading ? (
            <ActivityIndicator style={{ marginVertical: 24 }} size="large" color="#6C3BC6" />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.productRow}>
              {products.slice(0, 5).map((p) => (
                <TouchableOpacity key={p._id} style={s.productCard} onPress={() => navigation.navigate('Product', { productId: p._id })}>
                  <View style={s.productArt}>
                    <ProductImage product={p} style={{ width: '100%', height: '100%' }} />
                  </View>
                  <Text style={s.productName} numberOfLines={1}>{p.name}</Text>
                  <Text style={s.productPrice}>₱{p.price?.toLocaleString()}</Text>
                  <View style={s.productColors}>
                    {(p.colors || []).slice(0, 3).map((c, i) => (
                      <View key={i} style={[s.pColorDot, { backgroundColor: c.hex || '#999' }]} />
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </Section>

        <Section title="New arrivals" onSeeAll={() => goSearch({ sort: '-createdAt' })}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.productRow}>
            {products.slice(0, 5).map((p) => (
              <TouchableOpacity key={p._id} style={s.productCard} onPress={() => navigation.navigate('Product', { productId: p._id })}>
                <View style={s.productArt}>
                  <ProductImage product={p} style={{ width: '100%', height: '100%' }} />
                </View>
                <Text style={s.productName} numberOfLines={1}>{p.name}</Text>
                <Text style={s.productPrice}>₱{p.price?.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#EBEBEB',
  },
  topTitle: { fontSize: 22, fontWeight: '900', color: '#111' },
  filterToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F3F3',
  },
  filterToggleText: { fontSize: 13, fontWeight: '600', color: '#333' },
  search: {
    marginHorizontal: 16, marginTop: 12, height: 40, borderRadius: 20,
    backgroundColor: '#F0F0F0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 8,
  },
  searchPlaceholder: { fontSize: 13, color: '#999' },
  filterPanel: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#EBEBEB', paddingBottom: 8 },
  chipRow: { paddingHorizontal: 16, paddingTop: 12, gap: 6, flexDirection: 'row' },
  chip: {
    height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0',
    backgroundColor: '#fff', paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center',
  },
  chipActive: { backgroundColor: '#111', borderColor: '#111' },
  chipText: { fontSize: 12, color: '#444' },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  content: { paddingBottom: 30 },

  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#111', letterSpacing: -0.3 },
  seeAll: { fontSize: 13, fontWeight: '600', color: '#6C3BC6' },

  categoryGrid: { flexDirection: 'row', gap: 8 },
  categoryTile: { flex: 1, height: 120, borderRadius: 12, overflow: 'hidden' },
  categoryImage: { width: '100%', height: '100%' },
  categoryOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)', paddingVertical: 6, paddingHorizontal: 8,
  },
  categoryLabel: { color: '#fff', fontSize: 12, fontWeight: '800' },

  shapeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  shapeTile: {
    width: '30%', height: 80, borderWidth: 1, borderColor: '#D9D9D9',
    borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
  },
  shapeLabel: { fontSize: 9, fontWeight: '800', marginTop: 6, color: '#333' },

  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  colorTile: {
    height: 72, borderRadius: 10, backgroundColor: '#F3F3F3',
    alignItems: 'center', justifyContent: 'center',
  },
  colorDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: '#222' },
  colorLabel: { fontSize: 10, fontWeight: '600', marginTop: 5, color: '#333' },

  materialRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  materialChip: {
    height: 36, borderRadius: 18, backgroundColor: '#2D2D2D',
    paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center',
  },
  materialText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  productRow: { gap: 12, paddingVertical: 4 },
  productCard: {
    width: 140, backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1, borderColor: '#EBEBEB', overflow: 'hidden', padding: 10,
  },
  productArt: {
    height: 90, backgroundColor: '#F2F4F3', borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  productName: { fontSize: 13, fontWeight: '800', color: '#111' },
  productPrice: { fontSize: 12, fontWeight: '700', color: '#444', marginTop: 2 },
  productColors: { flexDirection: 'row', gap: 5, marginTop: 6 },
  pColorDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 0.5, borderColor: '#ddd' },
});
