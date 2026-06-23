import { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  minScale?: number;
  maxScale?: number;
  duration?: number;
};

export function AnimatedBreathing({
  children,
  style,
  minScale = 0.95,
  maxScale = 1.05,
  duration = 1000,
}: Props) {
  const scale = useRef(new Animated.Value(minScale)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: maxScale,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: minScale,
          duration,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [scale, minScale, maxScale, duration]);

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
}
