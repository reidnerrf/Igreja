import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SkeletonProps {
  height?: number;
  width?: number | string;
  radius?: number;
}

export default function LoadingSkeleton({ height = 16, width = '100%', radius = 8 }: SkeletonProps) {
  return <View style={[styles.skeleton, { height, width, borderRadius: radius }]} />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
});

