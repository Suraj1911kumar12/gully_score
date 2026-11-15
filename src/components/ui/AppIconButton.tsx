/**
 * GullyScore Reusable AppIconButton Component
 */

import React, { useRef } from 'react';
import { Pressable, StyleSheet, Animated, ViewStyle, PressableProps } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { appHaptics } from '../../utils/haptics';

export interface AppIconButtonProps extends Omit<PressableProps, 'style'> {
  icon: React.ReactNode;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'surface' | 'ghost' | 'accent' | 'danger';
  style?: ViewStyle;
  accessibilityLabel: string;
}

export const AppIconButton: React.FC<AppIconButtonProps> = ({
  icon,
  onPress,
  size = 'md',
  variant = 'surface',
  style,
  disabled,
  accessibilityLabel,
  ...rest
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    appHaptics.light();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={[
          styles.base,
          styles[size],
          styles[variant],
          disabled && styles.disabled,
          style,
        ]}
        {...rest}
      >
        {icon}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  sm: {
    width: 36,
    height: 36,
  },
  md: {
    width: 44,
    height: 44,
  },
  lg: {
    width: 54,
    height: 54,
  },
  surface: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  accent: {
    backgroundColor: colors.accentPrimary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  disabled: {
    opacity: 0.4,
  },
});
