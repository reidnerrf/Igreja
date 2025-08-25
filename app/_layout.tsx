import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';

const queryClient = new QueryClient();

// Minimal i18n boot with pt-BR default
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  resources: {
    'pt-BR': {
      translation: {
        common: {
          send: 'Enviar',
          like: 'Curtir',
          loading: 'Carregando...'
        }
      }
    }
  }
});

export default function RootLayout() {
  useFrameworkReady();

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </QueryClientProvider>
    </I18nextProvider>
  );
}
