/**
 * GullyScore Settings Zustand Store
 * Synchronized with SQLite persistence
 */

import { create } from 'zustand';
import {
  AppSettingsData,
  DEFAULT_APP_SETTINGS,
  settingsRepository,
} from '../database/repositories/settings.repository';
import { setHapticsEnabled } from '../utils/haptics';

interface SettingsState extends AppSettingsData {
  isLoaded: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<AppSettingsData>) => Promise<void>;
  setScoringLanguage: (language: AppSettingsData['scoringLanguage']) => Promise<void>;
  setHaptics: (enabled: boolean) => Promise<void>;
  setVoiceFeedback: (enabled: boolean) => Promise<void>;
  setDefaultOvers: (overs: number) => Promise<void>;
  setDefaultPlayerCount: (count: number) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT_APP_SETTINGS,
  isLoaded: false,

  loadSettings: async () => {
    try {
      const data = await settingsRepository.getSettings();
      setHapticsEnabled(data.hapticsEnabled);
      set({ ...data, isLoaded: true });
    } catch (e) {
      console.warn('[SettingsStore] Could not load settings from DB:', e);
      set({ isLoaded: true });
    }
  },

  updateSettings: async (newSettings) => {
    set(newSettings);
    if (newSettings.hapticsEnabled !== undefined) {
      setHapticsEnabled(newSettings.hapticsEnabled);
    }
    await settingsRepository.saveSettings(newSettings);
  },

  setScoringLanguage: async (scoringLanguage) => {
    await get().updateSettings({ scoringLanguage });
  },

  setHaptics: async (hapticsEnabled) => {
    await get().updateSettings({ hapticsEnabled });
  },

  setVoiceFeedback: async (voiceFeedbackEnabled) => {
    await get().updateSettings({ voiceFeedbackEnabled });
  },

  setDefaultOvers: async (defaultOvers) => {
    await get().updateSettings({ defaultOvers });
  },

  setDefaultPlayerCount: async (defaultPlayerCount) => {
    await get().updateSettings({ defaultPlayerCount });
  },
}));
