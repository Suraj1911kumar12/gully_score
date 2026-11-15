/**
 * GullyScore Matches Repository
 * Safe parameterized SQLite queries with transaction support
 */

import { getDatabase } from '../sqlite';
import { generateUUID } from '../../utils/uuid';
import { MatchEntity, MatchStatus, MatchDraftData, MatchConfig } from '../../domain/match.types';

export interface MatchRow {
  id: string;
  status: MatchStatus;
  overs: number;
  balls_per_over: number;
  players_per_team: number;
  wide_runs: number;
  no_ball_runs: number;
  free_hit_enabled: number;
  lbw_enabled: number;
  last_man_batting: number;
  max_overs_per_bowler: number | null;
  toss_winner_side: 'TEAM_A' | 'TEAM_B' | null;
  toss_decision: 'BAT' | 'BOWL' | null;
  toss_skipped: number;
  batting_first_team_id: string | null;
  current_innings_number: number;
  striker_player_id: string | null;
  non_striker_player_id: string | null;
  opening_bowler_player_id: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface TeamRow {
  id: string;
  match_id: string;
  name: string;
  short_name: string;
  team_side: 'TEAM_A' | 'TEAM_B';
  created_at: string;
}

export class MatchesRepository {
  /**
   * Save a newly configured match draft or ready match with its teams and players in a single transaction
   */
  async createMatchFromDraft(draft: MatchDraftData, status: MatchStatus = 'DRAFT'): Promise<string> {
    const db = await getDatabase();
    const matchId = generateUUID();
    const teamAId = generateUUID();
    const teamBId = generateUUID();
    const now = new Date().toISOString();

    const teamAShort = draft.teamAName.substring(0, 3).toUpperCase();
    const teamBShort = draft.teamBName.substring(0, 3).toUpperCase();

    // Determine batting first team
    let battingFirstTeamId: string | null = null;
    if (draft.toss) {
      if (draft.toss.isSkipped) {
        battingFirstTeamId = draft.toss.winner === 'TEAM_A' ? teamAId : teamBId;
      } else {
        if (draft.toss.winner === 'TEAM_A') {
          battingFirstTeamId = draft.toss.decision === 'BAT' ? teamAId : teamBId;
        } else {
          battingFirstTeamId = draft.toss.decision === 'BAT' ? teamBId : teamAId;
        }
      }
    }

    await db.withTransactionAsync(async () => {
      // 1. Insert Match
      await db.runAsync(
        `INSERT INTO matches (
          id, status, overs, balls_per_over, players_per_team,
          wide_runs, no_ball_runs, free_hit_enabled, lbw_enabled, last_man_batting, max_overs_per_bowler,
          toss_winner_side, toss_decision, toss_skipped, batting_first_team_id, current_innings_number,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?);`,
        matchId,
        status,
        draft.overs,
        draft.ballsPerOver,
        draft.playersPerTeam,
        draft.rules.wideRuns,
        draft.rules.noBallRuns,
        draft.rules.freeHitEnabled ? 1 : 0,
        draft.rules.lbwEnabled ? 1 : 0,
        draft.rules.lastManBatting ? 1 : 0,
        draft.rules.maxOversPerBowler ?? null,
        draft.toss?.winner ?? null,
        draft.toss?.decision ?? null,
        draft.toss?.isSkipped ? 1 : 0,
        battingFirstTeamId,
        now,
        now
      );

      // 2. Insert Teams
      await db.runAsync(
        `INSERT INTO match_teams (id, match_id, name, short_name, team_side, created_at)
         VALUES (?, ?, ?, ?, 'TEAM_A', ?);`,
        teamAId,
        matchId,
        draft.teamAName,
        teamAShort,
        now
      );

      await db.runAsync(
        `INSERT INTO match_teams (id, match_id, name, short_name, team_side, created_at)
         VALUES (?, ?, ?, ?, 'TEAM_B', ?);`,
        teamBId,
        matchId,
        draft.teamBName,
        teamBShort,
        now
      );

      // 3. Insert Players for Team A
      for (let i = 0; i < draft.teamAPlayers.length; i++) {
        const playerId = generateUUID();
        await db.runAsync(
          `INSERT INTO match_players (id, match_id, team_id, name, batting_order, created_at)
           VALUES (?, ?, ?, ?, ?, ?);`,
          playerId,
          matchId,
          teamAId,
          draft.teamAPlayers[i],
          i + 1,
          now
        );
      }

      // 4. Insert Players for Team B
      for (let i = 0; i < draft.teamBPlayers.length; i++) {
        const playerId = generateUUID();
        await db.runAsync(
          `INSERT INTO match_players (id, match_id, team_id, name, batting_order, created_at)
           VALUES (?, ?, ?, ?, ?, ?);`,
          playerId,
          matchId,
          teamBId,
          draft.teamBPlayers[i],
          i + 1,
          now
        );
      }
    });

    return matchId;
  }

  /**
   * Update match with opening selections and mark READY
   */
  async updateOpenersAndReady(
    matchId: string,
    strikerId: string,
    nonStrikerId: string,
    openingBowlerId: string
  ): Promise<void> {
    const db = await getDatabase();
    const now = new Date().toISOString();

    await db.runAsync(
      `UPDATE matches
       SET striker_player_id = ?,
           non_striker_player_id = ?,
           opening_bowler_player_id = ?,
           status = 'READY',
           updated_at = ?
       WHERE id = ?;`,
      strikerId,
      nonStrikerId,
      openingBowlerId,
      now,
      matchId
    );
  }

