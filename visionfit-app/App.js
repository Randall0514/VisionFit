import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import OnboardingScreen  from './src/screens/OnboardingScreen';
import DashboardScreen   from './src/screens/DashboardScreen';
import HistoryScreen     from './src/screens/HistoryScreen';
import CatalogScreen     from './src/screens/CatalogScreen';
import EducationScreen   from './src/screens/EducationScreen';
import ProfileScreen     from './src/screens/ProfileScreen';

import {
  HomeIcon,
  ClockIcon,
  GridIcon,
  BookIcon,
  PersonIcon,
} from './src/components/TabIcons';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const ACTIVE_COLOR   = '#3B5A3E'; // dark forest green  (active)
const INACTIVE_COLOR = '#A89F8C'; // warm tan-gray       (inactive)

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: '#F8F7F2',
          borderTopWidth: 1,
          borderTopColor: '#E8E5DE',
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.1,
        },
        tabBarIcon: ({ color, focused }) => {
          const size = 23;
          switch (route.name) {
            case 'Home':
              return <HomeIcon color={color} size={size} filled={focused} />;
            case 'History':
              return <ClockIcon color={color} size={size} />;
            case 'Catalog':
              return <GridIcon color={color} size={size} />;
            case 'Education':
              return <BookIcon color={color} size={size} />;
            case 'Profile':
              return <PersonIcon color={color} size={size} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home"      component={DashboardScreen} />
      <Tab.Screen name="History"   component={HistoryScreen} />
      <Tab.Screen name="Catalog"   component={CatalogScreen} />
      <Tab.Screen name="Education" component={EducationScreen} />
      <Tab.Screen name="Profile"   component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="MainTabs"   component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
