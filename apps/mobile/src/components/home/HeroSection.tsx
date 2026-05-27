import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

type HeroSectionProps = {
  onStartPress: () => void;
  onProgressPress?: () => void;
};

export function HeroSection({ onStartPress, onProgressPress }: HeroSectionProps) {
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
        Phòng luyện phản xạ hỏi–đáp tiếng Trung theo trình độ HSK 1 đến HSK 5.
        Nói, được chấm, được gợi ý cải thiện — ngay trong một nhịp thở.
      </Text>

      <Pressable style={styles.primaryButton} onPress={onStartPress}>
        <Text style={styles.primaryButtonText}>Bắt đầu luyện tập →</Text>
      </Pressable>

      <Pressable style={styles.progressLink} onPress={onProgressPress}>
        <Text style={styles.progressLinkText}>Xem tiến độ của tôi →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 58,
  },
  badge: {
    alignSelf: 'flex-start',
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
    fontSize: 46,
    lineHeight: 50,
    fontWeight: '700',
    fontFamily: serifFont,
  },
  titleChinese: {
    color: COLORS.yellow,
    fontSize: 42,
    lineHeight: 46,
    fontFamily: serifFont,
    fontWeight: '500',
  },
  titleItalic: {
    color: '#A9A0D6',
    fontSize: 42,
    lineHeight: 44,
    fontFamily: serifFont,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  description: {
    marginTop: 22,
    color: '#C6BFE6',
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 310,
  },
  primaryButton: {
    marginTop: 32,
    backgroundColor: COLORS.purple,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignSelf: 'flex-start',
    shadowColor: COLORS.purpleLight,
    shadowOpacity: 0.38,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  progressLink: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  progressLinkText: {
    color: '#B9B0E4',
    fontSize: 13,
  },
});
