import { Clock } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';
import { scoreColor } from '../../theme/scoreColor';

type RecentPracticeCardProps = {
  level: string;
  topicEmoji: string;
  topicVi: string;
  questions: number;
  score: number;
};

export function RecentPracticeCard({
  level,
  topicEmoji,
  topicVi,
  questions,
  score,
}: RecentPracticeCardProps) {
  const sc = scoreColor(score);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Clock color={COLORS.purpleLight} size={16} strokeWidth={1.8} />
        </View>
        <Text style={styles.title}>LUYỆN GẦN ĐÂY</Text>
      </View>

      <Text style={styles.main}>
        {topicEmoji} {topicVi}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <Text style={styles.metaChipText}>{level}</Text>
        </View>
        <View style={styles.metaChip}>
          <Text style={styles.metaChipText}>{questions} câu</Text>
        </View>
        <View style={[styles.scoreChip, { borderColor: `${sc}44`, backgroundColor: `${sc}14` }]}>
          <Text style={[styles.scoreText, { color: sc }]}>{score.toFixed(1)}/10</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.25)',
    backgroundColor: 'rgba(11, 8, 36, 0.92)',
    padding: 22,
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(109, 74, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  main: {
    color: COLORS.textPrimary,
    fontSize: 22,
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
  scoreChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
