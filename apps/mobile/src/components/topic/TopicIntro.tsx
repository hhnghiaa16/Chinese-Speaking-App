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
      <View style={styles.stepBadge}>
        <Text style={styles.stepLabel}>BƯỚC 2 / 2 · {displayLevel}</Text>
      </View>
      <Text style={styles.title}>{'Chọn chủ đề giao\ntiếp'}</Text>
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
  stepBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245, 200, 75, 0.32)',
    backgroundColor: 'rgba(245, 200, 75, 0.07)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 18,
  },
  stepLabel: {
    color: COLORS.yellow,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
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
