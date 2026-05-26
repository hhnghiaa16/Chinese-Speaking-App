import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

type StatCardProps = {
  value: string;
  label: string;
  icon?: string;
};

export function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <View style={styles.card}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : <View />}
      <View>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 118,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(11, 8, 36, 0.92)',
    padding: 18,
    justifyContent: 'space-between',
  },
  icon: {
    color: COLORS.yellow,
    fontSize: 18,
  },
  value: {
    color: COLORS.textPrimary,
    fontSize: 26,
    lineHeight: 32,
    fontFamily: serifFont,
    fontWeight: '700',
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});
