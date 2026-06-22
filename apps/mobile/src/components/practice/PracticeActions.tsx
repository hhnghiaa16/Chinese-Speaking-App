import { BookOpenText, Lightbulb, Mic, Sparkles } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';

type PracticeActionsProps = {
  hasScored: boolean;
  isGrading: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  isLastQuestion: boolean;
  hasRecording?: boolean;
  onRecord: () => void;
  onToggleHint: () => void;
  onToggleSample: () => void;
  onScore: () => void;
  onNext: () => void;
  onResult: () => void;
};

export function PracticeActions({
  hasScored,
  isGrading,
  isRecording,
  isTranscribing,
  isLastQuestion,
  hasRecording = false,
  onRecord,
  onToggleHint,
  onToggleSample,
  onScore,
  onNext,
  onResult,
}: PracticeActionsProps) {
  if (hasScored) {
    return (
      <View style={styles.container}>
        <Pressable
          style={[styles.buttonBase, styles.mainButton]}
          onPress={isLastQuestion ? onResult : onNext}
        >
          <Text style={[styles.buttonText, styles.yellowText]}>
            {isLastQuestion ? 'Xem kết quả →' : 'Câu tiếp theo →'}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.buttonBase, styles.primaryPurple]}
        disabled={isTranscribing}
        onPress={onRecord}
      >
        <Mic color={COLORS.white} size={15} strokeWidth={1.8} />
        <Text style={[styles.buttonText, styles.primaryText]}>
          {isRecording ? 'Dừng ghi' : hasRecording ? 'Ghi lại' : 'Ghi âm'}
        </Text>
      </Pressable>

      <Pressable style={[styles.buttonBase, styles.outline]} onPress={onToggleHint}>
        <Lightbulb color={COLORS.textSecondary} size={15} strokeWidth={1.8} />
        <Text style={[styles.buttonText, styles.outlineText]}>Gợi ý</Text>
      </Pressable>

      <Pressable style={[styles.buttonBase, styles.outline]} onPress={onToggleSample}>
        <BookOpenText color={COLORS.textSecondary} size={15} strokeWidth={1.8} />
        <Text style={[styles.buttonText, styles.outlineText]}>Câu mẫu</Text>
      </Pressable>

      <Pressable
        style={[styles.buttonBase, styles.yellow, styles.scoreButton]}
        disabled={isGrading || isTranscribing}
        onPress={onScore}
      >
        <Sparkles color="#1A1233" size={16} strokeWidth={1.8} />
        <Text style={[styles.buttonText, styles.yellowText]}>
          {isGrading ? 'Đang chấm...' : 'Chấm điểm'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    marginHorizontal: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  buttonBase: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryPurple: {
    backgroundColor: COLORS.purple,
  },
  outline: {
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(5, 3, 22, 0.3)',
  },
  yellow: {
    backgroundColor: COLORS.yellow,
  },
  scoreButton: {
    width: '100%',
    paddingVertical: 14,
  },
  mainButton: {
    flex: 1,
    minWidth: 200,
    backgroundColor: COLORS.yellow,
    paddingVertical: 14,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  primaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.textSecondary,
  },
  yellowText: {
    color: '#1A1233',
  },
});
