import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

type LevelIntroProps = {
  stepText?: string;
  title?: string;
  description?: string;
};

export function LevelIntro({
  stepText = 'BƯỚC 1 / 2',
  title = 'Chọn trình độ của\nbạn',
  description = 'Mỗi trình độ tương ứng với mức từ vựng và độ phức tạp câu hỏi khác nhau.',
}: LevelIntroProps) {
  return (
    <View style={styles.container}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepLabel}>{stepText}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 36,
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
