import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

type ScoreSummaryCardProps = {
  score: number;
};

export function ScoreSummaryCard({ score }: ScoreSummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>✨</Text>
      <Text style={styles.scoreValue}>{score.toFixed(1)}/10</Text>
      <Text style={styles.label}>Điểm phản xạ trung bình</Text>
      <Text style={styles.subtext}>Kết quả tạm tính cho phiên luyện hiện tại.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(245, 200, 75, 0.35)',
    backgroundColor: 'rgba(245, 200, 75, 0.08)',
    padding: 24,
    marginBottom: 18,
  },
  icon: {
    color: COLORS.yellow,
    fontSize: 22,
    marginBottom: 16,
  },
  scoreValue: {
    color: COLORS.yellow,
    fontSize: 48,
    lineHeight: 56,
    fontFamily: serifFont,
    fontWeight: '700',
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 4,
  },
  subtext: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
});
