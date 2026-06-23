import { Sparkles } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { serifFont } from '../../theme/typography';
import { scoreColor } from '../../theme/scoreColor';

type ScoreSummaryCardProps = {
  score: number;
};

export function ScoreSummaryCard({ score }: ScoreSummaryCardProps) {
  const sc = scoreColor(score);

  return (
    <View style={[styles.card, { borderColor: `${sc}40`, backgroundColor: `${sc}08` }]}>
      <View style={[styles.iconWrap, { backgroundColor: `${sc}18` }]}>
        <Sparkles color={sc} size={18} strokeWidth={1.8} />
      </View>
      <Text style={[styles.scoreValue, { color: sc }]}>{score.toFixed(1)}/10</Text>
      <Text style={styles.label}>Điểm phản xạ trung bình</Text>
      <Text style={styles.subtext}>Kết quả tạm tính cho phiên luyện hiện tại.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 24,
    marginBottom: 18,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 48,
    lineHeight: 56,
    fontFamily: serifFont,
    fontWeight: '700',
  },
  label: {
    color: '#F8F5FF',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 4,
  },
  subtext: {
    color: '#A8A0C8',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
});
