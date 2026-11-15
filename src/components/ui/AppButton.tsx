/**
 * GullyScore Reusable AppButton Component
 * Supports micro-interaction press scaling, tactile haptics, and loading states
 */

import React, { useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Animated,
  ViewStyle,
  TextStyle,
  PressableProps,
} from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { AppText } from './AppText';
import { appHaptics } from '../../utils/haptics';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  onPress?: () => void;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  onPress,
  ...rest
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 0.97,
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
    if (disabled || loading) return;
    appHaptics.light();
    onPress?.();
  };

  const getTextColor = (): 'inverse' | 'primary' | 'accent' | 'secondary' => {
    if (variant === 'primary') return 'inverse';
    if (variant === 'outline') return 'accent';
    if (variant === 'ghost') return 'secondary';
    return 'primary';
  };

  const isDisabled = disabled || loading;

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        fullWidth && styles.fullWidth,
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        style={[
          styles.base,
          styles[variant],
          styles[size],
          isDisabled && styles.disabled,
          fullWidth && styles.fullWidth,
          style,
        ]}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? colors.textInverse : colors.accentPrimary}
          />
        ) : (
          <>
            {icon && iconPosition === 'left' ? <>{icon}</> : null}
            <AppText
              variant={size === 'sm' ? 'bodySmall' : 'title'}
              color={getTextColor()}
              weight="bold"
              style={[
                styles.title,
                icon && iconPosition === 'left' ? styles.iconMarginLeft : {},
                icon && iconPosition === 'right' ? styles.iconMarginRight : {},
                textStyle || {},
              ]}
            >
              {title}
            </AppText>
            {icon && iconPosition === 'right' ? <>{icon}</> : null}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  fullWidth: {
    width: '100%',
  },
  // Variants
  primary: {
    backgroundColor: colors.accentPrimary,
  },
  secondary: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.accentPrimary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.danger,
  },
  // Sizes
  sm: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  md: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  lg: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },
  disabled: {
    opacity: 0.5,
  },
  title: {
    textAlign: 'center',
  },
  iconMarginLeft: {
    marginLeft: spacing.sm,
  },
  iconMarginRight: {
    marginRight: spacing.sm,
  },
});
