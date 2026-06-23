import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';

type HSKProgressItemProps = {
  level: string;
  percent: number;
  practicedQuestions: number;
  totalQuestions: number;
};

// Tất cả thanh đều vàng; 100% → xanh lá
function getBarColor(percent: number): string {
  return percent >= 100 ? '#34D399' : COLORS.yellow;
}

export function HSKProgressItem({
  level,
  percent,
  practicedQuestions,
  totalQuestions,
}: HSKProgressItemProps) {
  const barColor = getBarColor(percent);
  const isComplete = percent >= 100;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.levelRow}>
          <View style={[styles.dot, { backgroundColor: barColor }]} />
          <Text style={styles.level}>{level}</Text>
          {isComplete ? (
            <View style={styles.completeBadge}>
              <Text style={styles.completeBadgeText}>✓ Hoàn thành</Text>
            </View>
          ) : null}
        </View>
        <Text style={[styles.percent, { color: barColor }]}>{percent}%</Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${Math.min(percent, 100)}%`, backgroundColor: barColor },
          ]}
        />
      </View>

      <Text style={styles.subText}>
        {practicedQuestions} / {totalQuestions} câu đã luyện
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  level: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  completeBadge: {
    borderRadius: 999,
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  completeBadgeText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '700',
  },
  percent: {
    fontSize: 13,
    fontWeight: '700',
  },
  track: {
    height: 7,
    backgroundColor: '#15112E',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: 7,
    borderRadius: 999,
  },
  subText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 7,
  },
});
