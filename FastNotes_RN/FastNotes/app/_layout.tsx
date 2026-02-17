// app/_layout.tsx
import { useAuthContext } from '@/hooks/auth-context';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

export default function RootNavigator() {
  const colorScheme = useColorScheme();
  const { isLoggedIn, isLoading } = useAuthContext();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login';

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/login');
    } else if (isLoggedIn && inAuthGroup) {
      router.replace('/');
    }
  }, [isLoggedIn, isLoading]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="noteDetailScreen" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Screen name="+not-found" />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
