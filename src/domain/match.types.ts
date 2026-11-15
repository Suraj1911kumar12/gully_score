/**
 * GullyScore Domain Contracts - Match
 */

export type MatchStatus =
  | 'DRAFT'
  | 'READY'
  | 'LIVE'
  | 'INNINGS_BREAK'
  | 'COMPLETED'
  | 'ABANDONED';

export type TossWinner = 'TEAM_A' | 'TEAM_B';
export type TossDecision = 'BAT' | 'BOWL';

export interface MatchRules {
  wideRuns: number;          // Default: 1
  noBallRuns: number;        // Default: 1
  freeHitEnabled: boolean;   // Default: true
  lbwEnabled: boolean;       // Default: false (gully cricket standard)
  lastManBatting: boolean;   // Default: false
  maxOversPerBowler?: number;// Optional limit
}

export interface MatchConfig {
  overs: number;             // Total overs per innings (e.g., 2, 3, 5, 6, 10, 20)
  ballsPerOver: number;      // Default: 6
  playersPerTeam: number;    // 3 to 11
  rules: MatchRules;
}

export interface TossResult {
  winner: TossWinner;
  decision: TossDecision;
  isSkipped: boolean;
}

export interface MatchTeamSummary {
  id: string;
  name: string;
  shortName: string;
}

export interface MatchEntity {
  id: string;
  status: MatchStatus;
  config: MatchConfig;
  teamA: MatchTeamSummary;
  teamB: MatchTeamSummary;
  toss?: TossResult;
  battingFirstTeamId?: string;
  currentInningsNumber: number;
  strikerId?: string;
  nonStrikerId?: string;
  openingBowlerId?: string;
  createdAt: string;         // ISO 8601
  updatedAt: string;         // ISO 8601
  completedAt?: string;      // ISO 8601
}

export interface MatchDraftData {
  teamAName: string;
  teamBName: string;
  overs: number;
  ballsPerOver: number;
  playersPerTeam: number;
  rules: MatchRules;
  toss: TossResult;
  teamAPlayers: string[];
  teamBPlayers: string[];
  strikerName?: string;
  nonStrikerName?: string;
  openingBowlerName?: string;
}

export type MatchResultOutcome =
  | { type: 'TEAM_A_WON'; margin: string; summary: string }
  | { type: 'TEAM_B_WON'; margin: string; summary: string }
  | { type: 'TIE'; summary: string }
  | { type: 'ABANDONED'; reason: string }
  | { type: 'INCOMPLETE'; reason: string };

export interface MatchResultViewModel {
  matchId: string;
  status: MatchStatus;
  teamA: {
    id: string;
    name: string;
    score: string;          // e.g. "124/6"
    overs: string;          // e.g. "10.0"
  };
  teamB: {
    id: string;
    name: string;
    score: string;          // e.g. "125/4"
    overs: string;          // e.g. "9.2"
  };
  outcome: MatchResultOutcome;
  playerOfTheMatch?: string;
}
