/**
 * GullyScore Root Application Layout
 */

import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getDatabase } from '../src/database/sqlite';
import { useSettingsStore } from '../src/stores/settings.store';
import { colors } from '../src/theme';
import { AppLoadingState } from '../src/components/ui/AppLoadingState';
import { Phase2NoticeModal } from '../src/components/ui/Phase2NoticeModal';

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);
  const loadSettings = useSettingsStore((s) => s.loadSettings);

  useEffect(() => {
    let isMounted = true;

    async function initApp() {
      try {
        await getDatabase();
        await loadSettings();
        if (isMounted) {
          setIsDbReady(true);
        }
      } catch (error) {
        console.error('[RootLayout] Startup initialization failed:', error);
        if (isMounted) {
          // Still allow app to render with fallback state
          setIsDbReady(true);
        }
      }
    }

    initApp();

    return () => {
      isMounted = false;
    };
  }, [loadSettings]);

  if (!isDbReady) {
    return (
      <SafeAreaProvider>
        <AppLoadingState message="Initializing GullyScore database..." />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="match/create" />
        <Stack.Screen name="match/players" />
        <Stack.Screen name="match/[id]/live" />
        <Stack.Screen name="match/[id]/scorecard" />
        <Stack.Screen name="match/[id]/innings-break" />
        <Stack.Screen name="match/[id]/result" />
        <Stack.Screen name="settings" />
      </Stack>
      <Phase2NoticeModal />
    </SafeAreaProvider>
  );
}
