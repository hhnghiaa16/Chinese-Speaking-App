import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';

type ResultActionsProps = {
  onRetry: () => void;
  onChangeTopic: () => void;
  onHome: () => void;
};

export function ResultActions({ onRetry, onChangeTopic, onHome }: ResultActionsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.buttonBase, styles.primaryButton, pressed && styles.pressed]}
        onPress={onRetry}
      >
        <Text style={styles.primaryText}>Luyện lại chủ đề này</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.buttonBase, styles.secondaryButton, pressed && styles.pressed]}
        onPress={onChangeTopic}
      >
        <Text style={styles.secondaryText}>Chọn chủ đề khác</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.buttonBase, styles.outlineButton, pressed && styles.pressed]}
        onPress={onHome}
      >
        <Text style={styles.outlineText}>Về trang chủ</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginBottom: 20,
  },
  buttonBase: {
    borderRadius: 999,
    paddingVertical: 15,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  primaryButton: {
    backgroundColor: COLORS.yellow,
    borderColor: 'rgba(245, 200, 75, 0.6)',
    shadowColor: COLORS.yellow,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  primaryText: {
    color: '#1A1233',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: COLORS.purple,
    borderColor: 'rgba(109, 74, 255, 0.6)',
    shadowColor: COLORS.purpleLight,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  secondaryText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  outlineButton: {
    borderColor: 'rgba(168, 160, 200, 0.35)',
    backgroundColor: 'rgba(5, 3, 22, 0.35)',
  },
  outlineText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
});
