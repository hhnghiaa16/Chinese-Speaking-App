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
      <Text style={styles.stepLabel}>{stepText}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 36,
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
