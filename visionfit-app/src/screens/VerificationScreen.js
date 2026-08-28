import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function VerificationScreen({ route, navigation }) {
  const { email, firstName, lastName, password } = route.params;
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (text, index) => {
    if (text.length > 1) {
      text = text.slice(-1);
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== '')) {
      Keyboard.dismiss();
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
    }
  };

  const handleVerify = async (codeString) => {
    if (!codeString) codeString = code.join('');
    if (codeString.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      await api.verifyCode(email, codeString);
      Alert.alert('Success', 'Your account has been created!', [
        { text: 'OK', onPress: () => navigation.replace('Auth') }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.resendCode(email);
      setCountdown(60);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      Alert.alert('Sent', 'A new verification code has been sent to your email.');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>

        <Text style={s.logo}>VISIONFIT</Text>
        <Text style={s.eyebrow}>VERIFY YOUR EMAIL</Text>
        <Text style={s.title}>Enter verification code</Text>
        <Text style={s.subtitle}>
          We sent a 6-digit code to{'\n'}
          <Text style={s.email}>{email}</Text>
        </Text>

        <View style={s.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[s.codeInput, digit ? s.codeInputFilled : null]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={[s.button, loading && s.buttonDisabled]}
          onPress={() => handleVerify()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.buttonText}>Verify</Text>
          )}
        </TouchableOpacity>

        <View style={s.resendContainer}>
          {countdown > 0 ? (
            <Text style={s.countdownText}>Resend code in {countdown}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={resending}>
              <Text style={s.resendText}>
                {resending ? 'Sending...' : 'Resend code'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  back: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F1F3F4', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  logo: { fontSize: 30, fontWeight: '900', letterSpacing: -1.4, color: '#111', marginBottom: 30 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.1, color: '#7B687F', marginBottom: 9 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: -0.8, color: '#111' },
  subtitle: { fontSize: 14, color: '#6E756F', lineHeight: 20, marginTop: 8, marginBottom: 32 },
  email: { fontWeight: '700', color: '#111' },
  codeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  codeInput: {
    width: 50, height: 60, borderWidth: 2, borderColor: '#D7DBD8', borderRadius: 12,
    textAlign: 'center', fontSize: 24, fontWeight: '800', color: '#111', backgroundColor: '#F1F3F4'
  },
  codeInputFilled: { borderColor: '#6C3BC6', backgroundColor: '#F5F0FA' },
  button: {
    height: 52, borderRadius: 14, backgroundColor: '#6C3BC6', alignItems: 'center',
    justifyContent: 'center', marginBottom: 20
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  resendContainer: { alignItems: 'center' },
  countdownText: { fontSize: 14, color: '#999' },
  resendText: { fontSize: 14, fontWeight: '700', color: '#6C3BC6' }
});