import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';

type HSKProgressItemProps = {
  level: string;
  percent: number;
  practicedQuestions: number;
  totalQuestions: number;
};

export function HSKProgressItem({
  level,
  percent,
  practicedQuestions,
  totalQuestions,
}: HSKProgressItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.level}>{level}</Text>
        <Text style={styles.percent}>{percent}%</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>

      <Text style={styles.subText}>
        {practicedQuestions} / {totalQuestions} câu
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  level: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  percent: {
    color: COLORS.yellow,
    fontSize: 13,
    fontWeight: '700',
  },
  track: {
    height: 6,
    backgroundColor: '#15112E',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    backgroundColor: COLORS.yellow,
    borderRadius: 999,
  },
  subText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 6,
  },
});
