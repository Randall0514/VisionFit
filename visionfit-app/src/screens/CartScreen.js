import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Glasses from '../components/Glasses';
import ProductImage from '../components/ProductImage';
import { CartContext } from '../context/CartContext';

function Product({ item, width, onPress }) {
  return (
    <TouchableOpacity style={[s.product, { width }]} onPress={onPress}>
      <TouchableOpacity style={s.heart}><Ionicons name="heart-outline" size={18} /></TouchableOpacity>
      <View style={s.productArt}><Glasses color={item.colors?.[0]?.hex || '#A96C31'} /></View>
      <Text style={s.productName}>{item.name}</Text>
      <Text style={s.productPrice}>₱{item.price?.toLocaleString() || '999'}</Text>
    </TouchableOpacity>
  );
}

export default function CartScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const productWidth = (width - 42) / 2;
  const { items, removeItem, total } = useContext(CartContext);

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()}>
          <Ionicons name="chevron-back" size={25} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Shopping cart ({items.length})</Text>
        <TouchableOpacity><Text style={s.edit}>Edit</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        {items.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="cart-outline" size={80} color="#ccc" />
            <Text style={s.emptyTitle}>Your cart is empty</Text>
            <Text style={s.emptyText}>Browse our collection and add items to your cart.</Text>
            <TouchableOpacity style={s.shopButton} onPress={() => navigation.navigate('Category')}>
              <Text style={s.shopButtonText}>Browse products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {items.map((item) => (
              <View style={s.cartItem} key={item._id + (item.selectedColor || '')}>
                <TouchableOpacity style={s.check}>
                  <Ionicons name="checkmark" size={12} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={s.itemArt} onPress={() => navigation.navigate('Product', { productId: item._id })}>
                  <ProductImage product={item} style={{ width: '100%', height: '100%' }} />
                </TouchableOpacity>
                <View style={s.itemInfo}>
                  <Text style={s.itemName}>{item.name}</Text>
                  <Text style={s.option}>Color: {item.selectedColor || 'Default'}</Text>
                  <Text style={s.option}>Single vision lenses</Text>
                  <Text style={s.itemPrice}>₱{item.price?.toLocaleString()}</Text>
                </View>
                <TouchableOpacity onPress={() => removeItem(item._id, item.selectedColor)}>
                  <Ionicons name="trash-outline" size={18} color="#6A6A6A" />
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {items.length > 0 && (
        <View style={s.checkout}>
          <View>
            <Text style={s.totalLabel}>TOTAL</Text>
            <Text style={s.total}>₱{total.toLocaleString()}</Text>
            <Text style={s.delivery}>Delivery at checkout</Text>
          </View>
          <TouchableOpacity style={s.checkoutButton} onPress={() => navigation.navigate('Checkout')}>
            <Text style={s.checkoutText}>Check out</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  header: { height: 55, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#DDD', paddingHorizontal: 14, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' },
  headerTitle: { fontSize: 14, fontWeight: '800' },
  edit: { fontSize: 12, color: '#444' },
  content: { padding: 14, paddingBottom: 90 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 17, fontWeight: '800', marginTop: 16 },
  emptyText: { fontSize: 13, color: '#666', textAlign: 'center', marginTop: 8 },
  shopButton: { height: 48, paddingHorizontal: 24, borderRadius: 24, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  shopButtonText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  cartItem: { backgroundColor: '#fff', borderRadius: 10, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 10 },
  check: { height: 16, width: 16, borderRadius: 4, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  itemArt: { height: 88, width: 94, borderWidth: 1, borderColor: '#444', borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '800', marginBottom: 6 },
  option: { fontSize: 10, color: '#555', backgroundColor: '#F0F0F0', paddingVertical: 4, paddingHorizontal: 7, borderRadius: 5, alignSelf: 'flex-start', marginBottom: 4 },
  itemPrice: { fontSize: 12, fontWeight: '800', marginTop: 4 },
  checkout: { height: 75, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#DDD', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel: { fontSize: 9, fontWeight: '800', color: '#666' },
  total: { fontSize: 16, fontWeight: '800' },
  delivery: { fontSize: 10, color: '#888' },
  checkoutButton: { height: 48, paddingHorizontal: 28, borderRadius: 24, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  checkoutText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  product: { height: 174, borderWidth: 1, borderColor: '#444', borderRadius: 7, overflow: 'hidden', padding: 8 },
  heart: { position: 'absolute', top: 7, right: 7, zIndex: 2 },
  productArt: { height: 90, backgroundColor: '#EEF1F1', marginHorizontal: -8, marginTop: -8, alignItems: 'center', justifyContent: 'center' },
  productName: { fontSize: 11, fontWeight: '700', marginTop: 8 },
  productPrice: { fontSize: 10, marginTop: 2 },
});
