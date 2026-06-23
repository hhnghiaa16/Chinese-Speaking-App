import { StyleSheet, View } from 'react-native';

import { StatCard } from './StatCard';

type StatsGridProps = {
  totalSessions: number;
  averageScore: number;
  totalQuestions: number;
  streakDays: number;
};

export function StatsGrid({
  totalSessions,
  averageScore,
  totalQuestions,
  streakDays,
}: StatsGridProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StatCard icon="sessions" value={totalSessions.toString()} label="Buổi luyện tập" />
        <StatCard icon="score" value={`${averageScore.toFixed(1)}/10`} label="Điểm trung bình" />
      </View>

      <View style={styles.row}>
        <StatCard icon="questions" value={totalQuestions.toString()} label="Câu đã luyện" />
        <StatCard icon="streak" value={`${streakDays} ngày`} label="Chuỗi luyện tập" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginBottom: 22,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
});
