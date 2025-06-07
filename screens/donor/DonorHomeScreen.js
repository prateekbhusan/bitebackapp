import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FoodListingCard from '../../components/FoodListingCard';
import mockData from '../../services/mockData';
import { useUser } from '../../contexts/UserContext';

export default function DonorHomeScreen({ navigation }) {
  const { user } = useUser();
  const [activeListings, setActiveListings] = useState([]);
  const [pastListings, setPastListings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showPastListings, setShowPastListings] = useState(false);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      // In a real app, we would use the actual user ID
      const donorId = user?.id || '1'; // Default to first donor in mock data
      const listings = await mockData.getFoodListingsByDonor(donorId);
      
      // Split into active and past listings
      const active = listings.filter(listing => 
        (listing.status === 'available' || listing.status === 'reserved') && 
        !listing.isExpired()
      );
      
      const past = listings.filter(listing => 
        listing.status === 'completed' || 
        listing.status === 'expired' || 
        listing.isExpired()
      );
      
      setActiveListings(active);
      setPastListings(past);
    } catch (error) {
      console.error('Error loading listings:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadListings();
    setRefreshing(false);
  };

  const handleListingPress = (listing) => {
    // Navigate to listing details
    // navigation.navigate('ListingDetails', { listingId: listing.id });
    console.log('Listing pressed:', listing.id);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="restaurant-outline" size={60} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Food Listings Yet</Text>
      <Text style={styles.emptyStateText}>
        Start by adding your surplus food to help reduce waste and feed those in need.
      </Text>
      <TouchableOpacity 
        style={styles.emptyStateButton}
        onPress={() => navigation.navigate('Create')}
      >
        <Text style={styles.emptyStateButtonText}>Create Listing</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Food Listings</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => navigation.navigate('Create')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      {activeListings.length === 0 && pastListings.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Listings</Text>
            <Text style={styles.sectionCount}>{activeListings.length}</Text>
          </View>

          <FlatList
            data={activeListings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FoodListingCard listing={item} onPress={() => handleListingPress(item)} />
            )}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Text style={styles.emptyListText}>No active listings</Text>
            }
            ListFooterComponent={
              pastListings.length > 0 ? (
                <View>
                  <TouchableOpacity 
                    style={styles.pastListingsToggle}
                    onPress={() => setShowPastListings(!showPastListings)}
                  >
                    <Text style={styles.pastListingsToggleText}>
                      {showPastListings ? 'Hide Past Listings' : 'Show Past Listings'}
                    </Text>
                    <Ionicons 
                      name={showPastListings ? 'chevron-up' : 'chevron-down'} 
                      size={16} 
                      color="#4CAF50" 
                    />
                  </TouchableOpacity>

                  {showPastListings && (
                    <>
                      <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Past Listings</Text>
                        <Text style={styles.sectionCount}>{pastListings.length}</Text>
                      </View>
                      
                      {pastListings.map(listing => (
                        <FoodListingCard 
                          key={listing.id} 
                          listing={listing} 
                          onPress={() => handleListingPress(listing)} 
                        />
                      ))}
                    </>
                  )}
                </View>
              ) : null
            }
          />
        </>
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  listContent: {
    padding: 16,
  },
  emptyListText: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
  },
  pastListingsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginVertical: 10,
  },
  pastListingsToggleText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginRight: 5,
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
    backgroundColor: '#4CAF50',
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