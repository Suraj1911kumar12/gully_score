/**
 * GullyScore Zod Validation Schemas
 */

import { z } from 'zod';

export const teamNameSchema = z
  .string()
  .trim()
  .min(1, 'Team name cannot be empty')
  .max(30, 'Team name must be 30 characters or less');

export const matchRulesSchema = z.object({
  wideRuns: z.number().int().min(0, 'Wide runs must be 0 or more').default(1),
  noBallRuns: z.number().int().min(0, 'No-ball runs must be 0 or more').default(1),
  freeHitEnabled: z.boolean().default(true),
  lbwEnabled: z.boolean().default(false),
  lastManBatting: z.boolean().default(false),
  maxOversPerBowler: z.number().int().positive().optional(),
});

export const tossSchema = z.object({
  winner: z.enum(['TEAM_A', 'TEAM_B']),
  decision: z.enum(['BAT', 'BOWL']),
  isSkipped: z.boolean().default(false),
});

export const matchCreateSchema = z
  .object({
    teamAName: teamNameSchema,
    teamBName: teamNameSchema,
    overs: z.number().int().min(1, 'Minimum 1 over').max(50, 'Maximum 50 overs').default(5),
    ballsPerOver: z.number().int().min(1).max(12).default(6),
    playersPerTeam: z.number().int().min(3, 'At least 3 players').max(11, 'Maximum 11 players').default(11),
    rules: matchRulesSchema,
    toss: tossSchema,
  })
  .refine(
    (data) => data.teamAName.trim().toLowerCase() !== data.teamBName.trim().toLowerCase(),
    {
      message: 'Team A and Team B must have different names',
      path: ['teamBName'],
    }
  );

export type MatchCreateFormData = z.infer<typeof matchCreateSchema>;

export const playerNameSchema = z
  .string()
  .trim()
  .min(1, 'Player name is required')
  .max(25, 'Player name must be 25 characters or less');

export const playersListSchema = z
  .array(playerNameSchema)
  .min(3, 'Minimum 3 players required')
  .refine(
    (players) => {
      const lowerNames = players.map((p) => p.trim().toLowerCase());
      return new Set(lowerNames).size === lowerNames.length;
    },
    {
      message: 'Player names must be unique within the team',
    }
  );

export const openingSelectionsSchema = z
  .object({
    striker: z.string().min(1, 'Striker must be selected'),
    nonStriker: z.string().min(1, 'Non-striker must be selected'),
    openingBowler: z.string().min(1, 'Opening bowler must be selected'),
    battingPlayers: z.array(z.string()),
    bowlingPlayers: z.array(z.string()),
  })
  .refine((data) => data.striker !== data.nonStriker, {
    message: 'Striker and Non-striker must be different players',
    path: ['nonStriker'],
  })
  .refine((data) => data.battingPlayers.includes(data.striker), {
    message: 'Striker must belong to the batting team',
    path: ['striker'],
  })
  .refine((data) => data.battingPlayers.includes(data.nonStriker), {
    message: 'Non-striker must belong to the batting team',
    path: ['nonStriker'],
  })
  .refine((data) => data.bowlingPlayers.includes(data.openingBowler), {
    message: 'Opening bowler must belong to the bowling team',
    path: ['openingBowler'],
  });