  /**
   * Fetch match by ID with team summaries
   */
  async getMatchById(matchId: string): Promise<MatchEntity | null> {
    const db = await getDatabase();

    const matchRow = await db.getFirstAsync<MatchRow>(
      'SELECT * FROM matches WHERE id = ?;',
      matchId
    );

    if (!matchRow) {
      return null;
    }

    const teamRows = await db.getAllAsync<TeamRow>(
      'SELECT * FROM match_teams WHERE match_id = ? ORDER BY team_side ASC;',
      matchId
    );

    const teamA = teamRows.find((t) => t.team_side === 'TEAM_A');
    const teamB = teamRows.find((t) => t.team_side === 'TEAM_B');

    const config: MatchConfig = {
      overs: matchRow.overs,
      ballsPerOver: matchRow.balls_per_over,
      playersPerTeam: matchRow.players_per_team,
      rules: {
        wideRuns: matchRow.wide_runs,
        noBallRuns: matchRow.no_ball_runs,
        freeHitEnabled: Boolean(matchRow.free_hit_enabled),
        lbwEnabled: Boolean(matchRow.lbw_enabled),
        lastManBatting: Boolean(matchRow.last_man_batting),
        maxOversPerBowler: matchRow.max_overs_per_bowler ?? undefined,
      },
    };

    return {
      id: matchRow.id,
      status: matchRow.status,
      config,
      teamA: {
        id: teamA?.id ?? '',
        name: teamA?.name ?? 'Team A',
        shortName: teamA?.short_name ?? 'TMA',
      },
      teamB: {
        id: teamB?.id ?? '',
        name: teamB?.name ?? 'Team B',
        shortName: teamB?.short_name ?? 'TMB',
      },
      toss: matchRow.toss_winner_side
        ? {
            winner: matchRow.toss_winner_side,
            decision: matchRow.toss_decision ?? 'BAT',
            isSkipped: Boolean(matchRow.toss_skipped),
          }
        : undefined,
      battingFirstTeamId: matchRow.batting_first_team_id ?? undefined,
      currentInningsNumber: matchRow.current_innings_number,
      strikerId: matchRow.striker_player_id ?? undefined,
      nonStrikerId: matchRow.non_striker_player_id ?? undefined,
      openingBowlerId: matchRow.opening_bowler_player_id ?? undefined,
      createdAt: matchRow.created_at,
      updatedAt: matchRow.updated_at,
      completedAt: matchRow.completed_at ?? undefined,
    };
  }

  /**
   * List all matches sorted by creation date descending
   */
  async listMatches(): Promise<MatchEntity[]> {
    const db = await getDatabase();
    const matchRows = await db.getAllAsync<MatchRow>(
      'SELECT * FROM matches ORDER BY created_at DESC;'
    );

    const matches: MatchEntity[] = [];

    for (const matchRow of matchRows) {
      const teamRows = await db.getAllAsync<TeamRow>(
        'SELECT * FROM match_teams WHERE match_id = ? ORDER BY team_side ASC;',
        matchRow.id
      );

      const teamA = teamRows.find((t) => t.team_side === 'TEAM_A');
      const teamB = teamRows.find((t) => t.team_side === 'TEAM_B');

      matches.push({
        id: matchRow.id,
        status: matchRow.status,
        config: {
          overs: matchRow.overs,
          ballsPerOver: matchRow.balls_per_over,
          playersPerTeam: matchRow.players_per_team,
          rules: {
            wideRuns: matchRow.wide_runs,
            noBallRuns: matchRow.no_ball_runs,
            freeHitEnabled: Boolean(matchRow.free_hit_enabled),
            lbwEnabled: Boolean(matchRow.lbw_enabled),
            lastManBatting: Boolean(matchRow.last_man_batting),
            maxOversPerBowler: matchRow.max_overs_per_bowler ?? undefined,
          },
        },
        teamA: {
          id: teamA?.id ?? '',
          name: teamA?.name ?? 'Team A',
          shortName: teamA?.short_name ?? 'TMA',
        },
        teamB: {
          id: teamB?.id ?? '',
          name: teamB?.name ?? 'Team B',
          shortName: teamB?.short_name ?? 'TMB',
        },
        toss: matchRow.toss_winner_side
          ? {
              winner: matchRow.toss_winner_side,
              decision: matchRow.toss_decision ?? 'BAT',
              isSkipped: Boolean(matchRow.toss_skipped),
            }
          : undefined,
        battingFirstTeamId: matchRow.batting_first_team_id ?? undefined,
        currentInningsNumber: matchRow.current_innings_number,
        strikerId: matchRow.striker_player_id ?? undefined,
        nonStrikerId: matchRow.non_striker_player_id ?? undefined,
        openingBowlerId: matchRow.opening_bowler_player_id ?? undefined,
        createdAt: matchRow.created_at,
        updatedAt: matchRow.updated_at,
        completedAt: matchRow.completed_at ?? undefined,
      });
    }

    return matches;
  }

  /**
   * Delete match by ID
   */
  async deleteMatch(matchId: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM matches WHERE id = ?;', matchId);
  }
}

export const matchesRepository = new MatchesRepository();
