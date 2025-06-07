import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function UserTypeSelectionScreen({ onSelectUserType }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>How will you use BiteBack?</Text>
          <Text style={styles.subtitle}>Select your primary role</Text>
        </View>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => onSelectUserType('donor')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="restaurant-outline" size={32} color="#4CAF50" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Food Donor</Text>
            <Text style={styles.cardDescription}>
              I want to donate surplus food from my business, event, or organization
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => onSelectUserType('receiver')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="people-outline" size={32} color="#2196F3" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Food Receiver</Text>
            <Text style={styles.cardDescription}>
              I represent an NGO, shelter, or individual looking for food donations
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => onSelectUserType('volunteer')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="bicycle-outline" size={32} color="#FF9800" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Volunteer/Delivery</Text>
            <Text style={styles.cardDescription}>
              I want to help transport food from donors to receivers
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <Text style={styles.note}>
          You can change your role later in profile settings
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  note: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginTop: 20,
    marginBottom: 40,
  },
});