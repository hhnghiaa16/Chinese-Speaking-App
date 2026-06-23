import { Zap } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';

type ProgressCTAProps = {
  onPress: () => void;
};

export function ProgressCTA({ onPress }: ProgressCTAProps) {
  return (
    <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.iconWrap}>
        <Zap color="#1A1233" size={16} strokeWidth={2} />
      </View>
      <Text style={styles.text}>Tiếp tục luyện tập</Text>
      <Text style={styles.arrow}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 18,
    backgroundColor: COLORS.yellow,
    paddingVertical: 16,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(26, 18, 51, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    color: '#1A1233',
    fontSize: 14,
    fontWeight: '700',
  },
  arrow: {
    color: '#1A1233',
    fontSize: 16,
    fontWeight: '700',
  },
});
