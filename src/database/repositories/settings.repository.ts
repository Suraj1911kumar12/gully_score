/**
 * GullyScore Settings Repository
 * Typed local key-value store backed by SQLite
 */

import { getDatabase } from '../sqlite';

export interface AppSettingsData {
  scoringLanguage: 'hindi' | 'english' | 'hinglish';
  hapticsEnabled: boolean;
  voiceFeedbackEnabled: boolean;
  defaultOvers: number;
  defaultPlayerCount: number;
  theme: 'dark' | 'pitch-dark';
}

export const DEFAULT_APP_SETTINGS: AppSettingsData = {
  scoringLanguage: 'english',
  hapticsEnabled: true,
  voiceFeedbackEnabled: false,
  defaultOvers: 5,
  defaultPlayerCount: 11,
  theme: 'dark',
};

export class SettingsRepository {
  async getSettings(): Promise<AppSettingsData> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ key: string; value: string }>(
      'SELECT key, value FROM app_settings;'
    );

    const map = new Map<string, string>();
    for (const r of rows) {
      map.set(r.key, r.value);
    }

    return {
      scoringLanguage: (map.get('scoringLanguage') as AppSettingsData['scoringLanguage']) || DEFAULT_APP_SETTINGS.scoringLanguage,
      hapticsEnabled: map.has('hapticsEnabled') ? map.get('hapticsEnabled') === 'true' : DEFAULT_APP_SETTINGS.hapticsEnabled,
      voiceFeedbackEnabled: map.has('voiceFeedbackEnabled') ? map.get('voiceFeedbackEnabled') === 'true' : DEFAULT_APP_SETTINGS.voiceFeedbackEnabled,
      defaultOvers: map.has('defaultOvers') ? Number(map.get('defaultOvers')) || DEFAULT_APP_SETTINGS.defaultOvers : DEFAULT_APP_SETTINGS.defaultOvers,
      defaultPlayerCount: map.has('defaultPlayerCount') ? Number(map.get('defaultPlayerCount')) || DEFAULT_APP_SETTINGS.defaultPlayerCount : DEFAULT_APP_SETTINGS.defaultPlayerCount,
      theme: (map.get('theme') as AppSettingsData['theme']) || DEFAULT_APP_SETTINGS.theme,
    };
  }

  async saveSettings(settings: Partial<AppSettingsData>): Promise<void> {
    const db = await getDatabase();
    const now = new Date().toISOString();

    await db.withTransactionAsync(async () => {
      for (const [key, value] of Object.entries(settings)) {
        if (value !== undefined) {
          await db.runAsync(
            `INSERT INTO app_settings (key, value, updated_at)
             VALUES (?, ?, ?)
             ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;`,
            key,
            String(value),
            now
          );
        }
      }
    });
  }
}

export const settingsRepository = new SettingsRepository();
