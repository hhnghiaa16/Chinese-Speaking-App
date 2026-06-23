import { LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '../common/AnimatedPressable';
import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

type FeatureCardProps = {
  IconComponent: LucideIcon;
  title: string;
  description: string;
  fullWidth?: boolean;
};

export function FeatureCard({ IconComponent, title, description, fullWidth = false }: FeatureCardProps) {
  return (
    <AnimatedPressable style={[styles.card, fullWidth && styles.cardFullWidth]}>
      <View style={styles.iconWrap}>
        <IconComponent color={COLORS.yellow} size={20} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '46%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.28)',
    backgroundColor: 'rgba(11, 8, 36, 0.88)',
    padding: 20,
  },
  cardFullWidth: {
    minWidth: '100%',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 200, 75, 0.25)',
    backgroundColor: 'rgba(245, 200, 75, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: serifFont,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});
