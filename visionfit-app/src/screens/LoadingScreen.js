import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoadingScreen({ navigation }) {
  useEffect(() => { const timer = setTimeout(() => navigation.replace('Auth'), 1500); return () => clearTimeout(timer); }, [navigation]);
  return <SafeAreaView style={styles.container}><View style={styles.center}><Text style={styles.logo}>VISIONFIT</Text></View></SafeAreaView>;
}
const styles = StyleSheet.create({ container:{flex:1,backgroundColor:'#D9BEF3'},center:{flex:1,alignItems:'center',justifyContent:'center'},logo:{fontSize:30,fontWeight:'900',letterSpacing:-1,color:'#000'} });
