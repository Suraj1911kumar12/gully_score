/**
 * GullyScore Design Tokens - Border Radius
 */

export const radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 10,
  lg: 16,
  xl: 22,
  '2xl': 30,
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
