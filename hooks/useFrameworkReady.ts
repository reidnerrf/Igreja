import { useEffect } from 'react';
import { Platform } from 'react-native';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Only call when running on web. Guard avoids ReferenceError on native.
      (window as unknown as Window | undefined)?.frameworkReady?.();
    }
  }, []);
}
