import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface CatholicCardProps {
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
  onPress?: () => void;
  actionLabel?: string;
  accentColor?: string;
}

export default function CatholicCard({
  title,
  subtitle,
  content,
  image,
  onPress,
  actionLabel = 'Ver mais',
  accentColor = '#1E40AF'
}: CatholicCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}
      
      <View style={styles.content}>
        {subtitle && (
          <Text style={[styles.subtitle, { color: accentColor }]}>
            {subtitle}
          </Text>
        )}
        
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {content}
        </Text>
        
        {onPress && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: accentColor }]}
            onPress={onPress}
          >
            <Text style={styles.actionText}>{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});