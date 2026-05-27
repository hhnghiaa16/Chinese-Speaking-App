import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';

type ScoreFeedbackProps = {
  score: number;
};

export function ScoreFeedback({ score }: ScoreFeedbackProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.score}>Điểm phản xạ: {score}/10</Text>
      <Text style={styles.feedback}>
        Nhận xét: Bạn trả lời đúng ý. Hãy luyện thêm để nói tự nhiên hơn.
      </Text>
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
  },
});
