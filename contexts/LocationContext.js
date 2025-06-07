import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      setIsPermissionGranted(true);
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const updateLocation = async () => {
    if (isPermissionGranted) {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      return location;
    }
    return null;
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      return addressResponse[0];
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  };

  return (
    <LocationContext.Provider value={{ 
      location, 
      errorMsg, 
      isPermissionGranted,
      updateLocation,
      getAddressFromCoordinates
    }}>
      {children}
    </LocationContext.Provider>
  );
};