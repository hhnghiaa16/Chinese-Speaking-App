import { BarChart2 } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';
import { HSKProgressItem } from './HSKProgressItem';

type HSKProgressSectionProps = {
  items: {
    level: string;
    percent: number;
    practicedQuestions: number;
    totalQuestions: number;
  }[];
};

export function HSKProgressSection({ items }: HSKProgressSectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <BarChart2 color={COLORS.purpleLight} size={16} strokeWidth={1.8} />
        </View>
        <View>
          <Text style={styles.title}>Tiến trình HSK</Text>
          <Text style={styles.description}>Theo dõi mức độ hoàn thành từng cấp.</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {items.map((item) => (
        <HSKProgressItem
          key={item.level}
          level={item.level}
          percent={item.percent}
          practicedQuestions={item.practicedQuestions}
          totalQuestions={item.totalQuestions}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(11, 8, 36, 0.92)',
    padding: 22,
    marginBottom: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(109, 74, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: serifFont,
    fontWeight: '700',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(33, 26, 70, 0.8)',
    marginBottom: 18,
  },
});
