import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpenText, MessageCircle } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeHeader } from '../components/home/HomeHeader';
import { COLORS } from '../theme/colors';
import { serifFont } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ModeSelect'>;

export function ModeSelectScreen({ navigation, route }: Props) {
  const { level, topic, topicVi, topicEmoji } = route.params;

  const displayLevel = level.replace('HSK', 'HSK ');

  const handleBankMode = () => {
    navigation.navigate('Practice', { level, topic });
  };

  const handleAiMode = () => {
    navigation.navigate('AiConversation', { level, topic, topicVi, topicEmoji });
  };

  return (
    <LinearGradient colors={['#050316', '#08051F', '#050316']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <HomeHeader activeTab="practice" />

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.eyebrow}>CHỌN CHẾ ĐỘ</Text>
          <Text style={styles.title}>Bạn muốn luyện{'\n'}theo cách nào?</Text>
        </View>

        {/* Mode Cards */}
        <View style={styles.cardsSection}>
          {/* Bank Mode */}
          <Pressable
            style={({ pressed }) => [styles.card, styles.cardBank, pressed && styles.cardPressed]}
            onPress={handleBankMode}
          >
            <View style={styles.cardIconWrap}>
              <BookOpenText color={COLORS.textSecondary} size={24} strokeWidth={1.6} />
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Luyện đề</Text>
              <Text style={styles.cardSubtitle}>
                Câu hỏi từ ngân hàng đề theo chủ đề và trình độ
              </Text>
            </View>

            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>Ngân hàng đề</Text>
            </View>
          </Pressable>

          {/* AI Mode */}
          <Pressable
            style={({ pressed }) => [styles.card, styles.cardAi, pressed && styles.cardPressed]}
            onPress={handleAiMode}
          >
            <View style={styles.cardIconWrapAi}>
              <MessageCircle color={COLORS.purpleLight} size={24} strokeWidth={1.6} />
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Hội thoại AI</Text>
              <Text style={styles.cardSubtitle}>
                AI đặt câu hỏi ngẫu nhiên, bạn trả lời bằng giọng nói hoặc text
              </Text>
            </View>

            <View style={styles.cardBadgeAi}>
              <Text style={styles.cardBadgeTextAi}>5 câu · AI sinh tự động</Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  glowOne: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(76, 29, 149, 0.18)',
    top: 120,
    left: -140,
  },
  glowTwo: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(109, 74, 255, 0.1)',
    top: 480,
    right: -120,
  },
  titleSection: {
    paddingHorizontal: 22,
    paddingTop: 36,
    paddingBottom: 12,
  },
  eyebrow: {
    color: COLORS.yellow,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    marginBottom: 12,
  },
  title: {
    color: COLORS.textPrimary,
    fontFamily: serifFont,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 42,
  },
  cardsSection: {
    paddingHorizontal: 18,
    paddingTop: 28,
    gap: 16,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    gap: 16,
  },
  cardBank: {
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(11, 8, 36, 0.85)',
  },
  cardAi: {
    borderColor: 'rgba(109, 74, 255, 0.45)',
    backgroundColor: 'rgba(45, 10, 145, 0.15)',
  },
  cardPressed: {
    opacity: 0.78,
  },
  cardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(5, 3, 22, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconWrapAi: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.35)',
    backgroundColor: 'rgba(45, 10, 145, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    gap: 6,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: serifFont,
  },
  cardSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(5, 3, 22, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  cardBadgeText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  cardBadgeAi: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.4)',
    backgroundColor: 'rgba(109, 74, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  cardBadgeTextAi: {
    color: COLORS.purpleLight,
    fontSize: 11,
    fontWeight: '600',
  },
});
