import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import mockData from '../../services/mockData';
import { useLocation } from '../../contexts/LocationContext';

export default function ReceiverMapScreen({ navigation }) {
  const { location, updateLocation } = useLocation();
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    loadListings();
  }, [location]);

  const loadListings = async () => {
    if (!location) return;
    
    try {
      const nearbyListings = await mockData.getNearbyFoodListings({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }, 10); // 10km radius
      
      setListings(nearbyListings);
    } catch (error) {
      console.error('Error loading listings for map:', error);
    }
  };

  const handleMarkerPress = (listing) => {
    setSelectedListing(listing);
  };

  const handleListingPress = (listing) => {
    // Navigate to listing details
    // navigation.navigate('ListingDetails', { listingId: listing.id });
    console.log('Listing pressed:', listing.id);
  };

  const centerOnUser = async () => {
    if (!location) {
      const newLocation = await updateLocation();
      if (!newLocation) return;
    }
    
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  if (!location) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food Map</Text>
        <Text style={styles.headerSubtitle}>{listings.length} listings nearby</Text>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            coordinate={{
              latitude: listing.location.latitude,
              longitude: listing.location.longitude,
            }}
            title={listing.title}
            description={`${listing.quantity} ${listing.quantityUnit} • ${listing.getTimeUntilExpiry()}`}
            onPress={() => handleMarkerPress(listing)}
            pinColor="#4CAF50"
          >
            <Callout onPress={() => handleListingPress(listing)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{listing.title}</Text>
                <Text style={styles.calloutDetail}>
                  {listing.quantity} {listing.quantityUnit} • {listing.servesEstimate} servings
                </Text>
                <Text style={styles.calloutDetail}>
                  {listing.getTimeUntilExpiry()}
                </Text>
                <Text style={styles.calloutAction}>Tap for details</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity style={styles.locationButton} onPress={centerOnUser}>
        <Ionicons name="locate" size={24} color="#2196F3" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.listButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="list" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  map: {
    flex: 1,
  },
  callout: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  calloutAction: {
    fontSize: 14,
    color: '#2196F3',
    marginTop: 5,
    fontWeight: 'bold',
  },
  locationButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  listButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#2196F3',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});