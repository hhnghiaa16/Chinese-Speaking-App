import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

type RecommendationCardProps = {
  topicVi: string;
  level: string;
};

export function RecommendationCard({ topicVi, level }: RecommendationCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>💡</Text>
      <Text style={styles.title}>Gợi ý tiếp theo</Text>
      <Text style={styles.description}>
        Bạn nên tiếp tục {level} - {topicVi} để phản xạ ổn định hơn trước khi chuyển sang chủ
        đề mới.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 200, 75, 0.25)',
    backgroundColor: 'rgba(245, 200, 75, 0.07)',
    padding: 22,
    marginBottom: 22,
  },
  icon: {
    fontSize: 20,
    marginBottom: 14,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 20,
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
