import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedBouncingDots } from '../components/animations/AnimatedBouncingDots';
import { AnimatedBreathing } from '../components/animations/AnimatedBreathing';
import { AnimatedPressable } from '../components/common/AnimatedPressable';
import { HomeHeader } from '../components/home/HomeHeader';
import { AnswerInputCard } from '../components/practice/AnswerInputCard';
import { PlaybackControls } from '../components/practice/PlaybackControls';
import { PracticeActions } from '../components/practice/PracticeActions';
import { PracticeMetaBar } from '../components/practice/PracticeMetaBar';
import { RecordingWaveform } from '../components/practice/RecordingWaveform';
import { PracticeProgressBar } from '../components/practice/PracticeProgressBar';
import { PracticeQuestionCard } from '../components/practice/PracticeQuestionCard';
import { ScoreFeedback } from '../components/practice/ScoreFeedback';
import { PracticeQuestion, practiceQuestions as mockPracticeQuestions } from '../data/questions';
import {
  completePracticeSession as completePracticeSessionFromApi,
  createPracticeSession,
  GradeAnswerApiDto,
  gradeAnswerFromApi,
  transcribeAudioFromApi,
} from '../services/api/practiceApi';
import { getQuestionsFromApi, MobilePracticeQuestion } from '../services/api/questionsApi';
import { synthesizeSpeechFromApi } from '../services/api/ttsApi';
import { COLORS } from '../theme/colors';
import { serifFont } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';
import { playBase64Audio } from '../utils/audioPlayer';

type Props = NativeStackScreenProps<RootStackParamList, 'Practice'>;

type PracticeAnswer = {
  questionId: string;
  userAnswer: string;
  score: number;
};

type TtsAudioCacheEntry = {
  audioBase64: string;
  mimeType: string;
};

