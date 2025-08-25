import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useTheme } from '@/constants/theme';

export default function RootLayout() {
  useFrameworkReady();
  const theme = useTheme();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={theme.colors.text === '#E2E8F0' ? 'light' : 'dark'} />
    </>
  );
}
