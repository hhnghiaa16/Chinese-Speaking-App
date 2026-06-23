import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
  activeScale?: number;
}

export function AnimatedPressable({ 
  children, 
  style, 
  activeScale = 0.95,
  onPressIn,
  onPressOut,
  ...props 
}: AnimatedPressableProps) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = (e: any) => {
    Animated.spring(scaleValue, {
      toValue: activeScale,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
    onPressOut?.(e);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style as any}
        {...props}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
