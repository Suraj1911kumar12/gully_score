import { useSettingsStore } from '../../src/stores/settings.store';
import { DEFAULT_APP_SETTINGS } from '../../src/database/repositories/settings.repository';

// Mock settings repository for unit test isolation
jest.mock('../../src/database/repositories/settings.repository', () => ({
  DEFAULT_APP_SETTINGS: {
    scoringLanguage: 'english',
    hapticsEnabled: true,
    voiceFeedbackEnabled: false,
    defaultOvers: 5,
    defaultPlayerCount: 11,
    theme: 'dark',
  },
  settingsRepository: {
    getSettings: jest.fn().mockResolvedValue({
      scoringLanguage: 'english',
      hapticsEnabled: true,
      voiceFeedbackEnabled: false,
      defaultOvers: 5,
      defaultPlayerCount: 11,
      theme: 'dark',
    }),
    saveSettings: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('useSettingsStore', () => {
  it('initializes with default app settings', () => {
    const state = useSettingsStore.getState();
    expect(state.scoringLanguage).toBe('english');
    expect(state.hapticsEnabled).toBe(true);
    expect(state.defaultOvers).toBe(5);
    expect(state.defaultPlayerCount).toBe(11);
  });

  it('updates language preference', async () => {
    const store = useSettingsStore.getState();
    await store.setScoringLanguage('hinglish');

    expect(useSettingsStore.getState().scoringLanguage).toBe('hinglish');
  });

  it('updates haptics toggle', async () => {
    const store = useSettingsStore.getState();
    await store.setHaptics(false);

    expect(useSettingsStore.getState().hapticsEnabled).toBe(false);
  });
});
