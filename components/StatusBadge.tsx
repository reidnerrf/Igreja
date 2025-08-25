import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'small' | 'medium' | 'large';
}

const variantStyles = {
  success: {
    backgroundColor: '#ECFDF5',
    textColor: '#059669',
    borderColor: '#6EE7B7',
  },
  warning: {
    backgroundColor: '#FEF3C7',
    textColor: '#92400E',
    borderColor: '#FCD34D',
  },
  error: {
    backgroundColor: '#FEE2E2',
    textColor: '#DC2626',
    borderColor: '#FCA5A5',
  },
  info: {
    backgroundColor: '#DBEAFE',
    textColor: '#1E40AF',
    borderColor: '#93C5FD',
  },
  neutral: {
    backgroundColor: '#F3F4F6',
    textColor: '#6B7280',
    borderColor: '#D1D5DB',
  },
};

const sizeStyles = {
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 10,
  },
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
  },
};

export default function StatusBadge({ 
  status, 
  variant = 'neutral', 
  size = 'medium' 
}: StatusBadgeProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: variantStyle.backgroundColor,
        borderColor: variantStyle.borderColor,
        paddingHorizontal: sizeStyle.paddingHorizontal,
        paddingVertical: sizeStyle.paddingVertical,
      }
    ]}>
      <Text style={[
        styles.text,
        {
          color: variantStyle.textColor,
          fontSize: sizeStyle.fontSize,
        }
      ]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});