import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeHeader } from '../components/home/HomeHeader';
import { AnswerInputCard } from '../components/practice/AnswerInputCard';
import { PracticeActions } from '../components/practice/PracticeActions';
import { PracticeMetaBar } from '../components/practice/PracticeMetaBar';
import { PracticeProgressBar } from '../components/practice/PracticeProgressBar';
import { PracticeQuestionCard } from '../components/practice/PracticeQuestionCard';
import { ScoreFeedback } from '../components/practice/ScoreFeedback';
import { practiceQuestions } from '../data/questions';
import { COLORS } from '../theme/colors';
import { serifFont } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Practice'>;

type PracticeAnswer = {
  questionId: string;
  userAnswer: string;
  score: number;
};

export function PracticeScreen({ navigation, route }: Props) {
  const { level, topic } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [hasScored, setHasScored] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [answers, setAnswers] = useState<PracticeAnswer[]>([]);

  const practiceQuestionsForRoute = useMemo(
    () =>
      practiceQuestions.filter(
        (question) => question.hsk_level === level && question.topic === topic,
      ),
    [level, topic],
  );

  if (practiceQuestionsForRoute.length === 0) {
    return (
      <LinearGradient colors={['#050316', '#08051F', '#050316']} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <HomeHeader activeTab="practice" />
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Chưa có câu hỏi cho chủ đề này</Text>
            <Text style={styles.emptyDescription}>
              Bạn có thể quay lại chọn chủ đề khác để tiếp tục luyện tập.
            </Text>
            <Pressable
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Topic', { level })}
            >
              <Text style={styles.emptyButtonText}>Quay về Topic</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentQuestion = practiceQuestionsForRoute[currentIndex];
  const current = currentIndex + 1;
  const total = practiceQuestionsForRoute.length;
  const isLastQuestion = currentIndex === total - 1;

  const handleSpeakQuestion = () => {
    Speech.speak(currentQuestion.question_zh, { language: 'zh-CN' });
  };

  const handleSpeakSample = () => {
    Speech.speak(currentQuestion.sample_answer_zh, { language: 'zh-CN' });
  };

  const handleScore = () => {
    const nextScore = 8;

    setScore(nextScore);
    setHasScored(true);
    setAnswers((currentAnswers) => [
      ...currentAnswers.filter((answer) => answer.questionId !== currentQuestion.id),
      {
        questionId: currentQuestion.id,
        userAnswer,
        score: nextScore,
      },
    ]);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      return;
    }

    setCurrentIndex((index) => index + 1);
    setUserAnswer('');
    setShowHint(false);
    setShowSample(false);
    setHasScored(false);
    setScore(null);
  };

  const handleResult = () => {
    navigation.navigate('Result', {
      level,
      topic,
      totalQuestions: total,
      answeredQuestions: total,
    });
  };

  const handleChangeTopic = () => {
    navigation.navigate('Topic', { level });
  };

  const handleRecord = () => {
    Alert.alert('Sắp ra mắt', 'Tính năng ghi âm sẽ được cập nhật sau.');
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
          <PracticeMetaBar
            level={level}
            topicEmoji={currentQuestion.topicEmoji}
            topicVi={currentQuestion.topicVi}
            current={current}
            total={total}
            onChangeTopic={handleChangeTopic}
          />

          <PracticeProgressBar current={current} total={total} />

          <PracticeQuestionCard
            questionZh={currentQuestion.question_zh}
            pinyin={currentQuestion.pinyin}
            meaningVi={currentQuestion.meaning_vi}
            sampleAnswerZh={currentQuestion.sample_answer_zh}
            sampleAnswerPinyin={currentQuestion.sample_answer_pinyin}
            sampleAnswerVi={currentQuestion.sample_answer_vi}
            showSample={showSample}
            onSpeakQuestion={handleSpeakQuestion}
            onSpeakSample={handleSpeakSample}
          />

          <AnswerInputCard value={userAnswer} onChangeText={setUserAnswer} />

          <PracticeActions
            hasScored={hasScored}
            isLastQuestion={isLastQuestion}
            onRecord={handleRecord}
            onToggleHint={() => setShowHint((visible) => !visible)}
            onToggleSample={() => setShowSample((visible) => !visible)}
            onScore={handleScore}
            onNext={handleNext}
            onResult={handleResult}
          />

          {showHint ? (
            <View style={styles.hintBox}>
              <Text style={styles.hintText}>Gợi ý: {currentQuestion.hint_vi}</Text>
            </View>
          ) : null}

          {score !== null ? <ScoreFeedback score={score} /> : null}
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
    paddingBottom: 70,
  },
  glowOne: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(76, 29, 149, 0.2)',
    top: 170,
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
  hintBox: {
    marginHorizontal: 18,
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(11, 8, 36, 0.65)',
    padding: 14,
  },
  hintText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontFamily: serifFont,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
  },
  emptyDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
  },
  emptyButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.purple,
    borderRadius: 999,
    marginTop: 28,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
