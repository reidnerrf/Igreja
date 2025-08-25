import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/theme';

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'small' | 'medium' | 'large';
}

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

const makeVariantStyles = (theme: ReturnType<typeof useTheme>) => ({
  success: {
    backgroundColor: theme.colors.success + '20',
    textColor: theme.colors.success,
    borderColor: theme.colors.success + '55',
  },
  warning: {
    backgroundColor: theme.colors.warning + '20',
    textColor: theme.colors.warning,
    borderColor: theme.colors.warning + '55',
  },
  error: {
    backgroundColor: theme.colors.error + '20',
    textColor: theme.colors.error,
    borderColor: theme.colors.error + '55',
  },
  info: {
    backgroundColor: theme.colors.info + '20',
    textColor: theme.colors.info,
    borderColor: theme.colors.info + '55',
  },
  neutral: {
    backgroundColor: theme.colors.muted,
    textColor: theme.colors.mutedForeground,
    borderColor: theme.colors.border,
  },
});

export default function StatusBadge({ 
  status, 
  variant = 'neutral', 
  size = 'medium' 
}: StatusBadgeProps) {
  const theme = useTheme();
  const variantStyle = makeVariantStyles(theme)[variant];
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
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});