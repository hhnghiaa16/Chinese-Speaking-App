import { CheckCircle2, ChevronRight, MessageSquare, Star, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';

type ScoreFeedbackProps = {
  score: number;
  shortFeedbackVi: string;
  grammarFeedbackVi: string;
  vocabularyFeedbackVi: string;
  improvedAnswerZh: string;
  improvedAnswerPinyin: string;
  improvedAnswerVi: string;
  suggestionVi: string;
};

export function ScoreFeedback({
  score,
  shortFeedbackVi,
  grammarFeedbackVi,
  vocabularyFeedbackVi,
  improvedAnswerZh,
  improvedAnswerPinyin,
  improvedAnswerVi,
  suggestionVi,
}: ScoreFeedbackProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let rAF: ReturnType<typeof requestAnimationFrame>;
    const duration = 1000;
    const startTime = Date.now();

    const tick = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setDisplayScore(Math.round(score * easeOut * 10) / 10);
      
      if (progress < 1) {
        rAF = requestAnimationFrame(tick);
      } else {
        setDisplayScore(score);
      }
    };
    
    rAF = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rAF);
  }, [score]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>{displayScore.toFixed(1)}</Text>
          <Text style={styles.scoreMax}>/10</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.shortFeedback}>{shortFeedbackVi}</Text>
        </View>
      </View>

      {/* Cải thiện câu trả lời */}
      {improvedAnswerZh ? (
        <View style={styles.card}>
          <View style={styles.cardTitle}>
            <Star color={COLORS.yellow} size={16} />
            <Text style={styles.cardTitleText}>CÂU GỢI Ý (TỐT HƠN)</Text>
          </View>
          <Text style={styles.zhText}>{improvedAnswerZh}</Text>
          {improvedAnswerPinyin ? (
            <Text style={styles.pinyinText}>{improvedAnswerPinyin}</Text>
          ) : null}
          {improvedAnswerVi ? (
            <Text style={styles.viText}>{improvedAnswerVi}</Text>
          ) : null}
        </View>
      ) : null}

      {/* Nhận xét chi tiết */}
      <View style={styles.card}>
        <View style={styles.cardTitle}>
          <MessageSquare color={COLORS.purple} size={16} />
          <Text style={styles.cardTitleText}>NHẬN XÉT CHI TIẾT</Text>
        </View>
        <View style={styles.feedbackRow}>
          <CheckCircle2 color="#34D399" size={14} />
          <Text style={styles.feedbackText}>
            <Text style={{ fontWeight: '700' }}>Từ vựng: </Text>
            {vocabularyFeedbackVi}
          </Text>
        </View>
        <View style={styles.feedbackRow}>
          <Zap color={COLORS.yellow} size={14} />
          <Text style={styles.feedbackText}>
            <Text style={{ fontWeight: '700' }}>Ngữ pháp: </Text>
            {grammarFeedbackVi}
          </Text>
        </View>
        <View style={styles.feedbackRow}>
          <ChevronRight color={COLORS.textSecondary} size={14} />
          <Text style={styles.feedbackText}>
            <Text style={{ fontWeight: '700' }}>Lời khuyên: </Text>
            {suggestionVi}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
    marginTop: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 6,
  },
  scoreCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 200, 75, 0.1)',
  },
  scoreValue: {
    color: COLORS.yellow,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 24,
  },
  scoreMax: {
    color: COLORS.yellow,
    fontSize: 11,
    opacity: 0.6,
  },
  headerText: {
    flex: 1,
  },
  shortFeedback: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  card: {
    backgroundColor: 'rgba(11, 8, 36, 0.6)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  cardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitleText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  zhText: {
    color: COLORS.yellow,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  pinyinText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    marginBottom: 8,
  },
  viText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  feedbackText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});
