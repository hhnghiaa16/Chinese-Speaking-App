import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

type PracticeStatsCardProps = {
  level: string;
  topicVi: string;
  answeredQuestions: number;
  totalQuestions: number;
};

export function PracticeStatsCard({
  level,
  topicVi,
  answeredQuestions,
  totalQuestions,
}: PracticeStatsCardProps) {
  const displayLevel = level.replace('HSK', 'HSK ');

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.icon}>◎</Text>
        <Text style={styles.title}>Tổng kết phiên luyện</Text>
      </View>

      <Text style={styles.mainStat}>
        {answeredQuestions} / {totalQuestions} câu đã luyện
      </Text>
      <Text style={styles.metaText}>Trình độ: {displayLevel}</Text>
      <Text style={styles.metaText}>Chủ đề: {topicVi}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(11, 8, 36, 0.92)',
    padding: 22,
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    color: COLORS.yellow,
    fontSize: 18,
    marginRight: 10,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontFamily: serifFont,
    fontWeight: '700',
  },
  mainStat: {
    color: COLORS.textPrimary,
    fontSize: 22,
    lineHeight: 28,
    fontFamily: serifFont,
    fontWeight: '700',
    marginBottom: 12,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});
