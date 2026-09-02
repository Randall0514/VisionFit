import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import Glasses from './Glasses';

const LOCAL_IP = '192.168.1.11';
const BASE_URL = Platform.select({
  android: `http://${LOCAL_IP}:5000`,
  ios: `http://localhost:5000`,
  default: `http://localhost:5000`,
});

export default function ProductImage({ product, style, glassesSize = 'md' }) {
  if (product?.image) {
    const uri = product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`;
    return (
      <View style={[styles.container, style]}>
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Glasses color={product?.colors?.[0]?.hex} size={glassesSize} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});
