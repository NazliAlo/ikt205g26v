import { useAuthContext } from '@/hooks/auth-context';
import AuthProvider from '@/providers/auth-provider';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export { ErrorBoundary } from 'expo-router';

// Prevent splash from hiding automatically
SplashScreen.preventAutoHideAsync();


// 🔥 This controls which screens are visible based on auth
function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuthContext();

  // While auth is initializing → show nothing
  if (isLoading) return null;

  return (
    <Stack>
      {/* Logged in screens */}
      <Stack.Protected guard={isLoggedIn === true}>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="noteDetailScreen"
          options={{ headerShown: false }}
        />
      </Stack.Protected>

      {/* Not logged in screens */}
      <Stack.Protected guard={isLoggedIn === false}>
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />
      </Stack.Protected>

      <Stack.Screen name="+not-found" />
    </Stack>
  );
}


// 🔥 This loads fonts + handles splash screen
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}


// 🔥 This wraps the entire app properly
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <KeyboardProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </KeyboardProvider>
  );
}
