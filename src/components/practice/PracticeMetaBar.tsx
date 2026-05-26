import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';

type PracticeMetaBarProps = {
  level: string;
  topicEmoji: string;
  topicVi: string;
  current: number;
  total: number;
  onChangeTopic: () => void;
};

export function PracticeMetaBar({
  level,
  topicEmoji,
  topicVi,
  current,
  total,
  onChangeTopic,
}: PracticeMetaBarProps) {
  const displayLevel = level.replace('HSK', 'HSK ');

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.metaLabel}>
          {displayLevel} · {topicEmoji} {topicVi.toUpperCase()}
        </Text>
        <Pressable hitSlop={8} onPress={onChangeTopic}>
          <Text style={styles.changeTopicText}>← Đổi chủ đề</Text>
        </Pressable>
      </View>

      <Text style={styles.questionCount}>
        Câu {current} / {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '700',
    flex: 1,
    paddingRight: 12,
  },
  changeTopicText: {
    color: '#C6BFE6',
    fontSize: 12,
  },
  questionCount: {
    color: '#B9B0E4',
    fontSize: 13,
    marginTop: 4,
  },
});
