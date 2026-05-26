import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeHeader } from '../components/home/HomeHeader';
import { HSKProgressSection } from '../components/progress/HSKProgressSection';
import { ProgressCTA } from '../components/progress/ProgressCTA';
import { ProgressHero } from '../components/progress/ProgressHero';
import { RecentPracticeCard } from '../components/progress/RecentPracticeCard';
import { RecommendationCard } from '../components/progress/RecommendationCard';
import { StatsGrid } from '../components/progress/StatsGrid';
import { progressMock } from '../data/progressMock';
import { COLORS } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Progress'>;

export function ProgressScreen({ navigation }: Props) {
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

          <StatsGrid
            totalSessions={progressMock.totalSessions}
            averageScore={progressMock.averageScore}
            totalQuestions={progressMock.totalQuestions}
            streakDays={progressMock.streakDays}
          />

          <HSKProgressSection items={progressMock.hskProgress} />

          <RecentPracticeCard
            level={progressMock.recentPractice.level}
            topicEmoji={progressMock.recentPractice.topicEmoji}
            topicVi={progressMock.recentPractice.topicVi}
            questions={progressMock.recentPractice.questions}
            score={progressMock.recentPractice.score}
          />

          <RecommendationCard
            level={progressMock.recentPractice.level}
            topicVi={progressMock.recentPractice.topicVi}
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
});
