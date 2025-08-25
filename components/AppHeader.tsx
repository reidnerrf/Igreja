import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, User } from 'lucide-react-native';
import { useTheme, tokens } from '@/constants/theme';

type GradientColors = readonly [string, string, ...string[]];

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
  backgroundColor,
}: AppHeaderProps) {
  const theme = useTheme();
  const defaultColors = [theme.colors.primary, tokens.blue[500]] as const;
  const gradientColors: GradientColors = backgroundColor && backgroundColor.length >= 2
    ? (backgroundColor as unknown as GradientColors)
    : defaultColors;

  return (
    <LinearGradient
      colors={gradientColors}
      style={[
        styles.container,
        { 
          paddingTop: theme.spacing.lg, 
          paddingBottom: theme.spacing.lg, 
          paddingHorizontal: theme.spacing.lg 
        }
      ]}
    >
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.primaryContrast }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: tokens.blue[200] }]}>{subtitle}</Text>
          )}
        </View>
        
        <View style={styles.actionsContainer}>
          {showNotifications && (
            <TouchableOpacity style={[styles.actionButton, { borderRadius: theme.radius.md }] }>
              <Bell size={22} color={theme.colors.primaryContrast} />
            </TouchableOpacity>
          )}
          
          {showProfile && (
            <TouchableOpacity style={[styles.actionButton, { borderRadius: theme.radius.md }] }>
              <User size={22} color={theme.colors.primaryContrast} />
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