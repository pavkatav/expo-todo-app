import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useCurrentTheme, useThemeStore } from '@/app/theme/theme';
import { initializeTodoStore } from '@/store/useTodoStore';
import RootNavigator from '@/app/navigation/RootNavigator';

function AppContent() {
  const theme = useCurrentTheme();
  const { themeMode } = useThemeStore();

  const statusBarStyle =
    themeMode === 'dark' || (themeMode === 'system' && theme.dark)
      ? 'light'
      : 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <StatusBar style={statusBarStyle} />
            <RootNavigator />
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  const { initialize: initializeTheme } = useThemeStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await Promise.all([initializeTheme(), initializeTodoStore()]);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, [initializeTheme]);

  return <AppContent />;
}