export function PracticeScreen({ navigation, route }: Props) {
  const { level, topic } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [hasScored, setHasScored] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradeAnswerApiDto | null>(null);
  const [answers, setAnswers] = useState<PracticeAnswer[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isGrading, setIsGrading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [isSpeakingSample, setIsSpeakingSample] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [practiceQuestions, setPracticeQuestions] = useState<
    Array<PracticeQuestion | MobilePracticeQuestion>
  >([]);
  const ttsCacheRef = useRef<Record<string, TtsAudioCacheEntry>>({});
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  useEffect(() => {
    setCurrentIndex(0);
  }, [practiceQuestions]);

  useEffect(() => {
    let isMounted = true;

    const mockQuestions = mockPracticeQuestions.filter(
      (question) => question.hsk_level === level && question.topic === topic,
    );

    async function loadQuestions() {
      setIsLoadingQuestions(true);
      setCurrentIndex(0);
      setUserAnswer('');
      setShowHint(false);
      setShowSample(false);
      setHasScored(false);
      setGradeResult(null);
      setAnswers([]);
      setSessionId(null);
      setRecordingUri(null);
      setIsRecording(false);
      setIsTranscribing(false);

      try {
        const apiQuestions = await getQuestionsFromApi(level, topic);

        if (isMounted) {
          setPracticeQuestions(apiQuestions.length > 0 ? apiQuestions : mockQuestions);
        }
      } catch {
        if (isMounted) {
          setPracticeQuestions(mockQuestions);
        }
      } finally {
        if (isMounted) {
          setIsLoadingQuestions(false);
        }
      }
    }

    void loadQuestions();

    return () => {
      isMounted = false;
    };
  }, [level, topic]);

  useEffect(() => {
    if (isLoadingQuestions || practiceQuestions.length === 0) {
      return;
    }

    let isMounted = true;

    async function startPracticeSession() {
      try {
        const session = await createPracticeSession(level, topic);

        if (isMounted) {
          setSessionId(session.sessionId);
          console.info('[PracticeScreen] Created practice session', session.sessionId);
        }
      } catch (error) {
        console.warn('[PracticeScreen] Failed to create practice session', error);

        if (isMounted) {
          setSessionId(null);
        }
      }
    }

    void startPracticeSession();

    return () => {
      isMounted = false;
    };
  }, [isLoadingQuestions, level, practiceQuestions.length, topic]);

  if (isLoadingQuestions) {
    return (
      <LinearGradient colors={['#050316', '#08051F', '#050316']} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <HomeHeader activeTab="practice" />
          <View style={styles.loadingState}>
            <AnimatedBouncingDots />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (practiceQuestions.length === 0) {
    return (
      <LinearGradient colors={['#050316', '#08051F', '#050316']} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <HomeHeader activeTab="practice" />
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Chưa có câu hỏi cho chủ đề này.</Text>
            <Text style={styles.emptyDescription}>
              Bạn có thể quay lại chọn chủ đề khác để tiếp tục luyện tập.
            </Text>
            <AnimatedPressable
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Topic', { level })}
            >
              <Text style={styles.emptyButtonText}>Quay về Topic</Text>
            </AnimatedPressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentQuestion = practiceQuestions[currentIndex];
  const current = currentIndex + 1;
  const total = practiceQuestions.length;
  const isLastQuestion = currentIndex === total - 1;

  const handleSpeakWithTts = async (text: string, type: 'question' | 'sample') => {
    const trimmedText = text.trim();
    const language = 'zh-CN';
    const voice = 'default';
    const cacheKey = `${language}:${voice}:${trimmedText}`;

    if (!trimmedText || isSpeakingQuestion || isSpeakingSample) {
      return;
    }

    const setSpeaking = type === 'question' ? setIsSpeakingQuestion : setIsSpeakingSample;

    setSpeaking(true);

    try {
      const cachedAudio = ttsCacheRef.current[cacheKey];
      const audio =
        cachedAudio ??
        (await synthesizeSpeechFromApi({
          text: trimmedText,
          language,
          voice,
        }));

      if (!cachedAudio) {
        ttsCacheRef.current[cacheKey] = audio;
      }

      await playBase64Audio(audio);
    } catch {
      Speech.speak(trimmedText, { language: 'zh-CN', rate: 0.85 });
    } finally {
      setSpeaking(false);
    }
  };

  const handleSpeakQuestion = () => {
    void handleSpeakWithTts(currentQuestion.question_zh, 'question');
  };

  const handleSpeakSample = () => {
    void handleSpeakWithTts(currentQuestion.sample_answer_zh, 'sample');
  };

  const handleScore = async () => {
    const trimmedAnswer = userAnswer.trim();

    if (isTranscribing) {
      return;
    }

    if (!trimmedAnswer) {
      Alert.alert('Chưa có câu trả lời', 'Hãy nhập hoặc ghi âm câu trả lời trước khi chấm điểm.');
      return;
    }

    if (!sessionId) {
      Alert.alert('Chưa thể chấm điểm', 'Phiên luyện tập chưa sẵn sàng. Vui lòng thử lại.');
      return;
    }

    setIsGrading(true);

    try {
      const result = await gradeAnswerFromApi({
        sessionId,
        questionId: currentQuestion.id,
        userAnswerZh: trimmedAnswer,
      });

      setGradeResult(result);
      setHasScored(true);
      setAnswers((currentAnswers) => [
        ...currentAnswers.filter((answer) => answer.questionId !== currentQuestion.id),
        {
          questionId: currentQuestion.id,
          userAnswer: trimmedAnswer,
          score: result.score,
        },
      ]);
    } catch (error) {
      console.warn('[PracticeScreen] Failed to grade answer', error);
      Alert.alert('Lỗi chấm điểm', 'Hiện chưa thể chấm điểm. Vui lòng thử lại.');
    } finally {
      setIsGrading(false);
    }
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
    setGradeResult(null);
    setRecordingUri(null);
  };

  const handleResult = async () => {
    if (!sessionId) {
      Alert.alert('Chưa thể xem kết quả', 'Phiên luyện tập chưa sẵn sàng. Vui lòng thử lại.');
      return;
    }

    try {
      const result = await completePracticeSessionFromApi(sessionId);

      navigation.navigate('Result', {
        level,
        topic,
        totalQuestions: result.totalQuestions,
        answeredQuestions: result.answeredQuestions,
        averageScore: result.averageScore,
        suggestionVi: gradeResult?.suggestionVi,
      });
    } catch (error) {
      console.warn('[PracticeScreen] Failed to complete practice session', error);
      Alert.alert('Lỗi kết quả', 'Hiện chưa thể tổng kết phiên luyện tập. Vui lòng thử lại.');
    }
  };

  const handleChangeTopic = () => {
    navigation.navigate('Topic', { level });
  };

  const transcribeRecording = async (audioUri: string) => {
    setIsTranscribing(true);

    try {
      const result = await transcribeAudioFromApi(audioUri);

      setUserAnswer(result.text);
    } catch (error) {
      console.warn('[PracticeScreen] Failed to transcribe audio', error);
      Alert.alert(
        'Lỗi nhận diện giọng nói',
        'Chưa thể nhận diện giọng nói. Bạn có thể nhập câu trả lời bằng text.',
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  const startRecording = async () => {
    const permission = await AudioModule.requestRecordingPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Cần quyền microphone', 'Bạn cần cấp quyền microphone để ghi âm.');
      return;
    }

    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();

    setIsRecording(true);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    await audioRecorder.stop();

    const uri = audioRecorder.uri;

    if (!uri) {
      Alert.alert(
        'Lỗi ghi âm',
        'Chưa thể lấy file ghi âm. Bạn có thể nhập câu trả lời bằng text.',
      );
      return;
    }

    setRecordingUri(uri);
    await transcribeRecording(uri);
  };

  const handleRecord = async () => {
    try {
      if (isRecording) {
        await stopRecording();
        return;
      }

      await startRecording();
    } catch (error) {
      console.warn('[PracticeScreen] Failed to handle recording', error);
      setIsRecording(false);
      Alert.alert(
        'Lỗi ghi âm',
        'Chưa thể nhận diện giọng nói. Bạn có thể nhập câu trả lời bằng text.',
      );
    }
  };

  return (
    <LinearGradient colors={['#050316', '#08051F', '#050316']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <HomeHeader activeTab="practice" />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
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
              isSpeakingQuestion={isSpeakingQuestion}
              isSpeakingSample={isSpeakingSample}
            />

            <AnswerInputCard value={userAnswer} onChangeText={setUserAnswer} />

            {recordingUri && !isRecording && !isTranscribing ? (
              <PlaybackControls uri={recordingUri} />
            ) : null}

            {isRecording ? (
              <RecordingWaveform isRecording={isRecording} onStop={handleRecord} />
            ) : (
              <PracticeActions
                hasScored={hasScored}
                isGrading={isGrading}
                isRecording={isRecording}
                isTranscribing={isTranscribing}
                isLastQuestion={isLastQuestion}
                hasRecording={!!recordingUri}
                onRecord={handleRecord}
                onToggleHint={() => setShowHint((visible) => !visible)}
                onToggleSample={() => setShowSample((visible) => !visible)}
                onScore={handleScore}
                onNext={handleNext}
                onResult={handleResult}
              />
            )}

            {isTranscribing ? (
              <AnimatedBreathing style={styles.voiceStatus}>
                <View style={styles.recordingDot} />
                <Text style={styles.voiceStatusText}>Đang nhận diện giọng nói...</Text>
              </AnimatedBreathing>
            ) : null}

            {showHint ? (
              <View style={styles.hintBox}>
                <Text style={styles.hintText}>Gợi ý: {currentQuestion.hint_vi}</Text>
              </View>
            ) : null}

            {gradeResult ? (
              <ScoreFeedback
                score={gradeResult.score}
                shortFeedbackVi={gradeResult.shortFeedbackVi}
                grammarFeedbackVi={gradeResult.grammarFeedbackVi}
                vocabularyFeedbackVi={gradeResult.vocabularyFeedbackVi}
                suggestionVi={gradeResult.suggestionVi}
                improvedAnswerZh={gradeResult.improvedAnswerZh}
                improvedAnswerPinyin={gradeResult.improvedAnswerPinyin}
                improvedAnswerVi={gradeResult.improvedAnswerVi}
              />
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
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
    borderColor: 'rgba(168, 160, 200, 0.28)',
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
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 10,
  },
  voiceStatus: {
    alignSelf: 'flex-start',
    marginHorizontal: 18,
    marginTop: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245, 200, 75, 0.4)',
    backgroundColor: 'rgba(245, 200, 75, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F97373',
  },
  voiceStatusText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
});
