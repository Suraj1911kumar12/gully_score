import { INITIAL_MIGRATION_SQL, SCHEMA_VERSION } from '../../src/database/schema';
import { migrations } from '../../src/database/migrations';

describe('Database Schema & Migrations', () => {
  it('defines schema version as 1', () => {
    expect(SCHEMA_VERSION).toBe(1);
  });

  it('contains DDL for all 8 required tables and migrations table', () => {
    expect(INITIAL_MIGRATION_SQL).toContain('CREATE TABLE IF NOT EXISTS schema_migrations');
    expect(INITIAL_MIGRATION_SQL).toContain('CREATE TABLE IF NOT EXISTS app_settings');
    expect(INITIAL_MIGRATION_SQL).toContain('CREATE TABLE IF NOT EXISTS matches');
    expect(INITIAL_MIGRATION_SQL).toContain('CREATE TABLE IF NOT EXISTS match_teams');
    expect(INITIAL_MIGRATION_SQL).toContain('CREATE TABLE IF NOT EXISTS match_players');
    expect(INITIAL_MIGRATION_SQL).toContain('CREATE TABLE IF NOT EXISTS innings');
    expect(INITIAL_MIGRATION_SQL).toContain('CREATE TABLE IF NOT EXISTS ball_events');
    expect(INITIAL_MIGRATION_SQL).toContain('CREATE TABLE IF NOT EXISTS event_corrections');
    expect(INITIAL_MIGRATION_SQL).toContain('CREATE TABLE IF NOT EXISTS match_snapshots');
  });

  it('enforces foreign key constraints and performance indexes in initial migration', () => {
    expect(INITIAL_MIGRATION_SQL).toContain('PRAGMA foreign_keys = ON;');
    expect(INITIAL_MIGRATION_SQL).toContain('CREATE INDEX IF NOT EXISTS idx_matches_status');
    expect(INITIAL_MIGRATION_SQL).toContain('CREATE INDEX IF NOT EXISTS idx_match_players_match');
    expect(INITIAL_MIGRATION_SQL).toContain('CREATE INDEX IF NOT EXISTS idx_ball_events_match');
  });

  it('has initial migration registered in migration list', () => {
    expect(migrations.length).toBeGreaterThanOrEqual(1);
    expect(migrations[0].version).toBe(1);
  });
});
