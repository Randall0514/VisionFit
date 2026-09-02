import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function AuthScreen({ navigation }) {
  const [mode, setMode] = useState('signin');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureConfirm, setSecureConfirm] = useState(true);

  const [errors, setErrors] = useState({});

  const signIn = mode === 'signin';

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!signIn) {
      if (!firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (signIn) {
        const result = await api.login(email.trim(), password);
        await AsyncStorage.setItem('token', result.token);
        navigation.replace('MainTabs');
      } else {
        await api.sendVerificationCode({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password
        });
        navigation.navigate('Verification', {
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          password
        });
        return;
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setErrors({});
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView
        style={s.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Text style={s.logo}>VISIONFIT</Text>
        <View style={s.form}>
          <Text style={s.eyebrow}>{signIn ? 'WELCOME BACK' : 'START YOUR STYLE JOURNEY'}</Text>
          <Text style={s.title}>{signIn ? 'Sign in' : 'Create account'}</Text>
          <Text style={s.subtitle}>
            {signIn ? 'Continue to your personal eyewear edit.' : 'Create a profile to save your favorite frames.'}
          </Text>

          {!signIn && (
            <>
              <TextInput
                style={[s.input, errors.firstName && s.inputError]}
                placeholder="First name"
                placeholderTextColor="#798078"
                value={firstName}
                onChangeText={(text) => { setFirstName(text); setErrors({ ...errors, firstName: null }); }}
              />
              {errors.firstName && <Text style={s.errorText}>{errors.firstName}</Text>}

              <TextInput
                style={[s.input, errors.lastName && s.inputError]}
                placeholder="Last name"
                placeholderTextColor="#798078"
                value={lastName}
                onChangeText={(text) => { setLastName(text); setErrors({ ...errors, lastName: null }); }}
              />
              {errors.lastName && <Text style={s.errorText}>{errors.lastName}</Text>}
            </>
          )}

          <TextInput
            style={[s.input, errors.email && s.inputError]}
            placeholder="Email address"
            placeholderTextColor="#798078"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => { setEmail(text); setErrors({ ...errors, email: null }); }}
          />
          {errors.email && <Text style={s.errorText}>{errors.email}</Text>}

          <View style={[s.passwordRow, errors.password && s.inputError]}>
            <TextInput
              style={s.passwordInput}
              placeholder="Password"
              placeholderTextColor="#798078"
              secureTextEntry={secure}
              value={password}
              onChangeText={(text) => { setPassword(text); setErrors({ ...errors, password: null }); }}
            />
            <TouchableOpacity onPress={() => setSecure(!secure)} hitSlop={10}>
              <Ionicons name={secure ? 'eye-off-outline' : 'eye-outline'} color="#3E4841" size={20} />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={s.errorText}>{errors.password}</Text>}

          {!signIn && (
            <>
              <View style={[s.passwordRow, errors.confirmPassword && s.inputError]}>
                <TextInput
                  style={s.passwordInput}
                  placeholder="Confirm password"
                  placeholderTextColor="#798078"
                  secureTextEntry={secureConfirm}
                  value={confirmPassword}
                  onChangeText={(text) => { setConfirmPassword(text); setErrors({ ...errors, confirmPassword: null }); }}
                />
                <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)} hitSlop={10}>
                  <Ionicons name={secureConfirm ? 'eye-off-outline' : 'eye-outline'} color="#3E4841" size={20} />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={s.errorText}>{errors.confirmPassword}</Text>}
            </>
          )}

          <TouchableOpacity
            style={[s.button, loading && s.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#171717" />
            ) : (
              <>
                <Text style={s.buttonText}>{signIn ? 'Sign in' : 'Create account'}</Text>
                <Ionicons name="arrow-forward" size={18} color="#171717" />
              </>
            )}
          </TouchableOpacity>

          {signIn ? (
            <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Password reset will be available in a future update.')}>
              <Text style={s.forgot}>Forgot password?</Text>
            </TouchableOpacity>
          ) : (
            <View style={s.switchLine}>
              <Text style={s.switchText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => handleModeSwitch('signin')}>
                <Text style={s.link}>Sign in</Text>
              </TouchableOpacity>
            </View>
          )}

          {signIn && (
            <View style={s.switchLine}>
              <Text style={s.switchText}>New to VisionFit? </Text>
              <TouchableOpacity onPress={() => handleModeSwitch('signup')}>
                <Text style={s.link}>Create account</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 54, paddingBottom: 34 },
  logo: { fontSize: 30, fontWeight: '900', letterSpacing: -1.4, color: '#111' },
  form: { marginTop: 58 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.1, color: '#7B687F', marginBottom: 9 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: -.8, color: '#111' },
  subtitle: { fontSize: 14, color: '#6E756F', lineHeight: 20, marginTop: 8, marginBottom: 28 },
  input: { height: 52, backgroundColor: '#F1F3F4', borderWidth: 1, borderColor: '#D7DBD8', borderRadius: 12, paddingHorizontal: 15, fontSize: 15, color: '#111', marginBottom: 13 },
  inputError: { borderColor: '#E53935' },
  errorText: { fontSize: 12, color: '#E53935', marginBottom: 10, marginTop: -8 },
  passwordRow: { height: 52, backgroundColor: '#F1F3F4', borderWidth: 1, borderColor: '#D7DBD8', borderRadius: 12, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 13 },
  passwordInput: { flex: 1, fontSize: 15, color: '#111', paddingVertical: 0 },
  button: { height: 52, borderRadius: 14, backgroundColor: '#DCCBEF', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 10 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { fontSize: 15, fontWeight: '800', color: '#171717' },
  forgot: { textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#252525', marginTop: 18 },
  switchLine: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  switchText: { fontSize: 14, color: '#333' },
  link: { fontSize: 14, fontWeight: '700', color: '#6C3BC6' }
});