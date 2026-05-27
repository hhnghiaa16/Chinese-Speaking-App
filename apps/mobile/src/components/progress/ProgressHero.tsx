import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

export function ProgressHero() {
  return (
    <View style={styles.container}>
      <Text style={styles.stepLabel}>TIẾN ĐỘ HỌC TẬP</Text>
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
  stepLabel: {
    color: COLORS.yellow,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 12,
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
