import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Glasses from '../components/Glasses';
import ProductImage from '../components/ProductImage';
import api from '../services/api';

const DEBOUNCE_MS = 300;
const CATEGORIES = ['All', 'Eyeglass', 'Sunglasses', 'Blue Light', 'Sports', 'Transitions'];
const SHAPES = ['square', 'rectangle', 'round', 'cat-eye', 'browline', 'aviator'];

export default function SearchScreen({ navigation, route }) {
  const initialCategory = route.params?.category || 'All';
  const initialShape = route.params?.frameShape || '';
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [shape, setShape] = useState(initialShape);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  const doSearch = async (search, cat, sh) => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (cat && cat !== 'All') params.category = cat.toLowerCase();
      if (sh) params.frameShape = sh;
      const data = await api.getProducts(params);
      setProducts(data.products || []);
    } catch (err) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    doSearch(query, category, shape);
  }, []);

  const handleSearch = (text) => {
    setQuery(text);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(text, category, shape), DEBOUNCE_MS);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    doSearch(query, cat, shape);
  };

  const handleShape = (sh) => {
    const newShape = shape === sh ? '' : sh;
    setShape(newShape);
    doSearch(query, category, newShape);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={s.card} onPress={() => navigation.navigate('Product', { productId: item._id })}>
      <View style={s.cardArt}>
        <ProductImage product={item} style={{ width: '100%', height: '100%' }} />
      </View>
      <Text style={s.cardName}>{item.name}</Text>
      <Text style={s.cardPrice}>₱{item.price?.toLocaleString()}</Text>
      <View style={s.dots}>
        {(item.colors || []).slice(0, 3).map((c, i) => (
          <View key={i} style={[s.dot, { backgroundColor: c.hex || '#999' }]} />
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <View style={s.searchBar}>
          <Ionicons name="search-outline" size={18} />
          <TextInput
            style={s.searchInput}
            placeholder="Search frames, styles..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={handleSearch}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={s.filterSection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={s.categoryRow}
          renderItem={({ item: cat }) => (
            <TouchableOpacity
              style={[s.categoryPill, category === cat && s.activePill]}
              onPress={() => handleCategory(cat)}
            >
              <Text style={[s.categoryText, category === cat && s.activePillText]}>{cat}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={s.shapeSection}>
        {SHAPES.map((sh) => (
          <TouchableOpacity
            key={sh}
            style={[s.shapePill, shape === sh && s.activePill]}
            onPress={() => handleShape(sh)}
          >
            <Text style={[s.shapeText, shape === sh && s.activePillText]}>{sh}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#6C3BC6" />
      ) : products.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="search-outline" size={60} color="#ccc" />
          <Text style={s.emptyTitle}>No products found</Text>
          <Text style={s.emptyText}>Try adjusting your search or filters.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={s.grid}
          columnWrapperStyle={s.gridRow}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E5E5E5' },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },
  searchBar: { flex: 1, height: 42, borderRadius: 22, backgroundColor: '#F0F0F0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#111' },
  filterSection: { paddingHorizontal: 14, paddingTop: 12 },
  categoryRow: { gap: 8 },
  categoryPill: { height: 34, borderRadius: 17, borderWidth: 1, borderColor: '#D9D9D9', paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
  activePill: { backgroundColor: '#DDC8F0', borderColor: '#DDC8F0' },
  categoryText: { fontSize: 12, color: '#333' },
  activePillText: { fontWeight: '700' },
  shapeSection: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 14, paddingTop: 10 },
  shapePill: { height: 30, borderRadius: 15, borderWidth: 1, borderColor: '#D9D9D9', paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  shapeText: { fontSize: 11, color: '#555', textTransform: 'capitalize' },
  grid: { padding: 14, paddingBottom: 30 },
  gridRow: { gap: 12, marginBottom: 12 },
  card: { flex: 1, borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 10, overflow: 'hidden', padding: 10 },
  cardArt: { height: 100, backgroundColor: '#EEF1F1', borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  cardName: { fontSize: 12, fontWeight: '700', color: '#222' },
  cardPrice: { fontSize: 11, color: '#555', marginTop: 2 },
  dots: { flexDirection: 'row', gap: 5, marginTop: 6 },
  dot: { height: 10, width: 10, borderRadius: 5 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '800', marginTop: 12 },
  emptyText: { fontSize: 13, color: '#888', marginTop: 6 },
});
