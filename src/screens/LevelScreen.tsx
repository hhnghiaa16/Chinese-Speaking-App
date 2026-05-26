import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeHeader } from '../components/home/HomeHeader';
import { LevelCard } from '../components/level/LevelCard';
import { LevelIntro } from '../components/level/LevelIntro';
import { hskLevels } from '../data/levels';
import { COLORS } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Level'>;
type HskLevel = (typeof hskLevels)[number];

export function LevelScreen({ navigation }: Props) {
  const handleSelectLevel = (level: HskLevel) => {
    if (level.available) {
      navigation.navigate('Topic', { level: level.key });
      return;
    }

    Alert.alert('Sắp ra mắt', 'Cấp độ này sẽ được cập nhật ở phiên bản sau.');
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
          <LevelIntro />

          {hskLevels.map((level) => (
            <LevelCard
              key={level.key}
              number={level.number}
              title={level.title}
              subtitle={level.subtitle}
              vocabCount={level.vocabCount}
              onPress={() => handleSelectLevel(level)}
            />
          ))}
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
});
