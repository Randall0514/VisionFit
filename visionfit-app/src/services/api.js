import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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
  },

  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_URL}/products?${query}` : `${API_URL}/products`;
    const response = await fetch(url);
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to fetch products');
    if (Array.isArray(result)) {
      return { products: result };
    }
    return result;
  },

  async getProduct(id) {
    const response = await fetch(`${API_URL}/products/${id}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Product not found');
    return result;
  },

  async getFavorites() {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/favorites`, { headers });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to fetch favorites');
    if (Array.isArray(result)) {
      return { favorites: result };
    }
    return result;
  },

  async addFavorite(productId) {
    const headers = { 'Content-Type': 'application/json', ...(await authHeaders()) };
    const response = await fetch(`${API_URL}/favorites/${productId}`, {
      method: 'POST',
      headers,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to add favorite');
    return result;
  },

  async removeFavorite(productId) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/favorites/${productId}`, {
      method: 'DELETE',
      headers,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to remove favorite');
    return result;
  },

  async getOrders() {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/orders`, { headers });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to fetch orders');
    if (Array.isArray(result)) {
      return { orders: result };
    }
    return result;
  },

  async createOrder(data) {
    const headers = { 'Content-Type': 'application/json', ...(await authHeaders()) };
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to create order');
    return result;
  },
};

export { getToken };
export default api;
