import { setAudioModeAsync } from 'expo-audio';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/services/auth/AuthContext';
import { COLORS } from './src/theme/colors';

export default function App() {
  useEffect(() => {
    setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
      shouldRouteThroughEarpiece: false,
    }).catch(console.warn);
  }, []);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />
    </SafeAreaProvider>
  );
}
