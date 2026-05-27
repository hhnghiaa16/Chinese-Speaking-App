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
}: PracticeQuestionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.questionRow}>
        <Text style={styles.questionZh}>{questionZh}</Text>
        <Pressable style={styles.speakerButton} onPress={onSpeakQuestion}>
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
    borderColor: COLORS.cardBorder,
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
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(5, 3, 22, 0.25)',
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
