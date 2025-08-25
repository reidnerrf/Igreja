import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useTheme } from '@/constants/theme';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

export default function LoadingSpinner({ 
  size = 32, 
  color,
}: LoadingSpinnerProps) {
  const rotation = useSharedValue(0);
  const theme = useTheme();
  const effectiveColor = color ?? theme.colors.primary;

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.spinner,
          {
            width: size,
            height: size,
            borderColor: `${effectiveColor}20`,
            borderTopColor: effectiveColor,
          },
          animatedStyle
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  spinner: {
    borderWidth: 3,
    borderRadius: 50,
  },
});