import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

type LevelCardProps = {
  number: number;
  title: string;
  subtitle: string;
  vocabCount: string;
  onPress: () => void;
};

export function LevelCard({
  number,
  title,
  subtitle,
  vocabCount,
  onPress,
}: LevelCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <Text style={styles.number}>{number}</Text>
        <Text style={styles.arrow}>↗</Text>
      </View>

      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.vocabPill}>
          <Text style={styles.vocabText}>{vocabCount}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 190,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(11, 8, 36, 0.92)',
    padding: 24,
    marginBottom: 14,
    justifyContent: 'space-between',
  },
  cardPressed: {
    opacity: 0.85,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  number: {
    color: COLORS.yellow,
    fontSize: 42,
    lineHeight: 48,
    fontFamily: serifFont,
    fontWeight: '400',
  },
  arrow: {
    color: COLORS.textSecondary,
    fontSize: 18,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 24,
    lineHeight: 30,
    fontFamily: serifFont,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  vocabPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 18,
  },
  vocabText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
});
