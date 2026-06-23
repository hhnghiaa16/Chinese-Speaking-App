import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedBouncingDots } from '../components/animations/AnimatedBouncingDots';
import { AnimatedFadeIn } from '../components/animations/AnimatedFadeIn';
import { HomeHeader } from '../components/home/HomeHeader';
import { TopicCard } from '../components/topic/TopicCard';
import { TopicIntro } from '../components/topic/TopicIntro';
import { topics } from '../data/topics';
import { getTopicsFromApi, MobileTopic } from '../services/api/topicsApi';
import { COLORS } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Topic'>;
type Topic = MobileTopic;

export function TopicScreen({ navigation, route }: Props) {
  const { level } = route.params;
  const [availableTopics, setAvailableTopics] = useState<Topic[]>([...topics]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadTopics() {
      try {
        const apiTopics = await getTopicsFromApi(level);

        if (isMounted) {
          setAvailableTopics(apiTopics);
        }
      } catch {
        if (isMounted) {
          setAvailableTopics([...topics]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadTopics();

    return () => {
      isMounted = false;
    };
  }, []);

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
          <TopicIntro level={level} />

          {isLoading ? (
            <View style={styles.loadingState}>
              <AnimatedBouncingDots />
            </View>
          ) : (
            availableTopics.map((topic, index) => (
              <AnimatedFadeIn key={topic.key} index={index}>
                <TopicCard
                  emoji={topic.emoji}
                  titleZh={topic.titleZh}
                  titleVi={topic.titleVi}
                  description={topic.description}
                  onPress={() =>
                    navigation.navigate('ModeSelect', {
                      level,
                      topic: topic.key,
                      topicVi: topic.titleVi,
                      topicEmoji: topic.emoji ?? '',
                    })
                  }
                />
              </AnimatedFadeIn>
            ))
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
    backgroundColor: 'rgba(37, 16, 100, 0.24)',
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
