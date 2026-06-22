import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

type LevelCardProps = {
  number: number;
  title: string;
  subtitle: string;
  vocabCount: string;
  questionCount: number;
  available: boolean;
  onPress: () => void;
};

export function LevelCard({
  number,
  title,
  subtitle,
  vocabCount,
  questionCount,
  available,
  onPress,
}: LevelCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed, !available && styles.cardDisabled]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <Text style={styles.number}>{number}</Text>
        <Text style={styles.arrow}>↗</Text>
      </View>

      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.pillContainer}>
          <View style={styles.vocabPill}>
            <Text style={styles.vocabText}>{vocabCount}</Text>
          </View>
          <View style={[styles.vocabPill, !available && styles.emptyPill]}>
            <Text style={[styles.vocabText, !available && styles.emptyText]}>
              {available ? `${questionCount} câu hỏi` : 'Chưa có câu hỏi'}
            </Text>
          </View>
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
  cardDisabled: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(11, 8, 36, 0.4)',
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
  pillContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  vocabPill: {
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  vocabText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  emptyPill: {
    borderColor: 'rgba(255, 75, 75, 0.3)',
    backgroundColor: 'rgba(255, 75, 75, 0.1)',
  },
  emptyText: {
    color: '#FF4B4B',
  },
});
