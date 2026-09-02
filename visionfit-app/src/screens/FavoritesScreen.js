import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Glasses from '../components/Glasses';
import ProductImage from '../components/ProductImage';
import api from '../services/api';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await api.getFavorites();
      setFavorites(data.favorites || []);
    } catch (err) {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId) => {
    try {
      await api.removeFavorite(productId);
      setFavorites((prev) => prev.filter((f) => f.product?._id !== productId));
    } catch (err) {
      // silently fail
    }
  };

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.header}>
          <Text style={s.title}>Favorites</Text>
          <TouchableOpacity><Text style={s.edit}>Edit</Text></TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 60 }} size="large" color="#6C3BC6" />
        ) : favorites.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="heart-outline" size={104} color="#222" />
            <Text style={s.emptyTitle}>Your saved frames will live here.</Text>
            <Text style={s.emptyText}>Explore the collection and tap the heart on any frame you love.</Text>
            <TouchableOpacity style={s.cta} onPress={() => navigation.navigate('Category')}>
              <Text style={s.ctaText}>Discover frames</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={s.grid}>
            {favorites.map((fav) => {
              const product = fav.product;
              if (!product) return null;
              return (
                <TouchableOpacity key={fav._id} style={s.product} onPress={() => navigation.navigate('Product', { productId: product._id })}>
                  <TouchableOpacity style={s.heart} onPress={() => removeFavorite(product._id)}>
                    <Ionicons name="heart" size={17} color="#E53935" />
                  </TouchableOpacity>
                  <View style={s.frameArt}>
                    <ProductImage product={product} style={{ width: '100%', height: '100%' }} />
                  </View>
                  <Text style={s.name}>{product.name}</Text>
                  <Text style={s.price}>₱{product.price?.toLocaleString()}</Text>
                  <View style={s.swatches}>
                    {(product.colors || []).slice(0, 3).map((c, i) => (
                      <View key={i} style={[s.dot, { backgroundColor: c.hex || '#999' }]} />
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  content: { paddingBottom: 28 },
  header: { height: 57, backgroundColor: '#fff', paddingHorizontal: 19, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E5E5' },
  title: { fontSize: 17, fontWeight: '800', color: '#171717' },
  edit: { fontSize: 13, color: '#595959' },
  empty: { alignItems: 'center', paddingHorizontal: 36, paddingTop: 67, paddingBottom: 37 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: '#222', marginTop: 18 },
  emptyText: { fontSize: 13, color: '#666', textAlign: 'center', lineHeight: 19, marginTop: 8 },
  cta: { height: 44, alignSelf: 'stretch', borderRadius: 24, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', marginTop: 23 },
  ctaText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 18 },
  product: { width: '47%', height: 175, borderWidth: 1, borderColor: '#555', borderRadius: 7, overflow: 'hidden', padding: 8 },
  heart: { position: 'absolute', right: 7, top: 7, zIndex: 2 },
  frameArt: { height: 86, backgroundColor: '#EEF2F1', marginHorizontal: -8, marginTop: -8, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 12, fontWeight: '700', marginTop: 9, color: '#222' },
  price: { fontSize: 11, color: '#333', marginTop: 2 },
  swatches: { flexDirection: 'row', gap: 5, marginTop: 6 },
  dot: { height: 10, width: 10, borderRadius: 5 },
});
