import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme, ActivityIndicator, View, StyleSheet } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AuthProvider, useAuth } from '@/context/auth-context';

function InnerLayout() {
  const colorScheme = useColorScheme();
  const { loading } = useAuth();

  if (loading) {
    const isDark = colorScheme === 'dark';
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}>
        <ActivityIndicator size="large" color={isDark ? '#ffffff' : '#000000'} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

export default function TabLayout() {
  return (
    <AuthProvider>
      <InnerLayout />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
