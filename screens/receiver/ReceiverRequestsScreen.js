import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RequestCard from '../../components/RequestCard';
import mockData from '../../services/mockData';
import { useUser } from '../../contexts/UserContext';

export default function ReceiverRequestsScreen({ navigation }) {
  const { user } = useUser();
  const [requests, setRequests] = useState([]);
  const [listings, setListings] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'accepted', 'completed'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // In a real app, we would use the actual user ID
      const receiverId = user?.id || '3'; // Default to first receiver in mock data
      
      // Get all requests for this receiver
      const receiverRequests = await mockData.getFoodRequestsByReceiver(receiverId);
      setRequests(receiverRequests);
      
      // Get all listings related to these requests
      const listingIds = [...new Set(receiverRequests.map(req => req.listingId))];
      const listingsMap = {};
      
      for (const id of listingIds) {
        const listing = await mockData.getFoodListingById(id);
        if (listing) {
          listingsMap[id] = listing;
        }
      }
      
      setListings(listingsMap);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleRequestPress = (request) => {
    // Navigate to request details
    // navigation.navigate('RequestDetails', { requestId: request.id });
    console.log('Request pressed:', request.id);
  };

  const getFilteredRequests = () => {
    if (activeTab === 'pending') {
      return requests.filter(req => req.status === 'pending');
    } else if (activeTab === 'accepted') {
      return requests.filter(req => req.status === 'accepted');
    } else if (activeTab === 'completed') {
      return requests.filter(req => req.status === 'completed');
    } else {
      return requests.filter(req => req.status === 'rejected' || req.status === 'cancelled');
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="list-outline" size={60} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Requests Yet</Text>
      <Text style={styles.emptyStateText}>
        When you request food, it will appear here.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Requests</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'accepted' && styles.activeTab]}
          onPress={() => setActiveTab('accepted')}
        >
          <Text style={[styles.tabText, activeTab === 'accepted' && styles.activeTabText]}>
            Accepted
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
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'other' && styles.activeTab]}
          onPress={() => setActiveTab('other')}
        >
          <Text style={[styles.tabText, activeTab === 'other' && styles.activeTabText]}>
            Other
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getFilteredRequests()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RequestCard
            request={item}
            listing={listings[item.listingId]}
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
    borderBottomColor: '#2196F3',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2196F3',
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
  },
});