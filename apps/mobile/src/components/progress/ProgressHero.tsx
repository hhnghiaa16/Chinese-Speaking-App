import { TrendingUp } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

export function ProgressHero() {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <TrendingUp color={COLORS.yellow} size={13} strokeWidth={2} />
        <Text style={styles.badgeText}>TIẾN ĐỘ HỌC TẬP</Text>
      </View>
      <Text style={styles.title}>Theo dõi phản xạ{'\n'}tiếng Trung của bạn</Text>
      <Text style={styles.description}>
        Mỗi phiên luyện đều được ghi lại để bạn thấy mình đang tiến bộ thế nào.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245, 200, 75, 0.3)',
    backgroundColor: 'rgba(245, 200, 75, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 18,
  },
  badgeText: {
    color: COLORS.yellow,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 35,
    lineHeight: 39,
    fontFamily: serifFont,
    fontWeight: '700',
    marginBottom: 14,
  },
  description: {
    color: '#C6BFE6',
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 310,
  },
});
