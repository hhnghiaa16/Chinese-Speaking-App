import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeHeader } from '../components/home/HomeHeader';
import { NextSuggestionCard } from '../components/result/NextSuggestionCard';
import { PracticeStatsCard } from '../components/result/PracticeStatsCard';
import { ResultActions } from '../components/result/ResultActions';
import { ResultHero } from '../components/result/ResultHero';
import { ScoreSummaryCard } from '../components/result/ScoreSummaryCard';
import { topics } from '../data/topics';
import { COLORS } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export function ResultScreen({ navigation, route }: Props) {
  const { level, topic, totalQuestions, answeredQuestions, averageScore } = route.params;

  const currentTopic = topics.find((item) => item.key === topic);
  const topicVi = currentTopic?.titleVi ?? 'Chủ đề';
  const topicEmoji = currentTopic?.emoji ?? '✨';

  const handleRetry = () => {
    navigation.navigate('Practice', { level, topic });
  };

  const handleChangeTopic = () => {
    navigation.navigate('Topic', { level });
  };

  const handleHome = () => {
    navigation.navigate('Home');
  };

  return (
    <LinearGradient colors={['#050316', '#08051F', '#050316']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <HomeHeader activeTab="practice" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ResultHero level={level} topicEmoji={topicEmoji} topicVi={topicVi} />

          <ScoreSummaryCard score={averageScore} />

          <PracticeStatsCard
            level={level}
            topicVi={topicVi}
            answeredQuestions={answeredQuestions}
            totalQuestions={totalQuestions}
          />

          <NextSuggestionCard />

          <ResultActions
            onRetry={handleRetry}
            onChangeTopic={handleChangeTopic}
            onHome={handleHome}
          />
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
    top: 420,
    right: -120,
  },
});
