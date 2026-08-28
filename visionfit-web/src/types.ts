export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  faceShape: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  frameShape: string;
  colors: { name: string; hex: string }[];
  compatibleLenses: string[];
  faceShapes: string[];
  image: string;
  inStock: boolean;
  createdAt: string;
}

export interface OrderItem {
  product: Product | string;
  name: string;
  color: string;
  lensType: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user: User | { _id: string; firstName: string; lastName: string; email: string };
  items: OrderItem[];
  totalPrice: number;
  status: 'unpaid' | 'processing' | 'shipped' | 'delivered';
  deliveryDetails: { fullName: string; address: string; mobile: string };
  createdAt: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  statusCounts: Record<string, number>;
  recentOrders: Order[];
}
