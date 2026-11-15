/**
 * GullyScore Players Repository
 */

import { getDatabase } from '../sqlite';
import { generateUUID } from '../../utils/uuid';
import { MatchPlayerEntity, MatchTeamEntity } from '../../domain/player.types';

export class PlayersRepository {
  /**
   * Get teams for a match
   */
  async getTeamsByMatchId(matchId: string): Promise<{ teamA: MatchTeamEntity; teamB: MatchTeamEntity } | null> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{
      id: string;
      match_id: string;
      name: string;
      short_name: string;
      team_side: 'TEAM_A' | 'TEAM_B';
      created_at: string;
    }>('SELECT * FROM match_teams WHERE match_id = ? ORDER BY team_side ASC;', matchId);

    const teamARow = rows.find((r) => r.team_side === 'TEAM_A');
    const teamBRow = rows.find((r) => r.team_side === 'TEAM_B');

    if (!teamARow || !teamBRow) {
      return null;
    }

    return {
      teamA: {
        id: teamARow.id,
        matchId: teamARow.match_id,
        name: teamARow.name,
        shortName: teamARow.short_name,
        teamSide: 'TEAM_A',
        createdAt: teamARow.created_at,
      },
      teamB: {
        id: teamBRow.id,
        matchId: teamBRow.match_id,
        name: teamBRow.name,
        shortName: teamBRow.short_name,
        teamSide: 'TEAM_B',
        createdAt: teamBRow.created_at,
      },
    };
  }

  /**
   * Get all players for a match partitioned by team
   */
  async getMatchPlayers(matchId: string): Promise<{
    teamAPlayers: MatchPlayerEntity[];
    teamBPlayers: MatchPlayerEntity[];
  }> {
    const db = await getDatabase();
    const teams = await this.getTeamsByMatchId(matchId);

    if (!teams) {
      return { teamAPlayers: [], teamBPlayers: [] };
    }

    const rows = await db.getAllAsync<{
      id: string;
      match_id: string;
      team_id: string;
      name: string;
      batting_order: number;
      is_captain: number;
      is_wicket_keeper: number;
      created_at: string;
    }>(
      'SELECT * FROM match_players WHERE match_id = ? ORDER BY batting_order ASC;',
      matchId
    );

    const teamAPlayers: MatchPlayerEntity[] = [];
    const teamBPlayers: MatchPlayerEntity[] = [];

    for (const r of rows) {
      const entity: MatchPlayerEntity = {
        id: r.id,
        matchId: r.match_id,
        teamId: r.team_id,
        name: r.name,
        battingOrder: r.batting_order,
        isCaptain: Boolean(r.is_captain),
        isWicketKeeper: Boolean(r.is_wicket_keeper),
        createdAt: r.created_at,
      };

      if (r.team_id === teams.teamA.id) {
        teamAPlayers.push(entity);
      } else {
        teamBPlayers.push(entity);
      }
    }

    return { teamAPlayers, teamBPlayers };
  }

  /**
   * Replace/update players for a team
   */
  async updateTeamPlayers(
    matchId: string,
    teamId: string,
    playerNames: string[]
  ): Promise<MatchPlayerEntity[]> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    const entities: MatchPlayerEntity[] = [];

    await db.withTransactionAsync(async () => {
      await db.runAsync(
        'DELETE FROM match_players WHERE match_id = ? AND team_id = ?;',
        matchId,
        teamId
      );

      for (let i = 0; i < playerNames.length; i++) {
        const id = generateUUID();
        const name = playerNames[i];
        await db.runAsync(
          `INSERT INTO match_players (id, match_id, team_id, name, batting_order, created_at)
           VALUES (?, ?, ?, ?, ?, ?);`,
          id,
          matchId,
          teamId,
          name,
          i + 1,
          now
        );

        entities.push({
          id,
          matchId,
          teamId,
          name,
          battingOrder: i + 1,
          createdAt: now,
        });
      }
    });

    return entities;
  }
}

export const playersRepository = new PlayersRepository();
