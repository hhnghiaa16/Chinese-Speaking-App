import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeHeader } from '../components/home/HomeHeader';
import { HSKProgressSection } from '../components/progress/HSKProgressSection';
import { ProgressCTA } from '../components/progress/ProgressCTA';
import { ProgressHero } from '../components/progress/ProgressHero';
import { RecentPracticeCard } from '../components/progress/RecentPracticeCard';
import { RecommendationCard } from '../components/progress/RecommendationCard';
import { StatsGrid } from '../components/progress/StatsGrid';
import { progressMock } from '../data/progressMock';
import { getProgressFromApi } from '../services/api/progressApi';
import { COLORS } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Progress'>;
type ProgressData = typeof progressMock;

export function ProgressScreen({ navigation }: Props) {
  const [progress, setProgress] = useState<ProgressData>(progressMock);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProgress() {
      try {
        const apiProgress = await getProgressFromApi();

        if (isMounted) {
          setProgress(apiProgress);
        }
      } catch {
        if (isMounted) {
          setProgress(progressMock);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProgress();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <LinearGradient colors={['#050316', '#08051F', '#050316']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <HomeHeader activeTab="progress" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ProgressHero />

          {isLoading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator color={COLORS.yellow} />
              <Text style={styles.loadingText}>Đang tải tiến độ...</Text>
            </View>
          ) : null}

          <StatsGrid
            totalSessions={progress.totalSessions}
            averageScore={progress.averageScore}
            totalQuestions={progress.totalQuestions}
            streakDays={progress.streakDays}
          />

          <HSKProgressSection items={progress.hskProgress} />

          <RecentPracticeCard
            level={progress.recentPractice.level}
            topicEmoji={progress.recentPractice.topicEmoji}
            topicVi={progress.recentPractice.topicVi}
            questions={progress.recentPractice.questions}
            score={progress.recentPractice.score}
          />

          <RecommendationCard
            level={progress.recentPractice.level}
            topicVi={progress.recentPractice.topicVi}
          />

          <ProgressCTA onPress={() => navigation.navigate('Level')} />
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
    paddingHorizontal: 18,
    paddingTop: 56,
    paddingBottom: 70,
  },
  glowOne: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(76, 29, 149, 0.22)',
    top: 160,
    left: -130,
  },
  glowTwo: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(245, 200, 75, 0.08)',
    top: 520,
    right: -120,
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 10,
  },
});
