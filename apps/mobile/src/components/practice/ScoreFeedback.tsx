import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';

type ScoreFeedbackProps = {
  score: number;
  shortFeedbackVi: string;
  grammarFeedbackVi: string;
  vocabularyFeedbackVi: string;
  improvedAnswerZh: string;
  improvedAnswerPinyin: string;
  improvedAnswerVi: string;
  suggestionVi: string;
};

export function ScoreFeedback({
  score,
  shortFeedbackVi,
  grammarFeedbackVi,
  vocabularyFeedbackVi,
  improvedAnswerZh,
  improvedAnswerPinyin,
  improvedAnswerVi,
  suggestionVi,
}: ScoreFeedbackProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.score}>Điểm phản xạ: {score}/10</Text>
      <Text style={styles.feedback}>Nhận xét: {shortFeedbackVi}</Text>
      <Text style={styles.feedback}>Ngữ pháp: {grammarFeedbackVi}</Text>
      <Text style={styles.feedback}>Từ vựng: {vocabularyFeedbackVi}</Text>
      <Text style={styles.feedback}>Gợi ý: {suggestionVi}</Text>
      {improvedAnswerZh ? (
        <Text style={styles.feedback}>Câu tốt hơn: {improvedAnswerZh}</Text>
      ) : null}
      {improvedAnswerPinyin ? (
        <Text style={styles.feedback}>Pinyin: {improvedAnswerPinyin}</Text>
      ) : null}
      {improvedAnswerVi ? (
        <Text style={styles.feedback}>Nghĩa: {improvedAnswerVi}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(245, 200, 75, 0.35)',
    backgroundColor: 'rgba(245, 200, 75, 0.08)',
    padding: 16,
  },
  score: {
    color: COLORS.yellow,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  feedback: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
});
