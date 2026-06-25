import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { ChevronLeft } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedPressable } from '../components/common/AnimatedPressable';
import { AiAvatar, AiAvatarPhase } from '../components/practice/AiAvatar';
import { FooterTrustNote } from '../components/practice/FooterTrustNote';
import { HaloRings } from '../components/practice/HaloRings';
import { PromptAssistRow } from '../components/practice/PromptAssistRow';
import { QuestionCard } from '../components/practice/QuestionCard';
import { ScoreFeedback } from '../components/practice/ScoreFeedback';
import { VoiceAnswerPanel } from '../components/practice/VoiceAnswerPanel';
import {
  GeneratedQuestionDto,
  GradeAnswerApiDto,
  generateQuestionFromApi,
  gradeWithAiInline,
  transcribeAudioFromApi,
} from '../services/api/practiceApi';
import { synthesizeSpeechFromApi } from '../services/api/ttsApi';
import { COLORS } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';
import { playBase64Audio } from '../utils/audioPlayer';

type Props = NativeStackScreenProps<RootStackParamList, 'AiConversation'>;

type Phase =
  | 'generating'
  | 'speaking'
  | 'answering'
  | 'grading'
  | 'feedback';

type TtsCache = { audioBase64: string; mimeType: string };

const TOTAL_ROUNDS = 5;

