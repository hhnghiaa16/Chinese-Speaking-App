import { ArrowUpRight } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedProgressCircle } from '../animations/AnimatedProgressCircle';
import { AnimatedPressable } from '../common/AnimatedPressable';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

type LevelCardProps = {
  number: number;
  title: string;
  subtitle: string;
  vocabCount: string;
  questionCount: number;
  available: boolean;
  progress?: number;
  onPress: () => void;
};

export function LevelCard({
  number,
  title,
  subtitle,
  vocabCount,
  questionCount,
  available,
  progress = 0,
  onPress,
}: LevelCardProps) {
  const radius = 32;
  const strokeWidth = 5;

  return (
    <AnimatedPressable
      style={[
        styles.card,
        !available && styles.cardDisabled,
      ]}
      onPress={onPress}
      disabled={!available}
    >
      <View style={styles.topRow}>
        <Text style={[styles.number, !available && styles.numberDisabled]}>{number}</Text>
        <View style={[styles.arrowWrap, !available && styles.arrowWrapDisabled]}>
          <ArrowUpRight
            color={available ? COLORS.yellow : COLORS.textMuted}
            size={16}
            strokeWidth={2}
          />
        </View>
      </View>

      <View>
        <Text style={[styles.title, !available && styles.titleDisabled]}>{title}</Text>
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

      {available && (
        <View style={styles.progressContainer}>
          <AnimatedProgressCircle progress={progress} radius={radius} strokeWidth={strokeWidth} />
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 190,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.35)',
    backgroundColor: 'rgba(11, 8, 36, 0.92)',
    padding: 24,
    marginBottom: 14,
    justifyContent: 'space-between',
  },
  cardDisabled: {
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
  numberDisabled: {
    color: COLORS.textMuted,
  },
  arrowWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 200, 75, 0.3)',
    backgroundColor: 'rgba(245, 200, 75, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowWrapDisabled: {
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    position: 'absolute',
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: serifFont,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 24,
    lineHeight: 30,
    fontFamily: serifFont,
    fontWeight: '700',
    marginBottom: 4,
  },
  titleDisabled: {
    color: COLORS.textMuted,
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
    borderColor: 'rgba(109, 74, 255, 0.3)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(33, 26, 70, 0.4)',
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
