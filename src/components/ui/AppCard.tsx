/**
 * GullyScore Reusable AppCard Component
 */

import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle, PressableProps } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { appHaptics } from '../../utils/haptics';

export interface AppCardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'secondary' | 'outline' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  activeOpacity?: number;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  variant = 'elevated',
  padding = 'md',
  onPress,
  style,
}) => {
  const handlePress = () => {
    if (!onPress) return;
    appHaptics.light();
    onPress();
  };

  const cardStyles = [
    styles.base,
    styles[variant],
    styles[`pad_${padding}`],
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          cardStyles,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  elevated: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
  },
  secondary: {
    backgroundColor: colors.surfaceSecondary,
    borderColor: colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.borderLight,
  },
  flat: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 0,
  },
  pad_none: {
    padding: 0,
  },
  pad_sm: {
    padding: spacing.sm,
  },
  pad_md: {
    padding: spacing.base,
  },
  pad_lg: {
    padding: spacing.xl,
  },
  pressed: {
    opacity: 0.85,
    borderColor: colors.borderLight,
  },
});
