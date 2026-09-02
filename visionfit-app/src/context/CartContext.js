import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext({
  items: [],
  total: 0,
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('cart').then((data) => {
      if (data) setItems(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const addItem = useCallback((product, selectedColor) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id && i.selectedColor === selectedColor);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id && i.selectedColor === selectedColor
            ? { ...i, quantity: (i.quantity || 1) + 1 }
            : i
        );
      }
      return [...prev, { ...product, selectedColor, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId, selectedColor) => {
    setItems((prev) => prev.filter((i) => !(i._id === productId && i.selectedColor === selectedColor)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <CartContext.Provider value={{ items, total, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
