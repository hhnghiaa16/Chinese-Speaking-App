import { Lightbulb } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '../common/AnimatedPressable';

import { COLORS } from '../../theme/colors';

type PromptAssistRowProps = {
  status: string;
  showHint: boolean;
  onToggleHint: () => void;
};

export function PromptAssistRow({ status, showHint, onToggleHint }: PromptAssistRowProps) {
  return (
    <View style={styles.row}>
      <AnimatedPressable
        accessibilityLabel="Bật tắt gợi ý câu trả lời"
        activeScale={0.96}
        style={[styles.hintButton, showHint && styles.hintButtonActive]}
        onPress={onToggleHint}
      >
        <Lightbulb color={COLORS.yellow} size={14} strokeWidth={1.9} />
        <Text style={styles.hintText}>Gợi ý câu trả lời</Text>
      </AnimatedPressable>

      <Text numberOfLines={1} style={styles.status}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    maxWidth: 390,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  hintButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.52)',
    backgroundColor: 'rgba(17, 10, 48, 0.62)',
    paddingHorizontal: 13,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  hintButtonActive: {
    borderColor: 'rgba(245, 200, 75, 0.6)',
    backgroundColor: 'rgba(245, 200, 75, 0.1)',
  },
  hintText: {
    color: '#DCD5F7',
    fontSize: 12,
    fontWeight: '700',
  },
  status: {
    flex: 1,
    color: '#A79ACF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    textAlign: 'right',
  },
});
