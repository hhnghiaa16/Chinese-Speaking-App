import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Flame, Play, TrendingUp, User } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedPressable } from '../components/common/AnimatedPressable';
import { HeroSection } from '../components/home/HeroSection';
import { HomeHeader } from '../components/home/HomeHeader';
import { HSKLevel, TopicKey } from '../data/questions';
import { getProgressFromApi } from '../services/api/progressApi';
import { ProgressApiDto } from '../services/api/types';
import { COLORS } from '../theme/colors';
import { serifFont } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [progress, setProgress] = useState<ProgressApiDto | null>(null);
  const streakAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      getProgressFromApi()
        .then((data) => {
          setProgress(data);
          // Animate streak banner when data arrives
          Animated.spring(streakAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }).start();
        })
        .catch((e) => console.log('Failed to fetch progress:', e));
    }, [streakAnim])
  );

  return (
    <LinearGradient colors={['#050316', '#08051F', '#050316']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <HomeHeader
          showBackButton={false}
          onPracticePress={() => navigation.navigate('Level')}
          onProgressPress={() => navigation.navigate('Progress')}
          onProfilePress={() => navigation.navigate('Profile')}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <HeroSection />

          <View style={styles.dashboardSection}>
            {/* Resume Card (Tiếp tục học) */}
            {progress?.recentPractice?.topicKey ? (
              <View style={{ width: '100%' }}>
                <AnimatedPressable
                  style={styles.resumeCard}
                  onPress={() => {
                    navigation.navigate('ModeSelect', { 
                      level: progress.recentPractice!.level as HSKLevel, 
                      topic: progress.recentPractice!.topicKey as TopicKey,
                      topicVi: progress.recentPractice!.topicVi,
                      topicEmoji: progress.recentPractice!.topicEmoji
                    });
                  }}
                >
                  <LinearGradient 
                    colors={['rgba(245, 200, 75, 0.15)', 'rgba(245, 200, 75, 0.05)']} 
                    style={[StyleSheet.absoluteFill, { borderRadius: 22 }]} 
                  />
                  <View style={styles.resumeHeader}>
                    <Text style={styles.resumeTitle}>Tiếp tục luyện tập</Text>
                    <ArrowRight color={COLORS.yellow} size={18} />
                  </View>
                  <Text style={styles.resumeTopic}>
                    {progress.recentPractice.topicEmoji} Chủ đề: {progress.recentPractice.topicVi}
                  </Text>
                  <Text style={styles.resumeScore}>
                    Lần trước đạt {progress.recentPractice.score.toFixed(1)}/10 điểm
                  </Text>
                </AnimatedPressable>
              </View>
            ) : null}

            <View style={{ width: '100%' }}>
              <AnimatedPressable
                style={[styles.actionCard, styles.primaryActionCard]}
                onPress={() => navigation.navigate('Level')}
              >
                <View style={styles.primaryIconWrap}>
                  <Play color="#1A1233" size={24} fill="#1A1233" />
                </View>
                <View style={styles.actionCardBody}>
                  <Text style={styles.primaryActionTitle}>Bắt đầu Luyện tập</Text>
                  <Text style={styles.primaryActionSubtitle}>
                    Chọn ngân hàng đề hoặc hội thoại AI
                  </Text>
                </View>
              </AnimatedPressable>
            </View>

            <View style={styles.secondaryActions}>
              <View style={{ flex: 1 }}>
                <AnimatedPressable
                  style={[styles.actionCard, styles.secondaryActionCard]}
                  onPress={() => navigation.navigate('Progress')}
                >
                  <View style={styles.secondaryIconWrap}>
                    <TrendingUp color={COLORS.yellow} size={20} />
                  </View>
                  <Text style={styles.secondaryActionTitle}>Tiến độ học</Text>
                  <Text style={styles.secondaryActionSubtitle}>Xem lịch sử</Text>
                </AnimatedPressable>
              </View>

              <View style={{ flex: 1 }}>
                <AnimatedPressable
                  style={[styles.actionCard, styles.secondaryActionCard]}
                  onPress={() => navigation.navigate('Profile')}
                >
                  <View style={styles.secondaryIconWrap}>
                    <User color={COLORS.purpleLight} size={20} />
                  </View>
                  <Text style={styles.secondaryActionTitle}>Hồ sơ</Text>
                  <Text style={styles.secondaryActionSubtitle}>Quản lý cài đặt</Text>
                </AnimatedPressable>
              </View>
            </View>
          </View>

          {/* Streak Banner (Moved to bottom) */}
          {progress && (
            <Animated.View style={[styles.streakBanner, { transform: [{ scale: streakAnim }] }]}>
              <View style={styles.streakHeader}>
                <Flame color="#FF7139" size={24} fill="#FF7139" />
                <Text style={styles.streakTitle}>
                  {progress.streakDays > 0 
                    ? `Chuỗi học tập: ${progress.streakDays} ngày` 
                    : 'Bắt đầu chuỗi học tập ngay!'}
                </Text>
              </View>
              <View style={styles.streakWeekRow}>
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => {
                  const streak = Math.min(progress.streakDays, 7);
                  const isActive = index >= (7 - streak);
                  return (
                    <View key={index} style={[styles.dayNode, isActive && styles.dayNodeActive]}>
                      <Text style={[styles.dayText, isActive && styles.dayTextActive]}>{day}</Text>
                    </View>
                  );
                })}
              </View>
            </Animated.View>
          )}
        </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 70,
  },
  glowOne: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(76, 29, 149, 0.26)',
    top: 180,
    left: -120,
  },
  glowTwo: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(37, 16, 100, 0.28)',
    top: 430,
    right: -110,
  },
  dashboardSection: {
    marginTop: 24,
    gap: 20,
  },
  streakBanner: {
    backgroundColor: 'rgba(255, 113, 57, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 113, 57, 0.4)',
    borderRadius: 20,
    padding: 16,
    marginTop: 36,
    alignItems: 'center',
    shadowColor: '#FF7139',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  streakTitle: {
    color: '#FF7139',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: serifFont,
  },
  streakWeekRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  dayNode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNodeActive: {
    backgroundColor: '#FF7139',
  },
  dayText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  dayTextActive: {
    color: '#1A1233',
  },
  resumeCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(245, 200, 75, 0.4)',
    padding: 20,
    overflow: 'hidden',
  },
  resumeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resumeTitle: {
    color: COLORS.yellow,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  resumeTopic: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: serifFont,
    marginBottom: 6,
  },
  resumeScore: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  actionCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
  },
  primaryActionCard: {
    borderColor: 'rgba(109, 74, 255, 0.6)',
    backgroundColor: 'rgba(45, 10, 145, 0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  primaryIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.yellow,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  actionCardBody: {
    flex: 1,
    justifyContent: 'center',
  },
  primaryActionTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: serifFont,
    marginBottom: 4,
  },
  primaryActionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 20,
  },
  secondaryActionCard: {
    borderColor: 'rgba(109, 74, 255, 0.28)',
    backgroundColor: 'rgba(11, 8, 36, 0.88)',
    padding: 18,
    width: '100%',
  },
  secondaryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  secondaryActionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: serifFont,
    marginBottom: 4,
  },
  secondaryActionSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
});
