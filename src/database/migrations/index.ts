/**
 * GullyScore SQLite Migrations Runner
 */

import { SQLiteDatabase } from 'expo-sqlite';
import { INITIAL_MIGRATION_SQL, SCHEMA_VERSION } from '../schema';

export interface Migration {
  version: number;
  up: (db: SQLiteDatabase) => Promise<void>;
}

export const migrations: Migration[] = [
  {
    version: 1,
    up: async (db: SQLiteDatabase) => {
      await db.execAsync(INITIAL_MIGRATION_SQL);
    },
  },
];

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  // Ensure migrations table exists
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  // Query already applied versions
  const appliedRows = await db.getAllAsync<{ version: number }>(
    'SELECT version FROM schema_migrations ORDER BY version ASC;'
  );
  const appliedVersions = new Set(appliedRows.map((r) => r.version));

  for (const migration of migrations) {
    if (!appliedVersions.has(migration.version)) {
      await db.withTransactionAsync(async () => {
        await migration.up(db);
        await db.runAsync(
          'INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?);',
          migration.version,
          new Date().toISOString()
        );
      });
    }
  }
}
