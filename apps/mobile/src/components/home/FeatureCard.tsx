import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
};

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(11, 8, 36, 0.88)',
    padding: 22,
  },
  icon: {
    color: COLORS.yellow,
    fontSize: 22,
    marginBottom: 22,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontFamily: serifFont,
    fontWeight: '700',
    marginBottom: 10,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});
