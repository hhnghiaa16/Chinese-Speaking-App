import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FeatureCard } from '../components/home/FeatureCard';
import { HeroSection } from '../components/home/HeroSection';
import { HomeHeader } from '../components/home/HomeHeader';
import { PracticePreviewCard } from '../components/home/PracticePreviewCard';
import { COLORS } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
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
          <HeroSection
            onStartPress={() => navigation.navigate('Level')}
            onProgressPress={() => navigation.navigate('Progress')}
          />

          <PracticePreviewCard />

          <FeatureCard
            icon="◎"
            title="5 trình độ HSK"
            description="Từ HSK 1 cho người mới đến HSK 5 cho thảo luận sâu."
          />

          <FeatureCard
            icon="🎙"
            title="Phản xạ thật"
            description="Ghi âm bằng giọng nói, được chấm điểm và gợi ý tức thì."
          />

          <FeatureCard
            icon="✧"
            title="AI gia sư"
            description="Gợi ý lỗi sai, nhận xét phản xạ và đề xuất câu trả lời tự nhiên hơn."
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
});
