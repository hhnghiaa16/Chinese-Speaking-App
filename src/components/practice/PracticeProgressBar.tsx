import { StyleSheet, View } from 'react-native';

import { COLORS } from '../../theme/colors';

type PracticeProgressBarProps = {
  current: number;
  total: number;
};

export function PracticeProgressBar({ current, total }: PracticeProgressBarProps) {
  const progress = total > 0 ? current / total : 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 18,
    marginTop: 14,
  },
  track: {
    height: 3,
    backgroundColor: '#15112E',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: 3,
    backgroundColor: COLORS.yellow,
    borderRadius: 999,
  },
});
