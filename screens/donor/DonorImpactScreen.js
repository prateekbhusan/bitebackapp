import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ImpactCard from '../../components/ImpactCard';
import mockData from '../../services/mockData';
import { useUser } from '../../contexts/UserContext';

export default function DonorImpactScreen() {
  const { user } = useUser();
  const [impact, setImpact] = useState(null);
  const [globalImpact, setGlobalImpact] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadImpactData();
  }, []);

  const loadImpactData = async () => {
    try {
      // In a real app, we would use the actual user ID
      const donorId = user?.id || '1'; // Default to first donor in mock data
      
      const donorImpact = await mockData.getDonorImpact(donorId);
      setImpact(donorImpact);
      
      const appGlobalImpact = await mockData.getGlobalImpact();
      setGlobalImpact(appGlobalImpact);
    } catch (error) {
      console.error('Error loading impact data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadImpactData();
    setRefreshing(false);
  };

  if (!impact || !globalImpact) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading impact data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Impact</Text>
        </View>

        <View style={styles.impactContainer}>
          <ImpactCard
            title="Food Donations"
            value={impact.totalDonations}
            icon="restaurant-outline"
            color="#4CAF50"
            subtitle="Total listings shared"
          />
          
          <ImpactCard
            title="Meals Saved"
            value={impact.mealsSaved}
            icon="people-outline"
            color="#2196F3"
            subtitle="Estimated servings provided"
          />
          
          <ImpactCard
            title="CO₂ Prevented"
            value={`${impact.carbonFootprint} kg`}
            icon="leaf-outline"
            color="#FF9800"
            subtitle="Carbon emissions avoided"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.globalSection}>
          <Text style={styles.globalTitle}>BiteBack Community Impact</Text>
          
          <View style={styles.globalStats}>
            <View style={styles.globalStatItem}>
              <Ionicons name="restaurant-outline" size={32} color="#4CAF50" />
              <Text style={styles.globalStatValue}>{globalImpact.totalDonations}</Text>
              <Text style={styles.globalStatLabel}>Donations</Text>
            </View>
            
            <View style={styles.globalStatItem}>
              <Ionicons name="people-outline" size={32} color="#2196F3" />
              <Text style={styles.globalStatValue}>{globalImpact.mealsSaved}</Text>
              <Text style={styles.globalStatLabel}>Meals</Text>
            </View>
            
            <View style={styles.globalStatItem}>
              <Ionicons name="leaf-outline" size={32} color="#FF9800" />
              <Text style={styles.globalStatValue}>{globalImpact.carbonFootprint} kg</Text>
              <Text style={styles.globalStatLabel}>CO₂ Saved</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="information-circle-outline" size={32} color="#2196F3" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Food Waste Facts</Text>
              <Text style={styles.infoText}>
                Approximately 1/3 of all food produced globally is wasted. By donating your surplus food, you're helping reduce this waste and feeding those in need.
              </Text>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="bulb-outline" size={32} color="#FF9800" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Environmental Impact</Text>
              <Text style={styles.infoText}>
                Food waste in landfills produces methane, a greenhouse gas 25 times more potent than CO₂. Your donations help reduce these emissions.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 30,
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
  impactContainer: {
    padding: 16,
  },
  divider: {
    height: 8,
    backgroundColor: '#f0f0f0',
  },
  globalSection: {
    padding: 16,
    backgroundColor: '#fff',
  },
  globalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  globalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  globalStatItem: {
    alignItems: 'center',
  },
  globalStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  globalStatLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoSection: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoIconContainer: {
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});