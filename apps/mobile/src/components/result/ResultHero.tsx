import { Trophy } from 'lucide-react-native';
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
      <View style={styles.badge}>
        <Trophy color={COLORS.yellow} size={12} strokeWidth={2} />
        <Text style={styles.badgeText}>HOÀN THÀNH</Text>
      </View>
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
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245, 200, 75, 0.35)',
    backgroundColor: 'rgba(245, 200, 75, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 18,
  },
  badgeText: {
    color: COLORS.yellow,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
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
    borderColor: 'rgba(109, 74, 255, 0.4)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(45, 10, 145, 0.15)',
  },
  topicPillText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '700',
  },
});
