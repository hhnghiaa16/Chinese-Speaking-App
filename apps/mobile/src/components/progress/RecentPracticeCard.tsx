import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

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
  return (
    <View style={styles.card}>
      <Text style={styles.title}>LUYỆN GẦN ĐÂY</Text>
      <Text style={styles.main}>
        {level} · {topicEmoji} {topicVi}
      </Text>
      <Text style={styles.sub}>
        {questions} câu · {score.toFixed(1)}/10
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(11, 8, 36, 0.88)',
    padding: 22,
    marginBottom: 18,
  },
  title: {
    color: COLORS.yellow,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  main: {
    color: COLORS.textPrimary,
    fontSize: 21,
    fontFamily: serifFont,
    fontWeight: '700',
    marginBottom: 8,
  },
  sub: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
});
