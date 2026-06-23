import { Mic } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';
import { scoreColor } from '../../theme/scoreColor';

export function PracticePreviewCard() {
  const demoScore = 9.0;
  const sc = scoreColor(demoScore);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.meta}>HSK 2 · ĂN UỐNG</Text>
        <View style={[styles.scoreBadge, { borderColor: `${sc}44`, backgroundColor: `${sc}14` }]}>
          <Text style={[styles.scoreText, { color: sc }]}>{demoScore.toFixed(1)}/10</Text>
        </View>
      </View>

      <Text style={styles.questionZh}>你昨天吃了什么？</Text>
      <Text style={styles.pinyin}>Nǐ zuótiān chī le shénme?</Text>
      <Text style={styles.meaning}>Hôm qua bạn ăn gì?</Text>

      <View style={styles.answerBox}>
        <Text style={styles.answerLabel}>BẠN NÓI</Text>
        <Text style={styles.answerZh}>我昨天吃了越南河粉。</Text>
        <Text style={styles.answerPinyin}>Wǒ zuótiān chī le Yuènán hé fěn.</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.micIconWrap}>
          <Mic color={COLORS.yellow} size={13} strokeWidth={2} />
        </View>
        <Text style={styles.footerText}>Ghi âm · AI chấm điểm · Gợi ý cải thiện</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 42,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.35)',
    backgroundColor: 'rgba(11, 8, 36, 0.92)',
    padding: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    color: COLORS.textMuted,
    fontSize: 11,
    letterSpacing: 1.4,
    fontWeight: '700',
  },
  scoreBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '700',
  },
  questionZh: {
    marginTop: 24,
    color: COLORS.textPrimary,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
    fontFamily: serifFont,
  },
  pinyin: {
    marginTop: 8,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  meaning: {
    marginTop: 6,
    color: COLORS.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },
  answerBox: {
    marginTop: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.28)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(5, 3, 22, 0.35)',
  },
  answerLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    letterSpacing: 1.4,
    fontWeight: '700',
    marginBottom: 8,
  },
  answerZh: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  answerPinyin: {
    marginTop: 4,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  micIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(245, 200, 75, 0.28)',
    backgroundColor: 'rgba(245, 200, 75, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
});
