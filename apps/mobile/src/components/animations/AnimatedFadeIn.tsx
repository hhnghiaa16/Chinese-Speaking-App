import { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  index: number;
  style?: StyleProp<ViewStyle>;
  delayPerItem?: number;
};

export function AnimatedFadeIn({ children, index, style, delayPerItem = 100 }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * delayPerItem,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * delayPerItem,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY, delayPerItem]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
