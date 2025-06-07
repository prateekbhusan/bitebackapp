import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import VolunteerHomeScreen from '../screens/volunteer/VolunteerHomeScreen';
import VolunteerMapScreen from '../screens/volunteer/VolunteerMapScreen';
import VolunteerDeliveriesScreen from '../screens/volunteer/VolunteerDeliveriesScreen';
import VolunteerProfileScreen from '../screens/volunteer/VolunteerProfileScreen';
import VolunteerImpactScreen from '../screens/volunteer/VolunteerImpactScreen';

const Tab = createBottomTabNavigator();

export default function VolunteerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Deliveries') {
            iconName = focused ? 'bicycle' : 'bicycle-outline';
          } else if (route.name === 'Impact') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF9800',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={VolunteerHomeScreen} />
      <Tab.Screen name="Map" component={VolunteerMapScreen} />
      <Tab.Screen name="Deliveries" component={VolunteerDeliveriesScreen} />
      <Tab.Screen name="Impact" component={VolunteerImpactScreen} />
      <Tab.Screen name="Profile" component={VolunteerProfileScreen} />
    </Tab.Navigator>
  );
}