import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_IP = '192.168.1.11';
const API_URL = Platform.select({
  android: `http://${LOCAL_IP}:5000/api`,
  ios: `http://localhost:5000/api`,
  default: `http://localhost:5000/api`
});

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch {
    return null;
  }
};

const authHeaders = async () => {
  const token = await getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const api = {
  async sendVerificationCode(data) {
    const response = await fetch(`${API_URL}/auth/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to send code');
    return result;
  },

  async verifyCode(email, code) {
    const response = await fetch(`${API_URL}/auth/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Verification failed');
    return result;
  },

  async resendCode(email) {
    const response = await fetch(`${API_URL}/auth/resend-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to resend code');
    return result;
  },

  async register(data) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Registration failed');
    return result;
  },

  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Login failed');
    return result;
  },

  async getMe(token) {
    const headers = token
      ? { 'Authorization': `Bearer ${token}` }
      : await authHeaders();
    const response = await fetch(`${API_URL}/auth/me`, { headers });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to get user');
    return result;
  },

  async updateMe(data) {
    const headers = {
      'Content-Type': 'application/json',
      ...(await authHeaders())
    };
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Update failed');
    return result;
  }
};

export { getToken };
export default api;