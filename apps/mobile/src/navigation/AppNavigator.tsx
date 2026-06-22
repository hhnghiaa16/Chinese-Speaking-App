import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AiConversationScreen } from '../screens/AiConversationScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LevelScreen } from '../screens/LevelScreen';
import { ModeSelectScreen } from '../screens/ModeSelectScreen';
import { PracticeScreen } from '../screens/PracticeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { TopicScreen } from '../screens/TopicScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#050316',
  },
};

import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../services/auth/AuthContext';
import { AuthScreen } from '../screens/AuthScreen';

export function AppNavigator() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#050316', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#F5C84B" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#050316' },
          animation: 'fade',
        }}
      >
        {!session ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Level" component={LevelScreen} />
            <Stack.Screen name="Progress" component={ProgressScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Topic" component={TopicScreen} />
            <Stack.Screen name="ModeSelect" component={ModeSelectScreen} />
            <Stack.Screen name="Practice" component={PracticeScreen} />
            <Stack.Screen name="AiConversation" component={AiConversationScreen} />
            <Stack.Screen name="Result" component={ResultScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

