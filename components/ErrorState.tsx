import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ErrorStateProps {
  message?: string;
}

export default function ErrorState({ message = 'Ocorreu um erro. Tente novamente.' }: ErrorStateProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 8,
    margin: 12,
  },
  text: {
    color: '#DC2626',
    fontWeight: '600',
  },
});

