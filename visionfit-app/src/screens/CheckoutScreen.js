import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';
import api from '../services/api';

export default function CheckoutScreen({ navigation }) {
  const { items, total, clearCart } = useContext(CartContext);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const complete = async () => {
    if (!fullName.trim()) return Alert.alert('Error', 'Please enter your full name');
    if (!address.trim()) return Alert.alert('Error', 'Please enter your delivery address');
    if (!mobile.trim()) return Alert.alert('Error', 'Please enter your mobile number');
    if (items.length === 0) return Alert.alert('Error', 'Your cart is empty');

    setLoading(true);
    try {
      await api.createOrder({
        items: items.map((item) => ({
          product: item._id,
          name: item.name,
          color: item.selectedColor || '',
          lensType: 'single vision',
          price: item.price,
          quantity: item.quantity || 1,
        })),
        totalPrice: total,
        deliveryDetails: { fullName: fullName.trim(), address: address.trim(), mobile: mobile.trim() },
      });
      clearCart();
      Alert.alert('Order placed', 'Your VisionFit order has been confirmed.', [
        { text: 'Done', onPress: () => navigation.navigate('MainTabs') },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#183B2B" />
        </TouchableOpacity>
        <Text style={s.overline}>SECURE CHECKOUT</Text>
        <Text style={s.title}>Almost yours.</Text>

        <Text style={s.section}>DELIVERY DETAILS</Text>
        <TextInput style={s.input} placeholder="Full name" value={fullName} onChangeText={setFullName} />
        <TextInput style={s.input} placeholder="Delivery address" value={address} onChangeText={setAddress} />
        <TextInput style={s.input} placeholder="Mobile number" keyboardType="phone-pad" value={mobile} onChangeText={setMobile} />

        <Text style={s.section}>PAYMENT</Text>
        <View style={s.payment}>
          <Ionicons name="card-outline" size={21} color="#315B4A" />
          <Text style={s.paymentText}>Card payment (demo)</Text>
          <Ionicons name="checkmark-circle" size={19} color="#315B4A" />
        </View>

        <View style={s.summary}>
          {items.map((item) => (
            <View key={item._id} style={s.summaryRow}>
              <Text style={s.summaryText}>{item.name} × {item.quantity || 1}</Text>
              <Text style={s.summaryPrice}>₱{(item.price * (item.quantity || 1)).toLocaleString()}</Text>
            </View>
          ))}
          <View style={[s.summaryRow, { borderTopWidth: 1, borderTopColor: '#E5E5E5', paddingTop: 10, marginTop: 10 }]}>
            <Text style={[s.summaryText, { fontWeight: '800' }]}>Total</Text>
            <Text style={[s.summaryPrice, { fontWeight: '800' }]}>₱{total.toLocaleString()}</Text>
          </View>
        </View>

        <TouchableOpacity style={[s.button, loading && { opacity: 0.6 }]} onPress={complete} disabled={loading}>
          <Text style={s.buttonText}>Place order · ₱{total.toLocaleString()}</Text>
          <Ionicons name="lock-closed" size={16} color="#fff" />
        </TouchableOpacity>
        <Text style={s.terms}>By placing your order, you confirm that your prescription was provided by a licensed eye-care professional.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F6F1' },
  content: { padding: 22, paddingBottom: 35 },
  back: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  overline: { fontSize: 11, fontWeight: '800', letterSpacing: 1, color: '#779081' },
  title: { fontSize: 30, fontWeight: '800', color: '#183B2B', marginTop: 6, marginBottom: 30 },
  section: { fontSize: 11, fontWeight: '800', letterSpacing: 1, color: '#526259', marginBottom: 12 },
  input: { height: 52, backgroundColor: '#fff', borderWidth: 1, borderColor: '#D7DBD8', borderRadius: 12, paddingHorizontal: 15, fontSize: 15, color: '#111', marginBottom: 12 },
  payment: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#E2F0E5', borderRadius: 12, padding: 14 },
  paymentText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#183B2B' },
  summary: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryText: { fontSize: 13, color: '#333' },
  summaryPrice: { fontSize: 13, color: '#333' },
  button: { height: 55, borderRadius: 14, backgroundColor: '#315B4A', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  terms: { fontSize: 11, color: '#888', textAlign: 'center', marginTop: 16, lineHeight: 16 },
});
