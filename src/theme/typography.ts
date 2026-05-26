import { Platform } from 'react-native';

export const serifFont =
  Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'serif',
  }) ?? 'serif';
