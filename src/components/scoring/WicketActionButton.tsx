/**
 * GullyScore WicketActionButton Component
 */

import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppText } from '../ui/AppText';
import { AlertCircle } from 'lucide-react-native';
import { appHaptics } from '../../utils/haptics';

export interface WicketActionButtonProps {
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export const WicketActionButton: React.FC<WicketActionButtonProps> = ({
  onPress,
  disabled = false,
  style,
}) => {
  return (
    <Pressable
      onPress={() => {
        if (disabled) return;
        appHaptics.heavy();
        onPress();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Wicket dismissal"
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <AlertCircle size={18} color={colors.textPrimary} />
      <AppText variant="title" weight="heavy" color="primary" style={styles.text}>
        FALL OF WICKET
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    letterSpacing: 1,
  },
});
