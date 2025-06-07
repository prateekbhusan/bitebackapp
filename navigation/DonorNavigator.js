import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DonorHomeScreen from '../screens/donor/DonorHomeScreen';
import CreateListingScreen from '../screens/donor/CreateListingScreen';
import DonorProfileScreen from '../screens/donor/DonorProfileScreen';
import DonorRequestsScreen from '../screens/donor/DonorRequestsScreen';
import DonorImpactScreen from '../screens/donor/DonorImpactScreen';

const Tab = createBottomTabNavigator();

export default function DonorNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Requests') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Impact') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={DonorHomeScreen} />
      <Tab.Screen name="Create" component={CreateListingScreen} />
      <Tab.Screen name="Requests" component={DonorRequestsScreen} />
      <Tab.Screen name="Impact" component={DonorImpactScreen} />
      <Tab.Screen name="Profile" component={DonorProfileScreen} />
    </Tab.Navigator>
  );
}