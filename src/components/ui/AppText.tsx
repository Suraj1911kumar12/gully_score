/**
 * GullyScore Reusable AppText Component
 */

import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { colors, typography } from '../../theme';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'title'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'scoreboard'
  | 'scoreboardLg';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'accent'
  | 'accentSecondary'
  | 'danger'
  | 'warning'
  | 'inverse';

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: TextColor;
  weight?: keyof typeof typography.fontWeight;
  align?: TextStyle['textAlign'];
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color = 'primary',
  weight,
  align = 'left',
  style,
  children,
  ...rest
}) => {
  const textColor = {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    accent: colors.accentPrimary,
    accentSecondary: colors.accentSecondary,
    danger: colors.danger,
    warning: colors.warning,
    inverse: colors.textInverse,
  }[color];

  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        { color: textColor, textAlign: align },
        weight && { fontWeight: typography.fontWeight[weight] },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    letterSpacing: typography.letterSpacing.normal,
  },
  h1: {
    fontSize: typography.fontSize['3xl'],
    lineHeight: typography.lineHeight['3xl'],
    fontWeight: typography.fontWeight.heavy,
    letterSpacing: typography.letterSpacing.tight,
  },
  h2: {
    fontSize: typography.fontSize['2xl'],
    lineHeight: typography.lineHeight['2xl'],
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  h3: {
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.xl,
    fontWeight: typography.fontWeight.semibold,
  },
  title: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontWeight: typography.fontWeight.semibold,
  },
  body: {
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.base,
    fontWeight: typography.fontWeight.regular,
  },
  bodySmall: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.regular,
  },
  caption: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.wide,
  },
  label: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider,
  },
  scoreboard: {
    fontSize: typography.fontSize.scoreboard,
    lineHeight: typography.lineHeight.scoreboard,
    fontWeight: typography.fontWeight.heavy,
    letterSpacing: typography.letterSpacing.tight,
  },
  scoreboardLg: {
    fontSize: typography.fontSize.scoreboardLg,
    lineHeight: typography.lineHeight.scoreboard,
    fontWeight: typography.fontWeight.black,
    letterSpacing: typography.letterSpacing.tight,
  },
});
