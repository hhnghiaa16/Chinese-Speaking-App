import { RefreshCcw, Volume2 } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedBouncingDots } from '../animations/AnimatedBouncingDots';
import { AnimatedPressable } from '../common/AnimatedPressable';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';

export type QuestionChip = {
  zh: string;
  pinyin?: string;
  vi: string;
};

type QuestionCardProps = {
  questionZh?: string;
  questionPinyin?: string;
  questionVi?: string;
  isSpeaking: boolean;
  isLoading: boolean;
  error?: boolean;
  chips?: QuestionChip[];
  onReplay: () => void;
  onRetry?: () => void;
};

export function QuestionCard({
  questionZh,
  questionPinyin,
  questionVi,
  isSpeaking,
  isLoading,
  error,
  chips = [],
  onReplay,
  onRetry,
}: QuestionCardProps) {
  if (error) {
    return (
      <View style={[styles.card, styles.errorCard]}>
        <Text style={styles.label}>LỖI · ERROR</Text>
        <Text style={styles.errorTitle}>Không thể tải câu hỏi</Text>
        <Text style={styles.errorCopy}>Bạn có thể thử tạo lại câu hỏi để tiếp tục luyện nói.</Text>
        <AnimatedPressable style={styles.retryButton} onPress={onRetry}>
          <RefreshCcw color={COLORS.textPrimary} size={15} strokeWidth={1.9} />
          <Text style={styles.retryText}>Thử lại</Text>
        </AnimatedPressable>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.label}>{isLoading ? 'ĐANG TẠO · 生成' : 'CÂU HỎI · 问句'}</Text>
        <AnimatedPressable
          accessibilityLabel="Nghe lại câu hỏi"
          activeScale={0.9}
          disabled={isLoading || !questionZh || isSpeaking}
          style={[styles.soundButton, isSpeaking && styles.soundButtonActive]}
          onPress={onReplay}
        >
          <Volume2 color={isSpeaking ? COLORS.yellow : '#DCD5F7'} size={15} strokeWidth={1.9} />
        </AnimatedPressable>
      </View>

      {isLoading ? (
        <View style={styles.loadingContent}>
          <AnimatedBouncingDots color={COLORS.yellow} size={10} />
          <Text style={styles.loadingText}>AI đang chuẩn bị câu hỏi...</Text>
        </View>
      ) : (
        <>
          {questionPinyin ? <Text style={styles.pinyin}>{questionPinyin.toUpperCase()}</Text> : null}
          <Text numberOfLines={3} adjustsFontSizeToFit minimumFontScale={0.72} style={styles.zhText}>
            {questionZh}
          </Text>
          {questionVi ? <Text style={styles.viText}>“{questionVi}”</Text> : null}

          {chips.length > 0 ? (
            <View style={styles.chipWrap}>
              {chips.slice(0, 3).map((chip) => (
                <View key={`${chip.zh}-${chip.vi}`} style={styles.chip}>
                  <Text numberOfLines={1} style={styles.chipText}>
                    {chip.zh}
                    {chip.pinyin ? ` ${chip.pinyin}` : ''} · {chip.vi}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 390,
    minHeight: 258,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.52)',
    backgroundColor: 'rgba(17, 10, 48, 0.94)',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 18,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.28,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  errorCard: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  topRow: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.07)',
    color: '#B9AEDC',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  soundButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  soundButtonActive: {
    backgroundColor: 'rgba(245, 200, 75, 0.18)',
    borderColor: 'rgba(245, 200, 75, 0.35)',
  },
  loadingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#D7CFF4',
    fontSize: 13,
    fontWeight: '700',
  },
  pinyin: {
    marginTop: 10,
    color: '#A79ACF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
  },
  zhText: {
    marginTop: 8,
    color: COLORS.yellow,
    fontFamily: serifFont,
    fontSize: 45,
    lineHeight: 54,
    fontWeight: '700',
    textAlign: 'center',
  },
  viText: {
    marginTop: 9,
    color: '#E9DDF8',
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
  },
  chipWrap: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    maxWidth: '100%',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  chipText: {
    color: '#C9BFE8',
    fontSize: 11,
    fontWeight: '600',
  },
  errorTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  errorCopy: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  retryText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
});
