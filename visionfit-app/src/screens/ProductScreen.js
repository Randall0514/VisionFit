import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProductImage from '../components/ProductImage';
import { CartContext } from '../context/CartContext';
import api from '../services/api';

const { width: SCREEN_W } = Dimensions.get('window');

export default function ProductScreen({ navigation, route }) {
  const { productId } = route.params || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [favorited, setFavorited] = useState(false);
  const { addItem } = useContext(CartContext);

  useEffect(() => {
    if (!productId) { setLoading(false); return; }
    api.getProduct(productId)
      .then((data) => {
        const p = data.product || data;
        setProduct(p);
        if (p.colors?.length > 0) setSelectedColor(p.colors[0]);
        return api.getFavorites();
      })
      .then((favData) => {
        const favs = favData.favorites || [];
        if (favs.some((f) => f.product?._id === productId)) {
          setFavorited(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const toggleFavorite = async () => {
    if (!product) return;
    try {
      if (favorited) {
        await api.removeFavorite(product._id);
      } else {
        await api.addFavorite(product._id);
      }
      setFavorited(!favorited);
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not update favorite');
    }
  };

  const handleAddToBag = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedColor?.hex || selectedColor?.name);
    }
    Alert.alert('Added to cart', `${quantity}× ${product.name} added to your cart.`, [
      { text: 'View cart', onPress: () => navigation.navigate('Cart') },
      { text: 'Continue shopping', style: 'cancel' },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#315B4A" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.emptyState}>
          <Ionicons name="alert-circle-outline" size={50} color="#ccc" />
          <Text style={s.emptyText}>Product not found</Text>
          <TouchableOpacity style={s.emptyBtn} onPress={() => navigation.goBack()}>
            <Text style={s.emptyBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={s.imageSection}>
          <View style={s.imageNav}>
            <TouchableOpacity style={s.navBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={22} color="#111" />
            </TouchableOpacity>
            <TouchableOpacity style={s.navBtn} onPress={toggleFavorite}>
              <Ionicons name={favorited ? 'heart' : 'heart-outline'} size={22} color={favorited ? '#E53935' : '#111'} />
            </TouchableOpacity>
          </View>

          <View style={s.imageContainer}>
            <ProductImage product={product} style={s.productImage} glassesSize="lg" />
          </View>

          {product.image && (
            <View style={s.imageDots}>
              <View style={[s.dot, s.dotActive]} />
            </View>
          )}
        </View>

        <View style={s.detailsCard}>
          <View style={s.detailsHeader}>
            <View style={{ flex: 1 }}>
              <Text style={s.category}>{product.category}</Text>
              <Text style={s.title}>{product.name}</Text>
            </View>
            <Text style={s.price}>₱{product.price?.toLocaleString()}</Text>
          </View>

          {product.frameShape && (
            <Text style={s.meta}>
              {product.frameShape.charAt(0).toUpperCase() + product.frameShape.slice(1)} frame
              {product.category ? ` · ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}` : ''}
            </Text>
          )}

          {product.description ? (
            <Text style={s.description}>{product.description}</Text>
          ) : null}

          {product.colors?.length > 0 && (
            <View style={s.optionSection}>
              <View style={s.optionHeader}>
                <Text style={s.optionLabel}>Color</Text>
                <Text style={s.optionValue}>{selectedColor?.name || 'Default'}</Text>
              </View>
              <View style={s.colorRow}>
                {product.colors.map((c) => (
                  <TouchableOpacity
                    key={c.name}
                    onPress={() => setSelectedColor(c)}
                    style={[
                      s.colorBtn,
                      { backgroundColor: c.hex || '#999' },
                      selectedColor?.name === c.name && s.colorBtnActive,
                    ]}
                  >
                    {selectedColor?.name === c.name && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={s.optionSection}>
            <View style={s.optionHeader}>
              <Text style={s.optionLabel}>Quantity</Text>
            </View>
            <View style={s.qtyRow}>
              <TouchableOpacity
                style={[s.qtyBtn, quantity <= 1 && s.qtyBtnDisabled]}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Ionicons name="remove" size={18} color={quantity <= 1 ? '#ccc' : '#111'} />
              </TouchableOpacity>
              <Text style={s.qtyValue}>{quantity}</Text>
              <TouchableOpacity
                style={s.qtyBtn}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={18} color="#111" />
              </TouchableOpacity>
            </View>
          </View>

          {product.compatibleLenses?.length > 0 && (
            <View style={s.infoCard}>
              <View style={s.infoIcon}>
                <Ionicons name="checkmark-circle" size={20} color="#315B4A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.infoTitle}>Compatible lenses</Text>
                <Text style={s.infoText}>{product.compatibleLenses.join(' · ')}</Text>
              </View>
            </View>
          )}

          {product.faceShapes?.length > 0 && (
            <View style={s.infoCard}>
              <View style={s.infoIcon}>
                <Ionicons name="person" size={20} color="#6C3BC6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.infoTitle}>Recommended face shapes</Text>
                <Text style={s.infoText}>{product.faceShapes.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(' · ')}</Text>
              </View>
            </View>
          )}

          {product.stock?.length > 0 && (
            <View style={s.stockRow}>
              {product.stock.map((s_item) => {
                const inStock = s_item.quantity > 0;
                return (
                  <View key={s_item.color} style={s.stockBadge}>
                    <View style={[s.stockDot, { backgroundColor: inStock ? '#10B981' : '#E53935' }]} />
                    <Text style={s.stockText}>{s_item.color}: {inStock ? `${s_item.quantity} in stock` : 'Out of stock'}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={s.bottomBar}>
        <View style={s.bottomPrice}>
          <Text style={s.bottomTotal}>Total</Text>
          <Text style={s.bottomAmount}>₱{(product.price * quantity).toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={s.addToBagBtn} onPress={handleAddToBag}>
          <Ionicons name="bag-check-outline" size={20} color="#fff" />
          <Text style={s.addToBagText}>Add to bag</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  scrollContent: { paddingBottom: 100 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#666' },
  emptyBtn: { height: 40, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  emptyBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  imageSection: { backgroundColor: '#EDEDED', paddingBottom: 20 },
  imageNav: {
    flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12,
  },
  navBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  imageContainer: {
    height: SCREEN_W * 0.7, alignItems: 'center', justifyContent: 'center', marginTop: 8,
  },
  productImage: { width: '80%', height: '80%' },
  imageDots: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ccc' },
  dotActive: { width: 20, backgroundColor: '#333' },

  detailsCard: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    marginTop: -16, paddingHorizontal: 20, paddingTop: 24,
  },
  detailsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  category: { fontSize: 11, fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { fontSize: 26, fontWeight: '900', color: '#111', marginTop: 4, letterSpacing: -0.3 },
  price: { fontSize: 22, fontWeight: '900', color: '#315B4A' },
  meta: { fontSize: 13, color: '#888', marginTop: 6 },
  description: { fontSize: 14, lineHeight: 22, color: '#555', marginTop: 14 },

  optionSection: { marginTop: 24 },
  optionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  optionLabel: { fontSize: 13, fontWeight: '800', color: '#111' },
  optionValue: { fontSize: 13, color: '#888', marginLeft: 8 },

  colorRow: { flexDirection: 'row', gap: 12 },
  colorBtn: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 3, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  colorBtnActive: { borderColor: '#315B4A', transform: [{ scale: 1.1 }] },

  qtyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start',
  },
  qtyBtn: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnDisabled: { backgroundColor: '#F0F0F0' },
  qtyValue: { fontSize: 18, fontWeight: '800', color: '#111', minWidth: 24, textAlign: 'center' },

  infoCard: {
    flexDirection: 'row', gap: 12, backgroundColor: '#F7FAF8', borderRadius: 14,
    padding: 14, marginTop: 16, borderWidth: 1, borderColor: '#E8F0EA',
  },
  infoIcon: { width: 28, alignItems: 'center', paddingTop: 2 },
  infoTitle: { fontSize: 13, fontWeight: '800', color: '#111', marginBottom: 3 },
  infoText: { fontSize: 12, color: '#666', lineHeight: 18 },

  stockRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  stockBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#F5F5F5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  stockDot: { width: 7, height: 7, borderRadius: 4 },
  stockText: { fontSize: 11, fontWeight: '600', color: '#555' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#EBEBEB',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 10,
  },
  bottomPrice: {},
  bottomTotal: { fontSize: 11, fontWeight: '700', color: '#888' },
  bottomAmount: { fontSize: 22, fontWeight: '900', color: '#111' },
  addToBagBtn: {
    height: 50, paddingHorizontal: 28, borderRadius: 25, backgroundColor: '#315B4A',
    flexDirection: 'row', alignItems: 'center', gap: 8,
    shadowColor: '#315B4A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  addToBagText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
