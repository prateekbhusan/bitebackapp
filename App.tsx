import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AuthScreen from './screens/AuthScreen';
import UserTypeSelectionScreen from './screens/UserTypeSelectionScreen';
import DonorNavigator from './navigation/DonorNavigator';
import ReceiverNavigator from './navigation/ReceiverNavigator';
import VolunteerNavigator from './navigation/VolunteerNavigator';
import { UserProvider } from './contexts/UserContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LocationProvider } from './contexts/LocationContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  // Mock authentication for now
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSelectUserType = (type) => {
    setUserType(type);
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <UserProvider>
        <LocationProvider>
          <NotificationProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isLoggedIn ? (
                  <Stack.Screen name="Auth">
                    {props => <AuthScreen {...props} onLogin={handleLogin} />}
                  </Stack.Screen>
                ) : !userType ? (
                  <Stack.Screen name="UserTypeSelection">
                    {props => <UserTypeSelectionScreen {...props} onSelectUserType={handleSelectUserType} />}
                  </Stack.Screen>
                ) : (
                  <>
                    {userType === 'donor' && (
                      <Stack.Screen name="DonorFlow" component={DonorNavigator} />
                    )}
                    {userType === 'receiver' && (
                      <Stack.Screen name="ReceiverFlow" component={ReceiverNavigator} />
                    )}
                    {userType === 'volunteer' && (
                      <Stack.Screen name="VolunteerFlow" component={VolunteerNavigator} />
                    )}
                  </>
                )}
              </Stack.Navigator>
            </NavigationContainer>
          </NotificationProvider>
        </LocationProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}