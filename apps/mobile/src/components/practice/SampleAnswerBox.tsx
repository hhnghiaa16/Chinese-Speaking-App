import { Volume2 } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';

type SampleAnswerBoxProps = {
  answerZh: string;
  answerPinyin: string;
  answerVi: string;
  onSpeak?: () => void;
  isSpeaking?: boolean;
};

export function SampleAnswerBox({
  answerZh,
  answerPinyin,
  answerVi,
  onSpeak,
  isSpeaking,
}: SampleAnswerBoxProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>CÂU TRẢ LỜI MẪU</Text>

      <View style={styles.answerRow}>
        <Text style={styles.answerZh}>{answerZh}</Text>
        <Pressable
          hitSlop={8}
          onPress={onSpeak}
          disabled={isSpeaking}
          style={isSpeaking ? styles.disabledButton : null}
        >
          <Volume2 color={COLORS.textSecondary} size={14} strokeWidth={1.8} />
        </Pressable>
      </View>

      <Text style={styles.answerPinyin}>{answerPinyin}</Text>
      <Text style={styles.answerVi}>{answerVi}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.3)',
    backgroundColor: 'rgba(5, 3, 22, 0.35)',
    padding: 16,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 9,
    letterSpacing: 1.4,
    fontWeight: '700',
    marginBottom: 10,
  },
  answerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  answerZh: {
    color: COLORS.textPrimary,
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '700',
    flex: 1,
  },
  answerPinyin: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  answerVi: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  disabledButton: {
    opacity: 0.45,
  },
});
