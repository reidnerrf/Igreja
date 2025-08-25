import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, User } from 'lucide-react-native';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showNotifications?: boolean;
  showProfile?: boolean;
  backgroundColor?: string[];
}

export default function AppHeader({ 
  title, 
  subtitle, 
  showNotifications = true,
  showProfile = true,
  backgroundColor = ['#1E40AF', '#3B82F6']
}: AppHeaderProps) {
  return (
    <LinearGradient
      colors={backgroundColor}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>
        
        <View style={styles.actionsContainer}>
          {showNotifications && (
            <TouchableOpacity style={styles.actionButton}>
              <Bell size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          
          {showProfile && (
            <TouchableOpacity style={styles.actionButton}>
              <User size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#BFDBFE',
    fontWeight: '400',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
  },
});