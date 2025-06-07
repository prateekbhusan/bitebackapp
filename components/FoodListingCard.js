import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

export default function FoodListingCard({ listing, onPress }) {
  // Default image if none provided
  const imageSource = listing.images && listing.images.length > 0
    ? { uri: listing.images[0] }
    : null;

  // Get appropriate icon for food type
  const getFoodTypeIcon = (type) => {
    switch (type) {
      case 'prepared':
        return 'restaurant-outline';
      case 'produce':
        return 'nutrition-outline';
      case 'bakery':
        return 'pizza-outline';
      case 'dairy':
        return 'water-outline';
      case 'packaged':
        return 'cube-outline';
      default:
        return 'fast-food-outline';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name={getFoodTypeIcon(listing.foodType)} size={40} color="#4CAF50" />
          </View>
        )}
        <View style={styles.expiryBadge}>
          <Text style={styles.expiryText}>{listing.getTimeUntilExpiry()}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>
        
        <View style={styles.detailRow}>
          <Ionicons name="cube-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            {listing.quantity} {listing.quantityUnit} • {listing.servesEstimate} servings
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            Pickup: {format(listing.pickupStartTime, 'h:mm a')} - {format(listing.pickupEndTime, 'h:mm a')}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.detailText} numberOfLines={1}>
            {listing.address}
          </Text>
        </View>
        
        <View style={styles.tags}>
          {listing.dietaryInfo.map((info, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{info}</Text>
            </View>
          ))}
        </View>
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
  imageContainer: {
    height: 150,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expiryBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expiryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#4CAF50',
  },
});