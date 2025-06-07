import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

export default function RequestCard({ request, listing, receiver, onPress }) {
  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFC107'; // Amber
      case 'accepted':
        return '#4CAF50'; // Green
      case 'completed':
        return '#2196F3'; // Blue
      case 'rejected':
      case 'cancelled':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Grey
    }
  };

  // Format status text
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {listing ? listing.title : 'Food Request'}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
            <Text style={styles.statusText}>{formatStatus(request.status)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {receiver && (
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {receiver.getDisplayName()}
            </Text>
          </View>
        )}
        
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            Feeding {request.peopleToFeed} people
          </Text>
        </View>
        
        {request.pickupTime && (
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              Pickup: {format(request.pickupTime, 'MMM d, h:mm a')}
            </Text>
          </View>
        )}
        
        {request.needsDelivery && (
          <View style={styles.detailRow}>
            <Ionicons name="bicycle-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              Delivery needed to {request.deliveryAddress}
            </Text>
          </View>
        )}
        
        {request.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{request.notes}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.timestamp}>
          Requested {format(request.createdAt, 'MMM d, h:mm a')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  notes: {
    marginTop: 8,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
});