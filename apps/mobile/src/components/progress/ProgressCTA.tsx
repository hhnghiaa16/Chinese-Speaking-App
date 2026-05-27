import { Pressable, StyleSheet, Text } from 'react-native';

import { COLORS } from '../../theme/colors';

type ProgressCTAProps = {
  onPress: () => void;
};

export function ProgressCTA({ onPress }: ProgressCTAProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Tiếp tục luyện tập →</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    backgroundColor: COLORS.yellow,
    paddingVertical: 15,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  text: {
    color: '#1A1233',
    fontSize: 14,
    fontWeight: '700',
  },
});
