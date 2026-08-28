import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function LoadingScreen({ navigation }) {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          await api.getMe(token);
          navigation.replace('MainTabs');
        } else {
          navigation.replace('Auth');
        }
      } catch {
        await AsyncStorage.removeItem('token');
        navigation.replace('Auth');
      }
    };
    checkAuth();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.logo}>VISIONFIT</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D9BEF3' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: 30, fontWeight: '900', letterSpacing: -1, color: '#000' },
});
