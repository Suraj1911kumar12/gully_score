/**
 * GullyScore Reusable AppBadge Component
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppText } from './AppText';

export type BadgeVariant =
  | 'live'
  | 'ready'
  | 'draft'
  | 'completed'
  | 'accent'
  | 'accentSecondary'
  | 'danger'
  | 'warning'
  | 'muted';

export interface AppBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const AppBadge: React.FC<AppBadgeProps> = ({
  label,
  variant = 'accent',
  size = 'md',
  style,
}) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'live':
        return { bg: colors.dangerMuted, text: colors.danger, border: colors.danger };
      case 'ready':
        return { bg: colors.accentPrimaryMuted, text: colors.accentPrimary, border: colors.accentPrimary };
      case 'draft':
        return { bg: colors.warningMuted, text: colors.warning, border: colors.warning };
      case 'completed':
        return { bg: colors.accentSecondaryMuted, text: colors.accentSecondary, border: colors.accentSecondary };
      case 'danger':
        return { bg: colors.dangerMuted, text: colors.danger, border: colors.danger };
      case 'warning':
        return { bg: colors.warningMuted, text: colors.warning, border: colors.warning };
      case 'accentSecondary':
        return { bg: colors.accentSecondaryMuted, text: colors.accentSecondary, border: colors.accentSecondary };
      case 'muted':
      default:
        return { bg: colors.surfaceHover, text: colors.textSecondary, border: colors.borderLight };
    }
  };

  const current = getBadgeStyle();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: current.bg,
          borderColor: current.border,
        },
        size === 'sm' ? styles.sm : styles.md,
        style,
      ]}
    >
      <AppText
        variant="caption"
        weight="bold"
        style={[
          styles.text,
          { color: current.text },
          size === 'sm' ? styles.textSm : styles.textMd,
        ]}
      >
        {label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  md: {
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
  },
  text: {
    textTransform: 'uppercase',
  },
  textSm: {
    fontSize: 10,
  },
  textMd: {
    fontSize: 11,
  },
});
