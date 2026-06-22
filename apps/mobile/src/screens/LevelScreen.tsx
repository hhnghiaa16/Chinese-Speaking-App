import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeHeader } from '../components/home/HomeHeader';
import { LevelCard } from '../components/level/LevelCard';
import { LevelIntro } from '../components/level/LevelIntro';
import { hskLevels } from '../data/levels';
import { getHskLevelsFromApi } from '../services/api/hskApi';
import { COLORS } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Level'>;
type HskLevel = {
  key: RootStackParamList['Topic']['level'];
  number: number;
  title: string;
  subtitle: string;
  vocabCount: string;
  questionCount: number;
  available: boolean;
};

export function LevelScreen({ navigation }: Props) {
  const [levels, setLevels] = useState<HskLevel[]>([...hskLevels]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadLevels() {
      try {
        const apiLevels = await getHskLevelsFromApi();

        if (isMounted) {
          setLevels(apiLevels);
        }
      } catch {
        if (isMounted) {
          setLevels([...hskLevels]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadLevels();

    return () => {
      isMounted = false;
    };
  }, []);

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

          {isLoading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator color={COLORS.yellow} size="large" />
              <Text style={styles.loadingText}>Đang tải lộ trình...</Text>
            </View>
          ) : (
            levels.map((level) => (
              <LevelCard
                key={level.key}
                number={level.number}
                title={level.title}
                subtitle={level.subtitle}
                vocabCount={level.vocabCount}
                questionCount={level.questionCount}
                available={level.available}
                onPress={() => {
                  if (level.available) {
                    navigation.navigate('Topic', { level: level.key });
                  } else {
                    Alert.alert('Chưa có dữ liệu', 'Cấp độ này hiện chưa có câu hỏi nào. Vui lòng quay lại sau.');
                  }
                }}
              />
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
