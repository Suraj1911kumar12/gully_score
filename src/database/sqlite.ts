/**
 * GullyScore SQLite Database Initializer & Singleton
 */

import * as SQLite from 'expo-sqlite';
import { runMigrations } from './migrations';

const DATABASE_NAME = 'gullyscore.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let isInitializing = false;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      // Enforce foreign key constraints
      await db.execAsync('PRAGMA foreign_keys = ON;');
      await runMigrations(db);
      dbInstance = db;
      return db;
    } catch (error) {
      console.error('[Database] Failed to initialize SQLite database:', error);
      throw error;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

/**
 * Reset / Close database reference (useful for test tear-downs)
 */
export function resetDatabaseInstance(): void {
  dbInstance = null;
  initPromise = null;
}
