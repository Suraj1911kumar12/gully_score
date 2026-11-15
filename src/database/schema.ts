/**
 * GullyScore SQLite Database Schema & DDL
 */

export const SCHEMA_VERSION = 1;

export const INITIAL_MIGRATION_SQL = `
-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- 1. Schema Migrations Table
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL
);

-- 2. App Settings Table
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 3. Matches Table
CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK(status IN ('DRAFT', 'READY', 'LIVE', 'INNINGS_BREAK', 'COMPLETED', 'ABANDONED')),
  overs INTEGER NOT NULL DEFAULT 5,
  balls_per_over INTEGER NOT NULL DEFAULT 6,
  players_per_team INTEGER NOT NULL DEFAULT 11,
  wide_runs INTEGER NOT NULL DEFAULT 1,
  no_ball_runs INTEGER NOT NULL DEFAULT 1,
  free_hit_enabled INTEGER NOT NULL DEFAULT 1,
  lbw_enabled INTEGER NOT NULL DEFAULT 0,
  last_man_batting INTEGER NOT NULL DEFAULT 0,
  max_overs_per_bowler INTEGER,
  toss_winner_side TEXT CHECK(toss_winner_side IN ('TEAM_A', 'TEAM_B', NULL)),
  toss_decision TEXT CHECK(toss_decision IN ('BAT', 'BOWL', NULL)),
  toss_skipped INTEGER NOT NULL DEFAULT 0,
  batting_first_team_id TEXT,
  current_innings_number INTEGER NOT NULL DEFAULT 1,
  striker_player_id TEXT,
  non_striker_player_id TEXT,
  opening_bowler_player_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT
);

-- 4. Match Teams Table
CREATE TABLE IF NOT EXISTS match_teams (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  team_side TEXT NOT NULL CHECK(team_side IN ('TEAM_A', 'TEAM_B')),
  created_at TEXT NOT NULL,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
);

-- 5. Match Players Table
CREATE TABLE IF NOT EXISTS match_players (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  team_id TEXT NOT NULL,
  name TEXT NOT NULL,
  batting_order INTEGER NOT NULL DEFAULT 0,
  is_captain INTEGER NOT NULL DEFAULT 0,
  is_wicket_keeper INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES match_teams(id) ON DELETE CASCADE
);

-- 6. Innings Table (Prepared for Phase 2 scoring engine)
CREATE TABLE IF NOT EXISTS innings (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  innings_number INTEGER NOT NULL,
  batting_team_id TEXT NOT NULL,
  bowling_team_id TEXT NOT NULL,
  total_runs INTEGER NOT NULL DEFAULT 0,
  total_wickets INTEGER NOT NULL DEFAULT 0,
  legal_balls_delivered INTEGER NOT NULL DEFAULT 0,
  is_completed INTEGER NOT NULL DEFAULT 0,
  target_runs INTEGER,
  created_at TEXT NOT NULL,
  completed_at TEXT,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  FOREIGN KEY (batting_team_id) REFERENCES match_teams(id),
  FOREIGN KEY (bowling_team_id) REFERENCES match_teams(id)
);

-- 7. Ball Events Table (Prepared for Phase 2 scoring engine)
CREATE TABLE IF NOT EXISTS ball_events (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  innings_id TEXT NOT NULL,
  over_number INTEGER NOT NULL,
  ball_number INTEGER NOT NULL,
  bowler_player_id TEXT NOT NULL,
  striker_player_id TEXT NOT NULL,
  non_striker_player_id TEXT NOT NULL,
  runs_scored INTEGER NOT NULL DEFAULT 0,
  extras_type TEXT NOT NULL DEFAULT 'NONE',
  extras_runs INTEGER NOT NULL DEFAULT 0,
  is_legal_delivery INTEGER NOT NULL DEFAULT 1,
  is_wicket INTEGER NOT NULL DEFAULT 0,
  wicket_type TEXT,
  dismissed_player_id TEXT,
  fielder_player_id TEXT,
  is_boundary_four INTEGER NOT NULL DEFAULT 0,
  is_boundary_six INTEGER NOT NULL DEFAULT 0,
  commentary TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  FOREIGN KEY (innings_id) REFERENCES innings(id) ON DELETE CASCADE,
  FOREIGN KEY (bowler_player_id) REFERENCES match_players(id),
  FOREIGN KEY (striker_player_id) REFERENCES match_players(id),
  FOREIGN KEY (non_striker_player_id) REFERENCES match_players(id)
);

-- 8. Event Corrections Table (Audit trail for undos & ball edits)
CREATE TABLE IF NOT EXISTS event_corrections (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  ball_event_id TEXT NOT NULL,
  correction_type TEXT NOT NULL,
  previous_state_json TEXT NOT NULL,
  new_state_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
);

-- 9. Match Snapshots Table (Quick state recovery & offline backup)
CREATE TABLE IF NOT EXISTS match_snapshots (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  snapshot_version INTEGER NOT NULL,
  snapshot_data_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
);

-- Indexes for optimal lookup performance
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_match_teams_match ON match_teams(match_id);
CREATE INDEX IF NOT EXISTS idx_match_players_match ON match_players(match_id);
CREATE INDEX IF NOT EXISTS idx_match_players_team ON match_players(team_id);
CREATE INDEX IF NOT EXISTS idx_innings_match ON innings(match_id);
CREATE INDEX IF NOT EXISTS idx_ball_events_match ON ball_events(match_id);
CREATE INDEX IF NOT EXISTS idx_ball_events_innings ON ball_events(innings_id);
CREATE INDEX IF NOT EXISTS idx_match_snapshots_match ON match_snapshots(match_id);
`;
