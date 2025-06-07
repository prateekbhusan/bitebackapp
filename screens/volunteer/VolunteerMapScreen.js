import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import mockData from '../../services/mockData';
import { useLocation } from '../../contexts/LocationContext';

export default function VolunteerMapScreen({ navigation }) {
  const { location, updateLocation } = useLocation();
  const [requests, setRequests] = useState([]);
  const [listings, setListings] = useState({});
  const [receivers, setReceivers] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (location) {
      loadData();
    }
  }, [location]);

  const loadData = async () => {
    try {
      // In a real app, we would filter requests that need delivery and are nearby
      const allRequests = await mockData.getFoodRequests();
      
      // Filter for requests that need delivery and don't have a volunteer assigned
      const needsDelivery = allRequests.filter(req => 
        req.needsDelivery && 
        !req.volunteerId && 
        req.status === 'accepted'
      );
      
      setRequests(needsDelivery);
      
      // Get all listings related to these requests
      const listingIds = [...new Set(needsDelivery.map(req => req.listingId))];
      const listingsMap = {};
      
      for (const id of listingIds) {
        const listing = await mockData.getFoodListingById(id);
        if (listing) {
          listingsMap[id] = listing;
        }
      }
      
      setListings(listingsMap);
      
      // Get all receivers who have made requests
      const receiverIds = [...new Set(needsDelivery.map(req => req.receiverId))];
      const receiversMap = {};
      
      for (const id of receiverIds) {
        const receiver = await mockData.getUserById(id);
        if (receiver) {
          receiversMap[id] = receiver;
        }
      }
      
      setReceivers(receiversMap);
    } catch (error) {
      console.error('Error loading delivery requests for map:', error);
    }
  };

  const handleMarkerPress = (request) => {
    setSelectedRequest(request);
  };

  const handleRequestPress = (request) => {
    // Navigate to request details
    // navigation.navigate('DeliveryDetails', { requestId: request.id });
    console.log('Request pressed:', request.id);
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
        <Text style={styles.headerTitle}>Delivery Map</Text>
        <Text style={styles.headerSubtitle}>{requests.length} deliveries needed</Text>
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
        {requests.map((request) => {
          const listing = listings[request.listingId];
          if (!listing) return null;
          
          return (
            <Marker
              key={request.id}
              coordinate={{
                latitude: listing.location.latitude,
                longitude: listing.location.longitude,
              }}
              title="Pickup Location"
              description={listing.title}
              onPress={() => handleMarkerPress(request)}
              pinColor="#4CAF50"
            >
              <Callout onPress={() => handleRequestPress(request)}>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>Pickup: {listing.title}</Text>
                  <Text style={styles.calloutDetail}>
                    {listing.address}
                  </Text>
                  <Text style={styles.calloutAction}>Tap for details</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
        
        {requests.map((request) => {
          if (!request.deliveryLocation) return null;
          
          return (
            <Marker
              key={`delivery-${request.id}`}
              coordinate={{
                latitude: request.deliveryLocation.latitude,
                longitude: request.deliveryLocation.longitude,
              }}
              title="Delivery Location"
              description={request.deliveryAddress}
              onPress={() => handleMarkerPress(request)}
              pinColor="#FF9800"
            >
              <Callout onPress={() => handleRequestPress(request)}>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>Delivery Location</Text>
                  <Text style={styles.calloutDetail}>
                    {request.deliveryAddress}
                  </Text>
                  <Text style={styles.calloutAction}>Tap for details</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <TouchableOpacity style={styles.locationButton} onPress={centerOnUser}>
        <Ionicons name="locate" size={24} color="#FF9800" />
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
    color: '#FF9800',
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
    backgroundColor: '#FF9800',
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