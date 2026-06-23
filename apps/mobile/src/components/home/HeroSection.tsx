import { StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '../common/AnimatedPressable';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

type HeroSectionProps = {};

export function HeroSection({}: HeroSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>✨ AI chấm điểm theo HSK · Tiếng Việt</Text>
      </View>

      <View>
        <Text style={styles.titlePrimary}>Mở miệng,</Text>
        <Text style={styles.titleChinese}>说中文</Text>
        <Text style={styles.titleItalic}>không ngập</Text>
        <Text style={styles.titleItalic}>ngừng.</Text>
      </View>

      <Text style={styles.description}>
        Phòng luyện phản xạ hỏi–đáp tiếng Trung. Trả lời bằng giọng nói, được chấm điểm và gợi ý cải thiện ngay lập tức.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 36,
    alignItems: 'center',
  },
  badge: {
    borderWidth: 1,
    borderColor: '#2A2453',
    backgroundColor: 'rgba(12, 8, 40, 0.9)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
  },
  badgeText: {
    color: '#BDB5E4',
    fontSize: 11,
  },
  titlePrimary: {
    color: COLORS.textPrimary,
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '700',
    fontFamily: serifFont,
    textAlign: 'center',
  },
  titleChinese: {
    color: COLORS.yellow,
    fontSize: 38,
    lineHeight: 42,
    fontFamily: serifFont,
    fontWeight: '500',
    textAlign: 'center',
  },
  titleItalic: {
    color: '#A9A0D6',
    fontSize: 38,
    lineHeight: 40,
    fontFamily: serifFont,
    fontStyle: 'italic',
    fontWeight: '500',
    textAlign: 'center',
  },
  description: {
    marginTop: 20,
    color: '#C6BFE6',
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 290,
    textAlign: 'center',
  },
});
