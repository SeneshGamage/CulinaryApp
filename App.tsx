import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { runSeedImportIfNeeded } from './src/db/seed';
import { restoreSession } from './src/services/auth';
import { useAppStore } from './src/store/useAppStore';
import { colors } from './src/theme/colors';

export default function App() {
  const [ready, setReady] = useState(false);
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);
  const setRole = useAppStore((s) => s.setRole);

  useEffect(() => {
    async function bootstrap() {
      await runSeedImportIfNeeded().catch((err) => console.error('Seed import failed:', err));

      // Reads the cached profile from SecureStore. No network call, so it works offline.
      const cachedUser = await restoreSession().catch(() => null);
      if (cachedUser) {
        setRole(cachedUser.role);
        setAuthenticated(true);
      }

      setReady(true);
    }
    bootstrap();
  }, [setAuthenticated, setRole]);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.white,
        }}
      >
        <ActivityIndicator color={colors.orange} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
