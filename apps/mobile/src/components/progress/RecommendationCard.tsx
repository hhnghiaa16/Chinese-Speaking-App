import { Lightbulb } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

type RecommendationCardProps = {
  topicVi: string;
  level: string;
  suggestionVi?: string | null;
};

export function RecommendationCard({ topicVi, level, suggestionVi }: RecommendationCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Lightbulb color={COLORS.yellow} size={16} strokeWidth={1.8} />
        </View>
        <Text style={styles.label}>GỢI Ý TIẾP THEO</Text>
      </View>
      <Text style={styles.title}>Tiếp tục học gì?</Text>
      <Text style={styles.description}>
        {suggestionVi ||
          `Bạn nên tiếp tục ${level} - ${topicVi} để phản xạ ổn định hơn trước khi chuyển sang chủ đề mới.`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(245, 200, 75, 0.22)',
    backgroundColor: 'rgba(245, 200, 75, 0.05)',
    padding: 22,
    marginBottom: 22,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 200, 75, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: COLORS.yellow,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
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
