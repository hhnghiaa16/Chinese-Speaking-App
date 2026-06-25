import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

type HaloRingsProps = {
  active: boolean;
  mode: 'idle' | 'speaking' | 'thinking' | 'recording';
  size?: number;
};

export function HaloRings({ active, mode, size = 238 }: HaloRingsProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.75)).current;

  useEffect(() => {
    if (!active) {
      scale.setValue(1);
      opacity.setValue(0.75);
      return;
    }

    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.06,
            duration: mode === 'recording' ? 620 : 1100,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: mode === 'recording' ? 620 : 1100,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: mode === 'recording' ? 620 : 1100,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.62,
            duration: mode === 'recording' ? 620 : 1100,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [active, mode, opacity, scale]);

  const innerSize = size * 0.68;

  return (
    <View pointerEvents="none" style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.outerRing, { width: size, height: size, borderRadius: size / 2 }]} />
      <Animated.View
        style={[
          styles.innerRing,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            opacity,
            transform: [{ scale }],
          },
        ]}
      />
      <View
        style={[
          styles.innerDisk,
          {
            width: innerSize * 0.9,
            height: innerSize * 0.9,
            borderRadius: (innerSize * 0.9) / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    backgroundColor: 'rgba(109, 74, 255, 0.04)',
  },
  innerRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(168, 117, 255, 0.9)',
    backgroundColor: 'rgba(109, 74, 255, 0.08)',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  innerDisk: {
    position: 'absolute',
    backgroundColor: '#10092B',
  },
});
