import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../../theme/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  progress: number; // 0 - 100
  radius: number;
  strokeWidth: number;
};

export function AnimatedProgressCircle({ progress, radius, strokeWidth }: Props) {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Animate from 0 to target progress
    Animated.timing(animatedProgress, {
      toValue: Math.min(Math.max(progress, 0), 100),
      duration: 1200, // 1.2s to draw the circle
      useNativeDriver: false, // strokeDashoffset cannot be animated natively
    }).start();
  }, [progress, animatedProgress]);

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <Svg width={(radius + strokeWidth) * 2} height={(radius + strokeWidth) * 2}>
      <Circle
        stroke="rgba(255,255,255,0.1)"
        cx={radius + strokeWidth}
        cy={radius + strokeWidth}
        r={radius}
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <AnimatedCircle
        stroke={COLORS.yellow}
        cx={radius + strokeWidth}
        cy={radius + strokeWidth}
        r={radius}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${radius + strokeWidth} ${radius + strokeWidth})`}
      />
    </Svg>
  );
}
