import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RequestCard from '../../components/RequestCard';
import mockData from '../../services/mockData';
import { useUser } from '../../contexts/UserContext';

export default function VolunteerDeliveriesScreen({ navigation }) {
  const { user } = useUser();
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [listings, setListings] = useState({});
  const [receivers, setReceivers] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'completed'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // In a real app, we would use the actual user ID
      const volunteerId = user?.id || '4'; // Default to first volunteer in mock data
      
      // Get all requests for this volunteer
      const volunteerDeliveries = await mockData.getFoodRequestsByVolunteer(volunteerId);
      setMyDeliveries(volunteerDeliveries);
      
      // Get all listings related to these requests
      const listingIds = [...new Set(volunteerDeliveries.map(req => req.listingId))];
      const listingsMap = {};
      
      for (const id of listingIds) {
        const listing = await mockData.getFoodListingById(id);
        if (listing) {
          listingsMap[id] = listing;
        }
      }
      
      setListings(listingsMap);
      
      // Get all receivers who have made requests
      const receiverIds = [...new Set(volunteerDeliveries.map(req => req.receiverId))];
      const receiversMap = {};
      
      for (const id of receiverIds) {
        const receiver = await mockData.getUserById(id);
        if (receiver) {
          receiversMap[id] = receiver;
        }
      }
      
      setReceivers(receiversMap);
    } catch (error) {
      console.error('Error loading deliveries:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDeliveryPress = (request) => {
    // Navigate to delivery details
    // navigation.navigate('DeliveryDetails', { requestId: request.id });
    console.log('Delivery pressed:', request.id);
  };

  const getFilteredDeliveries = () => {
    if (activeTab === 'active') {
      return myDeliveries.filter(req => req.status === 'accepted');
    } else {
      return myDeliveries.filter(req => req.status === 'completed');
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="bicycle-outline" size={60} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Deliveries Yet</Text>
      <Text style={styles.emptyStateText}>
        You haven't taken any delivery requests yet. Check the available deliveries to get started.
      </Text>
      <TouchableOpacity 
        style={styles.emptyStateButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.emptyStateButtonText}>Find Deliveries</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Deliveries</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getFilteredDeliveries()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RequestCard
            request={item}
            listing={listings[item.listingId]}
            receiver={receivers[item.receiverId]}
            onPress={() => handleDeliveryPress(item)}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF9800',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF9800',
    fontWeight: 'bold',
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
    marginTop: 40,
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