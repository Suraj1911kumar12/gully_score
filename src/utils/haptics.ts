/**
 * GullyScore Haptics Helper
 * Safe tactile feedback respecting user preferences
 */

import * as Haptics from 'expo-haptics';

let hapticsEnabled = true;

export function setHapticsEnabled(enabled: boolean) {
  hapticsEnabled = enabled;
}

export function isHapticsEnabled(): boolean {
  return hapticsEnabled;
}

export const appHaptics = {
  selection: async () => {
    if (!hapticsEnabled) return;
    try {
      await Haptics.selectionAsync();
    } catch {
      // Graceful fallback for non-supported devices / simulator
    }
  },

  light: async () => {
    if (!hapticsEnabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
  },

  medium: async () => {
    if (!hapticsEnabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Fallback
    }
  },

  heavy: async () => {
    if (!hapticsEnabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
      // Fallback
    }
  },

  success: async () => {
    if (!hapticsEnabled) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Fallback
    }
  },

  warning: async () => {
    if (!hapticsEnabled) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
      // Fallback
    }
  },

  error: async () => {
    if (!hapticsEnabled) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      // Fallback
    }
  },
};
