import {
  teamNameSchema,
  matchCreateSchema,
  playersListSchema,
  openingSelectionsSchema,
} from '../../src/utils/validation';

describe('Validation Schemas', () => {
  describe('teamNameSchema', () => {
    it('accepts valid team names', () => {
      expect(teamNameSchema.safeParse('Mumbai Tigers').success).toBe(true);
      expect(teamNameSchema.safeParse('Gully Strikers').success).toBe(true);
    });

    it('rejects empty or whitespace-only names', () => {
      expect(teamNameSchema.safeParse('').success).toBe(false);
      expect(teamNameSchema.safeParse('   ').success).toBe(false);
    });

    it('rejects names exceeding 30 characters', () => {
      const longName = 'A'.repeat(35);
      expect(teamNameSchema.safeParse(longName).success).toBe(false);
    });
  });

  describe('matchCreateSchema', () => {
    const validMatch = {
      teamAName: 'Warriors',
      teamBName: 'Knights',
      overs: 5,
      ballsPerOver: 6,
      playersPerTeam: 11,
      rules: {
        wideRuns: 1,
        noBallRuns: 1,
        freeHitEnabled: true,
        lbwEnabled: false,
        lastManBatting: false,
      },
      toss: {
        winner: 'TEAM_A' as const,
        decision: 'BAT' as const,
        isSkipped: false,
      },
    };

    it('validates a correct match configuration', () => {
      const res = matchCreateSchema.safeParse(validMatch);
      expect(res.success).toBe(true);
    });

    it('rejects identical team names (case-insensitive)', () => {
      const invalid = {
        ...validMatch,
        teamAName: 'Strikers',
        teamBName: 'strikers ',
      };
      const res = matchCreateSchema.safeParse(invalid);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toContain('different names');
      }
    });

    it('rejects overs less than 1 or greater than 50', () => {
      expect(matchCreateSchema.safeParse({ ...validMatch, overs: 0 }).success).toBe(false);
      expect(matchCreateSchema.safeParse({ ...validMatch, overs: 51 }).success).toBe(false);
    });

    it('rejects player count less than 3 or greater than 11', () => {
      expect(matchCreateSchema.safeParse({ ...validMatch, playersPerTeam: 2 }).success).toBe(false);
      expect(matchCreateSchema.safeParse({ ...validMatch, playersPerTeam: 12 }).success).toBe(false);
    });
  });

  describe('playersListSchema', () => {
    it('accepts unique player lists with 3 or more players', () => {
      const players = ['Rohit', 'Virat', 'Bumrah'];
      expect(playersListSchema.safeParse(players).success).toBe(true);
    });

    it('rejects duplicate player names within the same team', () => {
      const players = ['Rohit', 'Virat', 'rohit'];
      const res = playersListSchema.safeParse(players);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toContain('unique');
      }
    });

    it('rejects squad sizes below 3 players', () => {
      const players = ['Rohit', 'Virat'];
      expect(playersListSchema.safeParse(players).success).toBe(false);
    });
  });

  describe('openingSelectionsSchema', () => {
    const battingPlayers = ['Rohit', 'Virat', 'Surya'];
    const bowlingPlayers = ['Bumrah', 'Shami', 'Siraj'];

    it('accepts valid opening player choices', () => {
      const res = openingSelectionsSchema.safeParse({
        striker: 'Rohit',
        nonStriker: 'Virat',
        openingBowler: 'Bumrah',
        battingPlayers,
        bowlingPlayers,
      });
      expect(res.success).toBe(true);
    });

    it('rejects striker and non-striker being the same player', () => {
      const res = openingSelectionsSchema.safeParse({
        striker: 'Rohit',
        nonStriker: 'Rohit',
        openingBowler: 'Bumrah',
        battingPlayers,
        bowlingPlayers,
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toContain('different players');
      }
    });

    it('rejects opening bowler selected from batting team', () => {
      const res = openingSelectionsSchema.safeParse({
        striker: 'Rohit',
        nonStriker: 'Virat',
        openingBowler: 'Surya', // Belong to batting team
        battingPlayers,
        bowlingPlayers,
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toContain('bowling team');
      }
    });
  });
});
