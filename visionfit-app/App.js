import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoadingScreen from './src/screens/LoadingScreen';
import AuthScreen from './src/screens/AuthScreen';
import VerificationScreen from './src/screens/VerificationScreen';
import DashboardScreen   from './src/screens/DashboardScreen';
import CatalogScreen     from './src/screens/CatalogScreen';
import ProfileScreen     from './src/screens/ProfileScreen';
import FavoritesScreen   from './src/screens/FavoritesScreen';
import PrescriptionScreen from './src/screens/PrescriptionScreen';
import FaceScanScreen from './src/screens/FaceScanScreen';
import ProductScreen from './src/screens/ProductScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const ACTIVE_COLOR   = '#000000';
const INACTIVE_COLOR = '#8A8A8A';

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#D7D7D7',
          height: 66,
          paddingBottom: 7,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.1,
        },
        tabBarIcon: ({ color, focused }) => {
          const size = 27;
          switch (route.name) {
            case 'Home':
              return <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={size} />;
            case 'Category':
              return <Ionicons name="menu-outline" color={color} size={size + 3} />;
            case 'Favorites':
              return <Ionicons name={focused ? 'heart' : 'heart-outline'} color={color} size={size} />;
            case 'Cart':
              return <Ionicons name={focused ? 'cart' : 'cart-outline'} color={color} size={size} />;
            case 'Profile':
              return <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={size} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Category" component={CatalogScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="MainTabs"   component={MainTabs} />
        <Stack.Screen name="Prescription" component={PrescriptionScreen} />
        <Stack.Screen name="FaceScan" component={FaceScanScreen} />
        <Stack.Screen name="Product" component={ProductScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Catalog" component={CatalogScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
