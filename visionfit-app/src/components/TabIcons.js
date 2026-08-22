import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * Custom SVG-like tab bar icons using pure React Native Views.
 * Matches the design: thin stroke outlines, filled home icon when active.
 */

// ─── House / Home ────────────────────────────────────────────
export function HomeIcon({ color, size = 24, filled = false }) {
  const s = size;
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'flex-end' }}>
      {/* Roof */}
      <View style={{
        position: 'absolute',
        top: 0,
        width: 0, height: 0,
        borderLeftWidth: s * 0.5,
        borderRightWidth: s * 0.5,
        borderBottomWidth: s * 0.45,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
      }} />
      {/* Roof inner (hollow) */}
      {!filled && (
        <View style={{
          position: 'absolute',
          top: s * 0.06,
          width: 0, height: 0,
          borderLeftWidth: s * 0.38,
          borderRightWidth: s * 0.38,
          borderBottomWidth: s * 0.36,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: '#F8F7F2',
        }} />
      )}
      {/* Body */}
      <View style={{
        width: s * 0.6,
        height: s * 0.45,
        backgroundColor: filled ? color : 'transparent',
        borderWidth: filled ? 0 : 2,
        borderColor: color,
        borderRadius: 2,
        marginBottom: 0,
      }} />
      {/* Door */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        width: s * 0.22,
        height: s * 0.28,
        backgroundColor: filled ? '#F8F7F2' : 'transparent',
        borderWidth: filled ? 0 : 0,
        borderRadius: 2,
      }} />
    </View>
  );
}

// ─── Clock / History ─────────────────────────────────────────
export function ClockIcon({ color, size = 24 }) {
  const s = size;
  const r = s * 0.45;
  return (
    <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
      {/* Circle */}
      <View style={{
        width: s * 0.9,
        height: s * 0.9,
        borderRadius: s * 0.45,
        borderWidth: 2,
        borderColor: color,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {/* Hour hand */}
        <View style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: 2,
          height: s * 0.28,
          backgroundColor: color,
          borderRadius: 1,
          transformOrigin: 'bottom',
          transform: [{ translateX: -1 }],
        }} />
        {/* Minute hand */}
        <View style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: 2,
          height: s * 0.22,
          backgroundColor: color,
          borderRadius: 1,
          transform: [{ translateX: -1 }, { rotate: '90deg' }, { translateY: s * 0.11 }],
        }} />
      </View>
    </View>
  );
}

// ─── Grid 2×2 / Catalog ──────────────────────────────────────
export function GridIcon({ color, size = 24 }) {
  const s = size;
  const cell = s * 0.36;
  const gap = s * 0.1;
  return (
    <View style={{
      width: s, height: s,
      justifyContent: 'center', alignItems: 'center',
    }}>
      <View style={{ flexDirection: 'row', gap }}>
        <View style={{ flexDirection: 'column', gap }}>
          <View style={{ width: cell, height: cell, borderRadius: 3, borderWidth: 2, borderColor: color }} />
          <View style={{ width: cell, height: cell, borderRadius: 3, borderWidth: 2, borderColor: color }} />
        </View>
        <View style={{ flexDirection: 'column', gap }}>
          <View style={{ width: cell, height: cell, borderRadius: 3, borderWidth: 2, borderColor: color }} />
          <View style={{ width: cell, height: cell, borderRadius: 3, borderWidth: 2, borderColor: color }} />
        </View>
      </View>
    </View>
  );
}

// ─── Open Book / Education ───────────────────────────────────
export function BookIcon({ color, size = 24 }) {
  const s = size;
  return (
    <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
      {/* Left page */}
      <View style={{
        position: 'absolute',
        left: s * 0.04,
        width: s * 0.42,
        height: s * 0.65,
        borderWidth: 2,
        borderColor: color,
        borderRadius: 2,
        borderRightWidth: 0,
        bottom: s * 0.1,
      }} />
      {/* Right page */}
      <View style={{
        position: 'absolute',
        right: s * 0.04,
        width: s * 0.42,
        height: s * 0.65,
        borderWidth: 2,
        borderColor: color,
        borderRadius: 2,
        borderLeftWidth: 0,
        bottom: s * 0.1,
      }} />
      {/* Spine line */}
      <View style={{
        position: 'absolute',
        width: 2,
        height: s * 0.65,
        backgroundColor: color,
        bottom: s * 0.1,
      }} />
    </View>
  );
}

// ─── Person / Profile ────────────────────────────────────────
export function PersonIcon({ color, size = 24 }) {
  const s = size;
  return (
    <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
      {/* Head */}
      <View style={{
        width: s * 0.36,
        height: s * 0.36,
        borderRadius: s * 0.18,
        borderWidth: 2,
        borderColor: color,
        position: 'absolute',
        top: s * 0.05,
      }} />
      {/* Shoulders */}
      <View style={{
        width: s * 0.7,
        height: s * 0.38,
        borderTopLeftRadius: s * 0.35,
        borderTopRightRadius: s * 0.35,
        borderWidth: 2,
        borderColor: color,
        borderBottomWidth: 0,
        position: 'absolute',
        bottom: s * 0.0,
      }} />
    </View>
  );
}
