import { ArrowUpRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

type TopicCardProps = {
  emoji: string;
  titleZh: string;
  titleVi: string;
  description: string;
  onPress: () => void;
};

export function TopicCard({
  emoji,
  titleZh,
  titleVi,
  description,
  onPress,
}: TopicCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.arrowWrap}>
          <ArrowUpRight color={COLORS.yellow} size={14} strokeWidth={2} />
        </View>
      </View>
      <Text style={styles.titleZh}>{titleZh}</Text>
      <Text style={styles.titleVi}>{titleVi}</Text>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 154,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.35)',
    backgroundColor: 'rgba(11, 8, 36, 0.92)',
    padding: 22,
    marginBottom: 14,
  },
  cardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  emoji: {
    fontSize: 25,
  },
  arrowWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 200, 75, 0.3)',
    backgroundColor: 'rgba(245, 200, 75, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleZh: {
    color: COLORS.yellow,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: 2,
  },
  titleVi: {
    color: COLORS.textPrimary,
    fontSize: 21,
    lineHeight: 27,
    fontFamily: serifFont,
    fontWeight: '700',
    marginBottom: 10,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});
