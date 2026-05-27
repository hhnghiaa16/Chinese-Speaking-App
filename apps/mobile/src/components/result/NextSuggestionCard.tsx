import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

export function NextSuggestionCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>💡</Text>
      <Text style={styles.title}>Gợi ý tiếp theo</Text>
      <Text style={styles.description}>
        Hãy luyện lại chủ đề này thêm 1–2 lần để phản xạ nhanh hơn trước khi chuyển sang chủ đề
        mới.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(11, 8, 36, 0.88)',
    padding: 22,
    marginBottom: 22,
  },
  icon: {
    color: COLORS.yellow,
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
