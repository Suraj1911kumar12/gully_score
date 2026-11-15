/**
 * GullyScore Design Tokens - Colors
 * Dark-first cricket-inspired color palette
 */

export const colors = {
  // Backgrounds
  background: '#080F1C',
  surfaceSecondary: '#111C2E',
  surfaceElevated: '#18263A',
  surfaceCard: '#0F1A2A',
  surfaceHover: '#1D2E44',

  // Accents
  accentPrimary: '#B8F34B',     // Volt Lime Green
  accentPrimaryMuted: '#B8F34B20',
  accentSecondary: '#39D5C3',   // Electric Cyan
  accentSecondaryMuted: '#39D5C320',

  // Text
  textPrimary: '#F5F8FC',
  textSecondary: '#95A3B8',
  textMuted: '#64748B',
  textInverse: '#080F1C',

  // Status & Feedback
  danger: '#FF647C',
  dangerMuted: '#FF647C20',
  warning: '#F5B942',
  warningMuted: '#F5B94220',
  success: '#22C55E',
  successMuted: '#22C55E20',
  info: '#38BDF8',
  infoMuted: '#38BDF820',

  // Structural & Borders
  border: '#263448',
  borderLight: '#344660',
  borderFocus: '#B8F34B',
  divider: '#1A2738',

  // Ball & Score specific
  ballDot: '#64748B',
  ballRun: '#38BDF8',
  ballFour: '#39D5C3',
  ballSix: '#B8F34B',
  ballWicket: '#FF647C',
  ballExtra: '#F5B942',

  // Overlay
  overlay: 'rgba(4, 8, 16, 0.75)',
  translucent: 'rgba(24, 38, 58, 0.65)',
} as const;

export type ColorToken = keyof typeof colors;
