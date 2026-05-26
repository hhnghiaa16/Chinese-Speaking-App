import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

type TopicIntroProps = {
  level: string;
};

export function TopicIntro({ level }: TopicIntroProps) {
  const displayLevel = level.replace('HSK', 'HSK ');

  return (
    <View style={styles.container}>
      <Text style={styles.stepLabel}>BƯỚC 2 / 2 · {displayLevel}</Text>
      <Text style={styles.title}>Chọn chủ đề giao{'\n'}tiếp</Text>
      <Text style={styles.description}>
        Mỗi phần gồm các câu hỏi quay vòng — bạn có thể luyện đi luyện lại đến khi phản xạ tự
        nhiên.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 34,
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
