const API_URL = '/api';

function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data as T;
}

const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; firstName: string; lastName: string; email: string; role: string } }>(
      '/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }
    ),

  getMe: () => request<{ user: any }>('/auth/me'),

  getDashboard: () => request<any>('/orders/admin/stats'),

  getProducts: (search?: string) =>
    request<any[]>(`/products${search ? `?search=${encodeURIComponent(search)}` : ''}`),

  getProduct: (id: string) => request<any>(`/products/${id}`),

  createProduct: (data: any) =>
    request<any>('/products', { method: 'POST', body: JSON.stringify(data) }),

  updateProduct: (id: string, data: any) =>
    request<any>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteProduct: (id: string) =>
    request<{ message: string }>(`/products/${id}`, { method: 'DELETE' }),

  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const token = getToken();
    const res = await fetch(`/api/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  },

  getOrders: (page = 1, status?: string) =>
    request<{ orders: any[]; total: number; page: number; pages: number }>(
      `/orders/admin/all?page=${page}${status ? `&status=${status}` : ''}`
    ),

  getOrder: (id: string) => request<any>(`/orders/admin/${id}`),

  updateOrderStatus: (id: string, status: string) =>
    request<any>(`/orders/admin/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  updateStock: (id: string, data: { stock: { color: string; quantity: number }[]; lowStockThreshold?: number }) =>
    request<any>(`/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify(data) }),

  getLowStock: (threshold?: number) =>
    request<any[]>(`/products/admin/low-stock${threshold ? `?threshold=${threshold}` : ''}`),

  getAnalytics: (from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const qs = params.toString();
    return request<any>(`/orders/admin/analytics${qs ? `?${qs}` : ''}`);
  },

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<{ message: string }>('/auth/password', { method: 'PUT', body: JSON.stringify(data) }),

  getNotifications: () => request<any[]>('/notifications'),

  markNotificationRead: (id: string) =>
    request<any>(`/notifications/${id}/read`, { method: 'PUT' }),

  deleteNotification: (id: string) =>
    request<{ message: string }>(`/notifications/${id}`, { method: 'DELETE' }),

  getSettings: () => request<any>('/settings'),

  updateSettings: (data: any) =>
    request<any>('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

export default api;
