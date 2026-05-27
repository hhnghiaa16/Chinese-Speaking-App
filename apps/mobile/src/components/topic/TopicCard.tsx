import { Pressable, StyleSheet, Text } from 'react-native';

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
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.titleZh}>{titleZh}</Text>
      <Text style={styles.titleVi}>{titleVi}</Text>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 154,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(11, 8, 36, 0.92)',
    padding: 24,
    marginBottom: 14,
    justifyContent: 'center',
  },
  cardPressed: {
    opacity: 0.85,
  },
  emoji: {
    fontSize: 25,
    marginBottom: 18,
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
