import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ReceiverHomeScreen from '../screens/receiver/ReceiverHomeScreen';
import ReceiverMapScreen from '../screens/receiver/ReceiverMapScreen';
import ReceiverRequestsScreen from '../screens/receiver/ReceiverRequestsScreen';
import ReceiverProfileScreen from '../screens/receiver/ReceiverProfileScreen';

const Tab = createBottomTabNavigator();

export default function ReceiverNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Requests') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={ReceiverHomeScreen} />
      <Tab.Screen name="Map" component={ReceiverMapScreen} />
      <Tab.Screen name="Requests" component={ReceiverRequestsScreen} />
      <Tab.Screen name="Profile" component={ReceiverProfileScreen} />
    </Tab.Navigator>
  );
}