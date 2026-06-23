import { Activity, BookOpen, Flame, Star } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

type StatCardProps = {
  value: string;
  label: string;
  icon: 'sessions' | 'score' | 'questions' | 'streak';
};

const ICON_CONFIG = {
  sessions: { component: Activity, color: '#A78BFA' },   // violet — nổi bật hơn
  score: { component: Star, color: COLORS.yellow },
  questions: { component: BookOpen, color: '#5BBFDE' },
  streak: { component: Flame, color: '#F97373' },
};

export function StatCard({ value, label, icon }: StatCardProps) {
  const { component: IconComponent, color } = ICON_CONFIG[icon];

  return (
    <View style={[styles.card, { borderColor: `${color}30` }]}>
      <View style={[styles.iconWrap, { backgroundColor: `${color}18` }]}>
        <IconComponent color={color} size={18} strokeWidth={1.8} />
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 120,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(11, 8, 36, 0.92)',
    padding: 16,
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  value: {
    fontSize: 26,
    lineHeight: 30,
    fontFamily: serifFont,
    fontWeight: '700',
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
  },
});
