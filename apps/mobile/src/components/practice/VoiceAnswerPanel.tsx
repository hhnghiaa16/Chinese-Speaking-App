import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic, Pause, Play, Send, Square, Volume2 } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';

import { AnimatedPressable } from '../common/AnimatedPressable';

import { COLORS } from '../../theme/colors';

type VoiceAnswerPanelProps = {
  value: string;
  onChangeText: (text: string) => void;
  isRecording: boolean;
  isTranscribing: boolean;
  isSpeaking: boolean;
  isGrading: boolean;
  hasRecording: boolean;
  recordingUri?: string | null;
  onRecord: () => void;
  onStopRecording: () => void;
  onReplay: () => void;
  onSubmit: () => void;
};

export function VoiceAnswerPanel({
  value,
  onChangeText,
  isRecording,
  isTranscribing,
  isSpeaking,
  isGrading,
  recordingUri,
  onRecord,
  onStopRecording,
  onReplay,
  onSubmit,
}: VoiceAnswerPanelProps) {
  const pulse = useRef(new Animated.Value(1)).current;
  const disabled = isSpeaking || isTranscribing || isGrading;
  const canSubmit = value.trim().length > 0 && !disabled && !isRecording;

  useEffect(() => {
    if (!isRecording) {
      pulse.setValue(1);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.16,
          duration: 620,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 620,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [isRecording, pulse]);

  const placeholder = isRecording
    ? 'Đang nghe bạn nói...'
    : isTranscribing
      ? 'Đang nhận diện giọng nói...'
      : 'Gõ câu trả lời hoặc nhấn để nói...';

  return (
    <View style={styles.panel}>
      <View style={styles.inputShell}>
        <TextInput
          accessibilityLabel="Câu trả lời của bạn"
          editable={!isGrading && !isRecording}
          placeholder={placeholder}
          placeholderTextColor="#756A98"
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
        />
        <AnimatedPressable
          accessibilityLabel="Gửi câu trả lời để chấm điểm"
          activeScale={0.92}
          disabled={!canSubmit}
          style={[styles.sendButton, !canSubmit && styles.disabledControl]}
          onPress={onSubmit}
        >
          <Send color={canSubmit ? '#ECE7FF' : '#756A98'} size={17} strokeWidth={1.9} />
        </AnimatedPressable>
      </View>

      {recordingUri && !isRecording ? <UserRecordingPlayback uri={recordingUri} /> : null}

      <View style={styles.controls}>
        <AnimatedPressable
          accessibilityLabel="Nghe lại câu hỏi"
          activeScale={0.96}
          disabled={isSpeaking || isGrading}
          style={[styles.sideAction, (isSpeaking || isGrading) && styles.disabledControl]}
          onPress={onReplay}
        >
          <Volume2 color="#C9BFE8" size={14} strokeWidth={1.8} />
          <Text style={styles.sideActionText}>Câu hỏi</Text>
        </AnimatedPressable>

        <Animated.View style={[styles.micPulse, isRecording && { transform: [{ scale: pulse }] }]}>
          <AnimatedPressable
            accessibilityLabel={isRecording ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
            activeScale={0.92}
            disabled={disabled}
            style={[styles.micButton, disabled && styles.disabledControl]}
            onPress={isRecording ? onStopRecording : onRecord}
          >
            <LinearGradient
              colors={isRecording ? ['#F97373', '#A855F7'] : ['#A855F7', '#6D4AFF']}
              style={styles.micGradient}
            >
              {isRecording ? (
                <Square color={COLORS.white} size={20} fill={COLORS.white} />
              ) : (
                <Mic color={COLORS.white} size={22} strokeWidth={2} />
              )}
            </LinearGradient>
          </AnimatedPressable>
        </Animated.View>

        <View style={styles.sideAction}>
          <Volume2 color="#C9BFE8" size={14} strokeWidth={1.8} />
          <Text style={styles.sideActionText}>Tốc độ 0.8×</Text>
        </View>
      </View>
    </View>
  );
}

function UserRecordingPlayback({ uri }: { uri: string }) {
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);

  const isLoaded = status.isLoaded;
  const duration = isLoaded ? Math.max(0, Math.floor(status.duration / 1000)) : 0;
  const position = isLoaded ? Math.max(0, Math.floor(status.currentTime / 1000)) : 0;
  const progress = isLoaded && status.duration > 0 ? Math.min(status.currentTime / status.duration, 1) : 0;
  const label = `${formatTime(position)} / ${formatTime(duration)}`;

  const handleToggle = async () => {
    if (!isLoaded) return;

    if (player.playing) {
      player.pause();
      return;
    }

    if (status.didJustFinish) {
      player.seekTo(0);
    }

    await setAudioModeAsync({
      allowsRecording: false,
      playsInSilentMode: true,
      shouldRouteThroughEarpiece: false,
    });
    player.play();
  };

  return (
    <View style={styles.recordingPlayback}>
      <AnimatedPressable
        accessibilityLabel={player.playing ? 'Tạm dừng bản ghi của bạn' : 'Nghe lại bản ghi của bạn'}
        activeScale={0.92}
        disabled={!isLoaded}
        style={[styles.recordingPlayButton, !isLoaded && styles.disabledControl]}
        onPress={handleToggle}
      >
        {player.playing ? (
          <Pause color={COLORS.white} fill={COLORS.white} size={15} />
        ) : (
          <Play color={COLORS.white} fill={COLORS.white} size={15} style={{ marginLeft: 2 }} />
        )}
      </AnimatedPressable>

      <View style={styles.recordingMeta}>
        <Text style={styles.recordingTitle}>Bản ghi của bạn</Text>
        <View style={styles.recordingTrack}>
          <View style={[styles.recordingFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <Text style={styles.recordingTime}>{label}</Text>
    </View>
  );
}

function formatTime(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    maxWidth: 390,
    marginTop: 12,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.52)',
    backgroundColor: 'rgba(17, 10, 48, 0.82)',
    padding: 12,
    paddingBottom: 18,
  },
  inputShell: {
    height: 56,
    borderRadius: 22,
    backgroundColor: 'rgba(5, 3, 22, 0.58)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    paddingVertical: 0,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.22)',
  },
  recordingPlayback: {
    minHeight: 46,
    marginTop: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.26)',
    backgroundColor: 'rgba(255,255,255,0.045)',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recordingPlayButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(109, 74, 255, 0.72)',
  },
  recordingMeta: {
    flex: 1,
    gap: 6,
  },
  recordingTitle: {
    color: '#DCD5F7',
    fontSize: 11,
    fontWeight: '800',
  },
  recordingTrack: {
    height: 3,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  recordingFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.yellow,
  },
  recordingTime: {
    width: 74,
    color: '#A79ACF',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  controls: {
    minHeight: 70,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideAction: {
    width: 112,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  sideActionText: {
    color: '#C9BFE8',
    fontSize: 12,
    fontWeight: '700',
  },
  micPulse: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(168, 85, 247, 0.14)',
  },
  micButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    shadowColor: '#A855F7',
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  micGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledControl: {
    opacity: 0.45,
  },
});
