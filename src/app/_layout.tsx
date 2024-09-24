import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack, useNavigationContainerRef } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { APIProvider } from '@/api';
import { loadSelectedTheme } from '@/core';
import { useThemeConfig } from '@/core/use-theme-config';

export { ErrorBoundary } from 'expo-router';

// Import  global CSS file
import '../../global.css';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@/redux/store';
import React from 'react';
import { Provider } from 'react-redux';

export const unstable_settings = {
  initialRouteName: '(app)',
};

loadSelectedTheme();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Providers>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#660101',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="take-attendence" options={{ headerShown: true }} />
        <Stack.Screen name="record-video" options={{ headerShown: true }} />
        <Stack.Screen name="session-details" options={{ headerShown: true }} />
        <Stack.Screen name="team-season" options={{ headerShown: true }} />
        <Stack.Screen name="create-session" options={{ headerShown: true }} />
        <Stack.Screen
          name="create-personal-task"
          options={{ headerShown: true }}
        />

        <Stack.Screen
          name="record-pacer-score"
          options={{ headerShown: true }}
        />
      </Stack>
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  return (
    <Provider store={store}>
      <PersistGate
        loading={<ActivityIndicator size="large" color="#007AFF" />}
        persistor={persistor}
      >
        <GestureHandlerRootView
          style={styles.container}
          className={theme.dark ? `dark` : undefined}
        >
          <ThemeProvider value={theme}>
            <APIProvider>
              <BottomSheetModalProvider>
                {children}
                <FlashMessage position="top" />
              </BottomSheetModalProvider>
            </APIProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
