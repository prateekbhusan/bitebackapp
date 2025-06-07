import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ImpactCard({ title, value, icon, color, subtitle }) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  iconContainer: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#666',
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});