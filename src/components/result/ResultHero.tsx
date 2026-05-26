import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

type ResultHeroProps = {
  level: string;
  topicEmoji: string;
  topicVi: string;
};

export function ResultHero({ level, topicEmoji, topicVi }: ResultHeroProps) {
  const displayLevel = level.replace('HSK', 'HSK ');

  return (
    <View style={styles.container}>
      <Text style={styles.stepLabel}>HOÀN THÀNH</Text>
      <Text style={styles.title}>Bạn đã hoàn thành{'\n'}phiên luyện</Text>

      <View style={styles.topicPill}>
        <Text style={styles.topicPillText}>
          {displayLevel} · {topicEmoji} {topicVi.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
  },
  stepLabel: {
    color: COLORS.yellow,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 12,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 35,
    lineHeight: 39,
    fontFamily: serifFont,
    fontWeight: '700',
  },
  topicPill: {
    alignSelf: 'flex-start',
    marginTop: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(11, 8, 36, 0.7)',
  },
  topicPillText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '700',
  },
});
