import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SessionWarning from './components/SessionWarning';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import './App.css';

function AppContent() {
  const { sessionWarning, dismissSessionWarning, logout } = useAuth();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Layout><Products /></Layout></ProtectedRoute>} />
          <Route path="/products/new" element={<ProtectedRoute><Layout><ProductForm /></Layout></ProtectedRoute>} />
          <Route path="/products/:id/edit" element={<ProtectedRoute><Layout><ProductForm /></Layout></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Layout><Inventory /></Layout></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Layout><Orders /></Layout></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><Layout><OrderDetail /></Layout></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
      <SessionWarning
        isOpen={sessionWarning}
        onStayLoggedIn={dismissSessionWarning}
        onLogout={logout}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
