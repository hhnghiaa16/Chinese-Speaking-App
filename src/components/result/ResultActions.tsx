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
      <Pressable style={[styles.buttonBase, styles.primaryButton]} onPress={onRetry}>
        <Text style={styles.primaryText}>Luyện lại chủ đề này</Text>
      </Pressable>

      <Pressable style={[styles.buttonBase, styles.secondaryButton]} onPress={onChangeTopic}>
        <Text style={styles.secondaryText}>Chọn chủ đề khác</Text>
      </Pressable>

      <Pressable style={[styles.buttonBase, styles.outlineButton]} onPress={onHome}>
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
  },
  primaryButton: {
    backgroundColor: COLORS.yellow,
  },
  primaryText: {
    color: '#1A1233',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: COLORS.purple,
  },
  secondaryText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(5, 3, 22, 0.35)',
  },
  outlineText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
});
