import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RequestCard from '../../components/RequestCard';
import mockData from '../../services/mockData';
import { useLocation } from '../../contexts/LocationContext';

export default function VolunteerHomeScreen({ navigation }) {
  const { location } = useLocation();
  const [availableRequests, setAvailableRequests] = useState([]);
  const [listings, setListings] = useState({});
  const [receivers, setReceivers] = useState({});
  const [refreshing, setRefreshing] = useState(false);

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
      
      setAvailableRequests(needsDelivery);
      
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
      console.error('Error loading available deliveries:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleRequestPress = (request) => {
    // Navigate to request details
    // navigation.navigate('DeliveryDetails', { requestId: request.id });
    console.log('Request pressed:', request.id);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="bicycle-outline" size={60} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Deliveries Available</Text>
      <Text style={styles.emptyStateText}>
        There are no food deliveries available right now. Check back later or view the map to see if there are any nearby.
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
        <Text style={styles.headerTitle}>Available Deliveries</Text>
        <TouchableOpacity 
          style={styles.mapButton}
          onPress={() => navigation.navigate('Map')}
        >
          <Ionicons name="map-outline" size={20} color="#fff" />
          <Text style={styles.mapButtonText}>Map</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={availableRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RequestCard
            request={item}
            listing={listings[item.listingId]}
            receiver={receivers[item.receiverId]}
            onPress={() => handleRequestPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
      />
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
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
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
    backgroundColor: '#FF9800',
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