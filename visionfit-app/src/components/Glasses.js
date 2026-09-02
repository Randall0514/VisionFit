import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Glasses({ color, gold, round, size = 'md' }) {
  const lensColor = gold ? '#B49A68' : color || '#202020';
  const bridgeColor = gold ? '#B49A68' : color || '#202020';

  const dims = size === 'lg'
    ? { lensW: 110, lensH: 87, bridgeW: 23, bridgeH: 9, lensBorder: 10, lensRadius: 26, bridgeRadius: 0 }
    : size === 'sm'
    ? { lensW: 34, lensH: 21, bridgeW: 8, bridgeH: 2, lensBorder: 2, lensRadius: round ? 14 : 5, bridgeRadius: 0 }
    : { lensW: 39, lensH: 28, bridgeW: 9, bridgeH: 3, lensBorder: 3, lensRadius: round ? 14 : 9, bridgeRadius: 0 };

  return (
    <View style={styles.row}>
      <View style={[styles.lens, {
        width: dims.lensW, height: dims.lensH,
        borderWidth: dims.lensBorder,
        borderColor: lensColor,
        borderRadius: round ? dims.lensH / 2 : dims.lensRadius,
      }]} />
      <View style={[styles.bridge, {
        width: dims.bridgeW, height: dims.bridgeH,
        backgroundColor: bridgeColor,
      }]} />
      <View style={[styles.lens, {
        width: dims.lensW, height: dims.lensH,
        borderWidth: dims.lensBorder,
        borderColor: lensColor,
        borderRadius: round ? dims.lensH / 2 : dims.lensRadius,
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  lens: {},
  bridge: {},
});
