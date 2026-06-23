import { Volume2 } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';
import { SampleAnswerBox } from './SampleAnswerBox';

type PracticeQuestionCardProps = {
  questionZh: string;
  pinyin: string;
  meaningVi: string;
  sampleAnswerZh: string;
  sampleAnswerPinyin: string;
  sampleAnswerVi: string;
  onSpeakQuestion: () => void;
  onSpeakSample?: () => void;
  showSample?: boolean;
  isSpeakingQuestion?: boolean;
  isSpeakingSample?: boolean;
};

export function PracticeQuestionCard({
  questionZh,
  pinyin,
  meaningVi,
  sampleAnswerZh,
  sampleAnswerPinyin,
  sampleAnswerVi,
  onSpeakQuestion,
  onSpeakSample,
  showSample,
  isSpeakingQuestion,
  isSpeakingSample,
}: PracticeQuestionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.questionRow}>
        <Text style={styles.questionZh}>{questionZh}</Text>
        <Pressable
          style={[styles.speakerButton, isSpeakingQuestion ? styles.disabledButton : null]}
          onPress={onSpeakQuestion}
          disabled={isSpeakingQuestion}
        >
          <Volume2 color={COLORS.textPrimary} size={16} strokeWidth={1.8} />
        </Pressable>
      </View>

      <Text style={styles.pinyin}>{pinyin}</Text>
      <Text style={styles.meaning}>{meaningVi}</Text>

      {showSample ? (
        <SampleAnswerBox
          answerZh={sampleAnswerZh}
          answerPinyin={sampleAnswerPinyin}
          answerVi={sampleAnswerVi}
          onSpeak={onSpeakSample}
          isSpeaking={isSpeakingSample}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 28,
    marginHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.35)',
    backgroundColor: 'rgba(11, 8, 36, 0.92)',
    padding: 26,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  questionZh: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 34,
    lineHeight: 42,
    fontFamily: serifFont,
    fontWeight: '700',
    paddingRight: 14,
  },
  speakerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 10, 145, 0.2)',
  },
  disabledButton: {
    opacity: 0.45,
  },
  pinyin: {
    marginTop: 18,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  meaning: {
    marginTop: 6,
    color: COLORS.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },
});
