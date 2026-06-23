import { BookOpenText, Lightbulb, Mic, Sparkles } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '../common/AnimatedPressable';

import { COLORS } from '../../theme/colors';

type PracticeActionsProps = {
  hasScored: boolean;
  isGrading: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  isLastQuestion: boolean;
  hasRecording?: boolean;
  showSample?: boolean; // false = AI mode (no sample button)
  onRecord: () => void;
  onToggleHint: () => void;
  onToggleSample?: () => void;
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
  showSample = true,
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
        <View style={{ width: '100%' }}>
          <AnimatedPressable
            style={[styles.buttonBase, styles.mainButton]}
            onPress={isLastQuestion ? onResult : onNext}
          >
            <Text style={[styles.buttonText, styles.yellowText]}>
              {isLastQuestion ? 'Xem kết quả →' : 'Câu tiếp theo →'}
            </Text>
          </AnimatedPressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Row: secondary action buttons */}
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <AnimatedPressable
            style={[styles.buttonBase, styles.primaryPurple]}
            disabled={isTranscribing}
            onPress={onRecord}
          >
            <Mic color={COLORS.white} size={15} strokeWidth={1.8} />
            <Text style={[styles.buttonText, styles.primaryText]}>
              {isRecording ? 'Dừng ghi' : hasRecording ? 'Ghi lại' : 'Ghi âm'}
            </Text>
          </AnimatedPressable>
        </View>

        <View style={{ flex: 1 }}>
          <AnimatedPressable
            style={[styles.buttonBase, styles.outline]}
            onPress={onToggleHint}
          >
            <Lightbulb color={COLORS.textSecondary} size={15} strokeWidth={1.8} />
            <Text style={[styles.buttonText, styles.outlineText]}>Gợi ý</Text>
          </AnimatedPressable>
        </View>

        {showSample && onToggleSample ? (
          <View style={{ flex: 1 }}>
            <AnimatedPressable
              style={[styles.buttonBase, styles.outline]}
              onPress={onToggleSample}
            >
              <BookOpenText color={COLORS.textSecondary} size={15} strokeWidth={1.8} />
              <Text style={[styles.buttonText, styles.outlineText]}>Câu mẫu</Text>
            </AnimatedPressable>
          </View>
        ) : null}
      </View>

      {/* Score button: same width as row above */}
      <View style={{ width: '100%' }}>
        <AnimatedPressable
          style={[styles.buttonBase, styles.yellow, styles.scoreButton]}
          disabled={isGrading || isTranscribing}
          onPress={onScore}
        >
          <Sparkles color="#1A1233" size={16} strokeWidth={1.8} />
          <Text style={[styles.buttonText, styles.yellowText]}>
            {isGrading ? 'Đang chấm...' : 'Chấm điểm'}
          </Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    marginHorizontal: 18,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowBtn: {
    flex: 1,
  },
  buttonBase: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryPurple: {
    backgroundColor: COLORS.purple,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.7)',
  },
  outline: {
    borderWidth: 1,
    borderColor: 'rgba(168, 160, 200, 0.3)',
    backgroundColor: 'rgba(5, 3, 22, 0.3)',
  },
  yellow: {
    backgroundColor: COLORS.yellow,
    borderWidth: 1,
    borderColor: 'rgba(245, 200, 75, 0.6)',
    shadowColor: COLORS.yellow,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
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
