import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FoodListingCard from '../../components/FoodListingCard';
import mockData from '../../services/mockData';
import { useLocation } from '../../contexts/LocationContext';

export default function ReceiverHomeScreen({ navigation }) {
  const { location } = useLocation();
  const [nearbyListings, setNearbyListings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location) {
      loadNearbyListings();
    }
  }, [location]);

  const loadNearbyListings = async () => {
    if (!location) return;
    
    try {
      setLoading(true);
      const listings = await mockData.getNearbyFoodListings({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }, 10); // 10km radius
      
      setNearbyListings(listings);
    } catch (error) {
      console.error('Error loading nearby listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNearbyListings();
    setRefreshing(false);
  };

  const handleListingPress = (listing) => {
    // Navigate to listing details
    // navigation.navigate('ListingDetails', { listingId: listing.id });
    console.log('Listing pressed:', listing.id);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={60} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Food Available Nearby</Text>
      <Text style={styles.emptyStateText}>
        There are no food donations available in your area right now. Pull down to refresh or check back later.
      </Text>
      <TouchableOpacity 
        style={styles.emptyStateButton}
        onPress={() => navigation.navigate('Map')}
      >
        <Text style={styles.emptyStateButtonText}>View Map</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Food</Text>
        <TouchableOpacity 
          style={styles.mapButton}
          onPress={() => navigation.navigate('Map')}
        >
          <Ionicons name="map-outline" size={20} color="#fff" />
          <Text style={styles.mapButtonText}>Map</Text>
        </TouchableOpacity>
      </View>

      {loading && nearbyListings.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Finding food near you...</Text>
        </View>
      ) : (
        <FlatList
          data={nearbyListings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FoodListingCard listing={item} onPress={() => handleListingPress(item)} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
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
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyStateButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});