export function AiConversationScreen({ navigation, route }: Props) {
  const { level, topic, topicVi, topicEmoji } = route.params;
  const { height } = useWindowDimensions();
  const compact = height < 760;

  const [phase, setPhase] = useState<Phase>('generating');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<GeneratedQuestionDto | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [gradeResult, setGradeResult] = useState<GradeAnswerApiDto | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [generateError, setGenerateError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const ttsCacheRef = useRef<Record<string, TtsCache>>({});
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const generateNextQuestion = useCallback(
    async (asked: string[], previousFeedback?: string) => {
      setPhase('generating');
      setGenerateError(false);
      setShowHint(false);
      setCurrentQuestion(null);
      setUserAnswer('');
      setRecordingUri(null);
      setGradeResult(null);

      try {
        const question = await generateQuestionFromApi(level, topic, topicVi, asked, previousFeedback);
        setCurrentQuestion(question);
        setAskedQuestions((prev) => [...prev, question.questionZh]);
        setPhase('speaking');
      } catch {
        setGenerateError(true);
        setPhase('answering');
      }
    },
    [level, topic, topicVi],
  );

  useEffect(() => {
    if (phase !== 'speaking' || !currentQuestion) {
      return;
    }

    let isMounted = true;
    const text = currentQuestion.questionZh;
    const cacheKey = `zh:${text}`;

    async function speakQuestion() {
      setIsSpeaking(true);

      try {
        const cached = ttsCacheRef.current[cacheKey];
        const audio =
          cached ??
          (await synthesizeSpeechFromApi({ text, language: 'zh-CN' }));

        if (!cached) {
          ttsCacheRef.current[cacheKey] = audio;
        }

        if (isMounted) {
          await playBase64Audio(audio);
        }
      } catch {
        Speech.speak(text, { language: 'zh-CN', rate: 0.85 });
      } finally {
        if (isMounted) {
          setIsSpeaking(false);
          setPhase('answering');
        }
      }
    }

    void speakQuestion();

    return () => {
      isMounted = false;
    };
  }, [phase, currentQuestion]);

  useEffect(() => {
    void generateNextQuestion([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReplayTts = () => {
    if (!currentQuestion || isSpeaking) return;

    const text = currentQuestion.questionZh;
    const cacheKey = `zh:${text}`;

    setIsSpeaking(true);

    const cachedAudio = ttsCacheRef.current[cacheKey];

    if (cachedAudio) {
      playBase64Audio(cachedAudio)
        .catch(() => Speech.speak(text, { language: 'zh-CN', rate: 0.85 }))
        .finally(() => setIsSpeaking(false));
    } else {
      synthesizeSpeechFromApi({ text, language: 'zh-CN' })
        .then((audio) => {
          ttsCacheRef.current[cacheKey] = audio;
          return playBase64Audio(audio);
        })
        .catch(() => Speech.speak(text, { language: 'zh-CN', rate: 0.85 }))
        .finally(() => setIsSpeaking(false));
    }
  };

  const handleGrade = async () => {
    const trimmedAnswer = userAnswer.trim();

    if (!trimmedAnswer || !currentQuestion) {
      Alert.alert(
        'Chưa có câu trả lời',
        'Hãy nhập hoặc ghi âm câu trả lời trước khi chấm điểm.',
      );
      return;
    }

    setPhase('grading');

    try {
      const result = await gradeWithAiInline({
        level,
        topicVi,
        questionZh: currentQuestion.questionZh,
        questionPinyin: currentQuestion.questionPinyin,
        questionVi: currentQuestion.questionVi,
        userAnswerZh: trimmedAnswer,
      });

      setGradeResult(result);
      setScores((prev) => [...prev, result.score]);
      setPhase('feedback');
    } catch {
      Alert.alert('Lỗi chấm điểm', 'Hiện chưa thể chấm điểm. Vui lòng thử lại.');
      setPhase('answering');
    }
  };

  const handleNext = () => {
    if (currentRound >= TOTAL_ROUNDS) {
      const allScores = gradeResult ? [...scores.slice(0, -1), gradeResult.score] : scores;
      const avg =
        allScores.length > 0
          ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10
          : 0;

      navigation.navigate('Result', {
        level,
        topic,
        totalQuestions: TOTAL_ROUNDS,
        answeredQuestions: allScores.length,
        averageScore: avg,
        suggestionVi: gradeResult?.suggestionVi,
      });

      return;
    }

    const nextRound = currentRound + 1;
    setCurrentRound(nextRound);

    const feedbackToPass = gradeResult?.suggestionVi || gradeResult?.grammarFeedbackVi || undefined;
    void generateNextQuestion(askedQuestions, feedbackToPass);
  };

  const transcribeRecording = async (audioUri: string) => {
    setIsTranscribing(true);

    try {
      const result = await transcribeAudioFromApi(audioUri);
      setUserAnswer(result.text);
    } catch {
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

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    await audioRecorder.stop();
    await setAudioModeAsync({
      allowsRecording: false,
      playsInSilentMode: true,
      shouldRouteThroughEarpiece: false,
    });

    const uri = audioRecorder.uri;

    if (!uri) {
      Alert.alert('Lỗi ghi âm', 'Chưa thể lấy file ghi âm. Bạn có thể nhập câu trả lời bằng text.');
      return;
    }

    setRecordingUri(uri);
    await transcribeRecording(uri);
  };

  const getAvatarPhase = (): AiAvatarPhase => {
    if (generateError) return 'error';
    if (phase === 'generating') return 'generating';
    if (phase === 'speaking' || isSpeaking) return 'speaking';
    if (phase === 'answering' && isRecording) return 'listening';
    if (phase === 'grading') return 'thinking';
    if (phase === 'feedback') return 'feedback';
    return 'idle';
  };

  const getAssistantStatusText = () => {
    if (generateError) return 'CẦN TẢI LẠI';
    if (isTranscribing) return 'ĐANG NHẬN DIỆN...';
    if (isRecording) return 'ĐANG GHI ÂM...';
    if (phase === 'generating') return 'AI ĐANG CHUẨN BỊ...';
    if (phase === 'speaking' || isSpeaking) return 'AI ĐANG NÓI...';
    if (phase === 'grading') return 'AI ĐANG CHẤM...';
    if (phase === 'feedback') return 'ĐÃ CÓ NHẬN XÉT';
    return 'ĐẾN LƯỢT BẠN';
  };

  const isLastRound = currentRound >= TOTAL_ROUNDS;
  const avatarPhase = getAvatarPhase();
  const haloMode = isRecording
    ? 'recording'
    : phase === 'grading' || phase === 'generating'
      ? 'thinking'
      : phase === 'speaking' || isSpeaking
        ? 'speaking'
        : 'idle';
  const haloActive = phase === 'generating' || phase === 'speaking' || isSpeaking || isRecording;

  return (
    <LinearGradient colors={['#160C3A', '#08041D', '#03010D']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View pointerEvents="none" style={styles.centerGlow} />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.content, compact && styles.contentCompact]}
            keyboardShouldPersistTaps="handled"
          >
            <MinimalProgressHeader
              level={level}
              topicEmoji={topicEmoji}
              topicVi={topicVi}
              current={currentRound}
              total={TOTAL_ROUNDS}
              onBack={() => navigation.navigate('Topic', { level })}
            />

            <View style={[styles.stage, compact && styles.stageCompact]}>
              <HaloRings active={haloActive} mode={haloMode} size={compact ? 216 : 244} />
              <View style={[styles.avatarSlot, compact && styles.avatarSlotCompact]}>
                <AiAvatar phase={avatarPhase} size={compact ? 82 : 96} />
              </View>
              <View style={styles.questionCardSlot}>
                <QuestionCard
                  questionZh={currentQuestion?.questionZh}
                  questionPinyin={currentQuestion?.questionPinyin}
                  questionVi={currentQuestion?.questionVi}
                  isSpeaking={isSpeaking || phase === 'speaking'}
                  isLoading={phase === 'generating'}
                  error={generateError}
                  onReplay={handleReplayTts}
                  onRetry={() => void generateNextQuestion(askedQuestions)}
                />
              </View>
            </View>

            <PromptAssistRow
              status={getAssistantStatusText()}
              showHint={showHint}
              onToggleHint={() => setShowHint((prev) => !prev)}
            />

            {showHint && currentQuestion?.hintVi ? (
              <View style={styles.hintBox}>
                <Text style={styles.hintText}>Gợi ý: {currentQuestion.hintVi}</Text>
              </View>
            ) : null}

            {phase === 'grading' ? (
              <View style={styles.gradingBox}>
                <Text style={styles.gradingLabel}>Câu trả lời của bạn</Text>
                <Text style={styles.gradingAnswer}>{userAnswer}</Text>
              </View>
            ) : null}

            {phase === 'feedback' && gradeResult ? (
              <View style={styles.feedbackWrap}>
                <ScoreFeedback
                  score={gradeResult.score}
                  shortFeedbackVi={gradeResult.shortFeedbackVi}
                  grammarFeedbackVi={gradeResult.grammarFeedbackVi}
                  vocabularyFeedbackVi={gradeResult.vocabularyFeedbackVi}
                  improvedAnswerZh={gradeResult.improvedAnswerZh}
                  improvedAnswerPinyin={gradeResult.improvedAnswerPinyin}
                  improvedAnswerVi={gradeResult.improvedAnswerVi}
                  suggestionVi={gradeResult.suggestionVi}
                />

                <View style={styles.nextButtonWrap}>
                  <AnimatedPressable style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>
                      {isLastRound ? 'Xem kết quả' : 'Câu tiếp theo'}
                    </Text>
                  </AnimatedPressable>
                </View>
              </View>
            ) : (
              <VoiceAnswerPanel
                value={userAnswer}
                onChangeText={setUserAnswer}
                isRecording={isRecording}
                isTranscribing={isTranscribing}
                isSpeaking={isSpeaking || phase === 'speaking'}
                isGrading={phase === 'grading'}
                hasRecording={!!recordingUri}
                recordingUri={recordingUri}
                onRecord={startRecording}
                onStopRecording={stopRecording}
                onReplay={handleReplayTts}
                onSubmit={() => void handleGrade()}
              />
            )}

            <FooterTrustNote />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

type MinimalProgressHeaderProps = {
  level: string;
  topicEmoji: string;
  topicVi: string;
  current: number;
  total: number;
  onBack: () => void;
};

function MinimalProgressHeader({
  level,
  topicEmoji,
  topicVi,
  current,
  total,
  onBack,
}: MinimalProgressHeaderProps) {
  const progress = total > 0 ? current / total : 0;
  const displayLevel = level.replace('HSK', 'HSK ');

  return (
    <View style={styles.header}>
      <AnimatedPressable
        accessibilityLabel="Đổi chủ đề"
        activeScale={0.94}
        style={styles.backButton}
        onPress={onBack}
      >
        <ChevronLeft color="#DCD5F7" size={18} strokeWidth={2} />
      </AnimatedPressable>

      <View style={styles.headerCopy}>
        <Text numberOfLines={1} style={styles.headerMeta}>
          {displayLevel} · {topicEmoji} {topicVi}
        </Text>
        <Text style={styles.headerRound}>Câu {current} / {total}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
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
  flex: {
    flex: 1,
  },
  centerGlow: {
    position: 'absolute',
    width: 430,
    height: 430,
    borderRadius: 215,
    top: 54,
    alignSelf: 'center',
    backgroundColor: 'rgba(109, 74, 255, 0.14)',
  },
  content: {
    minHeight: '100%',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 34,
  },
  contentCompact: {
    paddingTop: 6,
    paddingBottom: 26,
  },
  header: {
    width: '100%',
    maxWidth: 390,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.36)',
    backgroundColor: 'rgba(17, 10, 48, 0.58)',
  },
  headerCopy: {
    flex: 1,
  },
  headerMeta: {
    color: '#DCD5F7',
    fontSize: 12,
    fontWeight: '800',
  },
  headerRound: {
    marginTop: 3,
    color: '#A79ACF',
    fontSize: 11,
    fontWeight: '700',
  },
  progressTrack: {
    width: 76,
    height: 4,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.11)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.yellow,
  },
  stage: {
    width: '100%',
    maxWidth: 390,
    height: 466,
    marginTop: 20,
    alignItems: 'center',
  },
  stageCompact: {
    height: 452,
    marginTop: 8,
  },
  avatarSlot: {
    position: 'absolute',
    top: 78,
    zIndex: 2,
  },
  avatarSlotCompact: {
    top: 66,
  },
  questionCardSlot: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 178,
    zIndex: 3,
    alignItems: 'center',
  },
  hintBox: {
    width: '100%',
    maxWidth: 390,
    marginTop: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(245, 200, 75, 0.28)',
    backgroundColor: 'rgba(245, 200, 75, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  hintText: {
    color: '#E9DDF8',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },
  gradingBox: {
    width: '100%',
    maxWidth: 390,
    marginTop: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.28)',
    backgroundColor: 'rgba(17, 10, 48, 0.62)',
    padding: 14,
  },
  gradingLabel: {
    color: '#A79ACF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  gradingAnswer: {
    marginTop: 7,
    color: COLORS.textPrimary,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '700',
  },
  feedbackWrap: {
    width: '100%',
    maxWidth: 426,
  },
  nextButtonWrap: {
    width: '100%',
    maxWidth: 390,
    paddingHorizontal: 18,
  },
  nextButton: {
    marginTop: 16,
    borderRadius: 999,
    backgroundColor: COLORS.yellow,
    borderWidth: 1,
    borderColor: 'rgba(245, 200, 75, 0.6)',
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: COLORS.yellow,
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  nextButtonText: {
    color: '#1A1233',
    fontSize: 14,
    fontWeight: '800',
  },
});
