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
  const data = await res.json();
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
    const data = await res.json();
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
};

export default api;
