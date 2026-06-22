import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeHeader } from '../components/home/HomeHeader';
import { AnswerInputCard } from '../components/practice/AnswerInputCard';
import { PlaybackControls } from '../components/practice/PlaybackControls';
import { PracticeActions } from '../components/practice/PracticeActions';
import { PracticeMetaBar } from '../components/practice/PracticeMetaBar';
import { RecordingWaveform } from '../components/practice/RecordingWaveform';
import { PracticeProgressBar } from '../components/practice/PracticeProgressBar';
import { ScoreFeedback } from '../components/practice/ScoreFeedback';
import {
  GeneratedQuestionDto,
  GradeAnswerApiDto,
  generateQuestionFromApi,
  gradeWithAiInline,
  transcribeAudioFromApi,
} from '../services/api/practiceApi';
import { synthesizeSpeechFromApi } from '../services/api/ttsApi';
import { COLORS } from '../theme/colors';
import { serifFont } from '../theme/typography';
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

  // Sinh câu hỏi mới
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
        setPhase('answering'); // fallback — vẫn cho phép nhập tay
      }
    },
    [level, topic, topicVi],
  );

  // Phát TTS khi phase chuyển sang 'speaking'
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
        // TTS thất bại → không block, chỉ dùng text
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

  // Bắt đầu round đầu tiên khi mount
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
      // Kết thúc phiên — tính điểm trung bình và navigate
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

  // --- Recording ---
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

    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    await audioRecorder.stop();
    await setAudioModeAsync({ allowsRecording: false });

    const uri = audioRecorder.uri;

    if (!uri) {
      Alert.alert('Lỗi ghi âm', 'Chưa thể lấy file ghi âm. Bạn có thể nhập câu trả lời bằng text.');
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
    } catch {
      setIsRecording(false);
      Alert.alert('Lỗi ghi âm', 'Chưa thể ghi âm. Bạn có thể nhập câu trả lời bằng text.');
    }
  };

  const isLastRound = currentRound >= TOTAL_ROUNDS;

  // --- Render helpers ---

  function renderGenerating() {
    return (
      <View style={styles.centeredState}>
        <ActivityIndicator color={COLORS.purpleLight} size="large" />
        <Text style={styles.centeredStateText}>AI đang tạo câu hỏi...</Text>
      </View>
    );
  }

  function renderQuestion() {
    if (!currentQuestion) return null;

    return (
      <View style={styles.questionCard}>
        <View style={styles.questionRow}>
          <Text style={styles.questionZh}>{currentQuestion.questionZh}</Text>
          <Pressable
            style={[styles.speakerBtn, isSpeaking && styles.speakerBtnDisabled]}
            onPress={handleReplayTts}
            disabled={isSpeaking}
          >
            <Text style={styles.speakerIcon}>{isSpeaking ? '🔊' : '🔈'}</Text>
          </Pressable>
        </View>

        {currentQuestion.questionPinyin ? (
          <Text style={styles.pinyin}>{currentQuestion.questionPinyin}</Text>
        ) : null}

        {currentQuestion.questionVi ? (
          <Text style={styles.meaningVi}>{currentQuestion.questionVi}</Text>
        ) : null}
      </View>
    );
  }

  function renderSpeakingOverlay() {
    return (
      <View style={styles.speakingOverlay}>
        <ActivityIndicator color={COLORS.purpleLight} />
        <Text style={styles.speakingText}>Đang đọc câu hỏi...</Text>
      </View>
    );
  }

  function renderAnswerArea() {
    return (
      <>
        <AnswerInputCard value={userAnswer} onChangeText={setUserAnswer} />

        {recordingUri && !isRecording && !isTranscribing ? (
          <PlaybackControls uri={recordingUri} />
        ) : null}

        {isRecording ? (
          <RecordingWaveform isRecording={isRecording} onStop={handleRecord} />
        ) : (
          <PracticeActions
            hasScored={false}
            isGrading={false}
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            isLastQuestion={isLastRound}
            hasRecording={!!recordingUri}
            onRecord={() => void handleRecord()}
            onToggleHint={() => setShowHint((prev) => !prev)}
            onToggleSample={() => Alert.alert('Thông báo', 'Hội thoại AI hiện chưa có câu mẫu.')}
            onScore={() => void handleGrade()}
            onNext={() => {}}
            onResult={() => {}}
          />
        )}

        {isTranscribing ? (
          <View style={styles.voiceStatus}>
            <Text style={styles.voiceStatusText}>Đang nhận diện giọng nói...</Text>
          </View>
        ) : null}

        {showHint && currentQuestion?.hintVi ? (
          <View style={styles.hintBox}>
            <Text style={styles.hintText}>Gợi ý: {currentQuestion.hintVi}</Text>
          </View>
        ) : null}
      </>
    );
  }

  function renderGrading() {
    return (
      <View style={styles.centeredState}>
        <ActivityIndicator color={COLORS.yellow} />
        <Text style={styles.centeredStateText}>AI đang chấm bài...</Text>
      </View>
    );
  }

  function renderFeedback() {
    if (!gradeResult) return null;

    return (
      <>
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

        <Pressable style={styles.btnNext} onPress={handleNext}>
          <Text style={styles.btnNextText}>
            {isLastRound ? 'Xem kết quả →' : 'Câu tiếp theo →'}
          </Text>
        </Pressable>
      </>
    );
  }

  function renderGenerateError() {
    return (
      <View style={styles.errorBox}>
        <Text style={styles.errorText}>Không thể tải câu hỏi. Thử lại?</Text>
        <Pressable
          style={styles.retryBtn}
          onPress={() => void generateNextQuestion(askedQuestions)}
        >
          <Text style={styles.retryBtnText}>Thử lại</Text>
        </Pressable>
      </View>
    );
  }

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
              topicEmoji={topicEmoji}
              topicVi={topicVi}
              current={currentRound}
              total={TOTAL_ROUNDS}
              onChangeTopic={() => navigation.navigate('Topic', { level })}
            />

            {/* Badge mode AI */}
            <View style={styles.modeBadge}>
              <Text style={styles.modeBadgeText}>✦ Hội thoại AI</Text>
            </View>

            <PracticeProgressBar current={currentRound} total={TOTAL_ROUNDS} />

            {/* Nội dung theo phase */}
            {phase === 'generating' && renderGenerating()}

            {generateError && phase === 'answering' && renderGenerateError()}

            {currentQuestion && phase !== 'generating' && renderQuestion()}

            {phase === 'speaking' && renderSpeakingOverlay()}

            {phase === 'answering' && !generateError && renderAnswerArea()}

            {phase === 'grading' && renderGrading()}

            {phase === 'feedback' && renderFeedback()}
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
    paddingBottom: 80,
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
    backgroundColor: 'rgba(109, 74, 255, 0.12)',
    top: 520,
    right: -120,
  },
  modeBadge: {
    alignSelf: 'flex-start',
    marginHorizontal: 18,
    marginTop: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.4)',
    backgroundColor: 'rgba(109, 74, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  modeBadgeText: {
    color: COLORS.purpleLight,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  questionCard: {
    marginTop: 24,
    marginHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.3)',
    backgroundColor: 'rgba(11, 8, 36, 0.92)',
    padding: 26,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  questionZh: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 32,
    lineHeight: 42,
    fontFamily: serifFont,
    fontWeight: '700',
    paddingRight: 14,
  },
  speakerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.3)',
    backgroundColor: 'rgba(45, 10, 145, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerBtnDisabled: {
    opacity: 0.4,
  },
  speakerIcon: {
    fontSize: 16,
  },
  pinyin: {
    marginTop: 16,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  meaningVi: {
    marginTop: 6,
    color: COLORS.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },
  speakingOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 18,
    marginTop: 16,
  },
  speakingText: {
    color: COLORS.purpleLight,
    fontSize: 13,
  },
  centeredState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  centeredStateText: {
    color: COLORS.textSecondary,
    fontSize: 13,
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
  btnNext: {
    marginHorizontal: 18,
    marginTop: 16,
    borderRadius: 999,
    backgroundColor: COLORS.yellow,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnNextText: {
    color: '#1A1233',
    fontSize: 14,
    fontWeight: '700',
  },
  voiceStatus: {
    alignSelf: 'flex-start',
    marginHorizontal: 18,
    marginTop: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245, 200, 75, 0.28)',
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
  errorBox: {
    marginHorizontal: 18,
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 115, 0.3)',
    backgroundColor: 'rgba(249, 115, 115, 0.08)',
    padding: 16,
    gap: 12,
  },
  errorText: {
    color: '#F97373',
    fontSize: 13,
  },
  retryBtn: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: 'rgba(249, 115, 115, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 115, 0.35)',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  retryBtnText: {
    color: '#F97373',
    fontSize: 12,
    fontWeight: '700',
  },
});
