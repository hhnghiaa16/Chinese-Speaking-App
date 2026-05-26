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
      <Text style={styles.title}>Tiến trình HSK</Text>
      <Text style={styles.description}>Theo dõi mức độ hoàn thành câu hỏi ở từng cấp.</Text>

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
  title: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontFamily: serifFont,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
});
