import { BarChart2 } from 'lucide-react-native';
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
        <View style={styles.iconWrap}>
          <BarChart2 color={COLORS.purpleLight} size={16} strokeWidth={1.8} />
        </View>
        <Text style={styles.title}>Tổng kết phiên luyện</Text>
      </View>

      <Text style={styles.mainStat}>
        {answeredQuestions} / {totalQuestions} câu đã luyện
      </Text>
      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <Text style={styles.metaChipText}>{displayLevel}</Text>
        </View>
        <View style={styles.metaChip}>
          <Text style={styles.metaChipText}>{topicVi}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.3)',
    backgroundColor: 'rgba(11, 8, 36, 0.92)',
    padding: 22,
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(109, 74, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  metaChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.3)',
    backgroundColor: 'rgba(33, 26, 70, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  metaChipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
});
