import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import mockData from '../../services/mockData';
import { useUser } from '../../contexts/UserContext';

export default function DonorProfileScreen({ navigation }) {
  const { user, logout, setUserType } = useUser();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // In a real app, we would use the actual user ID
      const donorId = user?.id || '1'; // Default to first donor in mock data
      const userData = await mockData.getUserById(donorId);
      setProfile(userData);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // In a real app, we would clear auth tokens, etc.
            logout();
            // Navigate back to auth screen would be handled by App.tsx
          }
        },
      ]
    );
  };

  const handleSwitchRole = () => {
    Alert.alert(
      'Switch Role',
      'Would you like to switch your role?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Receiver', 
          onPress: () => setUserType('receiver')
        },
        { 
          text: 'Volunteer', 
          onPress: () => setUserType('volunteer')
        },
      ]
    );
  };

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            {profile.profilePicture ? (
              <Image source={{ uri: profile.profilePicture }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
            )}
          </View>
          
          <Text style={styles.name}>{profile.organizationName || profile.name}</Text>
          <Text style={styles.role}>Food Donor</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.totalDonations}</Text>
              <Text style={styles.statLabel}>Donations</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.mealsSaved}</Text>
              <Text style={styles.statLabel}>Meals Saved</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{profile.email}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="call-outline" size={20} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{profile.phone}</Text>
          </View>
          
          {profile.organizationType && (
            <View style={styles.infoItem}>
              <Ionicons name="business-outline" size={20} color="#666" style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Organization Type</Text>
              <Text style={styles.infoValue}>{profile.organizationType}</Text>
            </View>
          )}
          
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={20} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{profile.address}</Text>
          </View>
          
          {profile.bio && (
            <View style={styles.bioContainer}>
              <Text style={styles.bioLabel}>About</Text>
              <Text style={styles.bioText}>{profile.bio}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.settingIcon} />
            <Text style={styles.settingText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="notifications-outline" size={20} color="#666" style={styles.settingIcon} />
            <Text style={styles.settingText}>Notification Preferences</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleSwitchRole}>
            <Ionicons name="swap-horizontal-outline" size={20} color="#666" style={styles.settingIcon} />
            <Text style={styles.settingText}>Switch Role</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="help-circle-outline" size={20} color="#666" style={styles.settingIcon} />
            <Text style={styles.settingText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#F44336" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '80%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    marginRight: 10,
  },
  infoLabel: {
    width: 100,
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  bioContainer: {
    marginTop: 16,
  },
  bioLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIcon: {
    marginRight: 10,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#F44336',
    fontWeight: 'bold',
  },
});