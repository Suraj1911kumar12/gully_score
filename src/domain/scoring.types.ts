/**
 * GullyScore Domain Contracts - Scoring & Scorecard
 * Contracts prepared for Phase 2 scoring engine integration
 */

export type ExtrasType = 'NONE' | 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE' | 'PENALTY';

export type DismissalType =
  | 'BOWLED'
  | 'CAUGHT'
  | 'LBW'
  | 'RUN_OUT'
  | 'STUMPED'
  | 'HIT_WICKET'
  | 'RETIRED_HURT'
  | 'HANDLED_BALL'
  | 'OBSTRUCTING_FIELD'
  | 'TIMED_OUT';

export interface WicketDetail {
  type: DismissalType;
  dismissedPlayerId: string;
  fielderPlayerId?: string;
  bowlerPlayerId?: string;
  fallOfWicketRuns: number;
  fallOfWicketOvers: string;
  fallOfWicketNumber: number;
}

export interface BallEventEntity {
  id: string;
  matchId: string;
  inningsNumber: number;
  overNumber: number;
  ballNumber: number;         // 1 to 6 (legal balls)
  bowlerPlayerId: string;
  strikerPlayerId: string;
  nonStrikerPlayerId: string;
  runsScored: number;         // Batsman runs (0, 1, 2, 3, 4, 5, 6)
  extrasType: ExtrasType;
  extrasRuns: number;
  isLegalDelivery: boolean;
  isWicket: boolean;
  wicketDetail?: WicketDetail;
  isBoundaryFour: boolean;
  isBoundarySix: boolean;
  commentary?: string;
  createdAt: string;
}

export interface BattingScoreRow {
  playerId: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isStriker: boolean;
  isNonStriker: boolean;
  isOut: boolean;
  dismissalText?: string;     // e.g. "b Bumrah", "c Aman b Rohit", "not out"
}

export interface BowlingScoreRow {
  playerId: string;
  name: string;
  overs: string;              // e.g. "2.3"
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  isCurrentBowler: boolean;
}

export type TimelineBallType =
  | 'DOT'
  | 'RUN_1'
  | 'RUN_2'
  | 'RUN_3'
  | 'FOUR'
  | 'SIX'
  | 'WIDE'
  | 'NO_BALL'
  | 'BYE'
  | 'LEG_BYE'
  | 'WICKET';

export interface TimelineBall {
  id: string;
  ballNumber: number;
  displayText: string;        // "0", "1", "4", "6", "Wd", "Nb", "W"
  type: TimelineBallType;
  runs: number;
  isLegal: boolean;
}

export interface FallOfWicketItem {
  wicketNumber: number;
  score: number;
  overs: string;
  playerName: string;
}

export interface ExtrasSummary {
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  penalties: number;
  total: number;
}

export interface ScorecardViewModel {
  matchId: string;
  inningsNumber: number;
  battingTeamName: string;
  bowlingTeamName: string;
  totalScore: number;
  totalWickets: number;
  oversCompleted: string;
  maxOvers: number;
  currentRunRate: number;
  requiredRunRate?: number;
  target?: number;
  batters: BattingScoreRow[];
  bowlers: BowlingScoreRow[];
  extras: ExtrasSummary;
  fallOfWickets: FallOfWicketItem[];
  timelineBalls: TimelineBall[];
}

export type ScoringActionType =
  | 'DOT'
  | 'RUN_1'
  | 'RUN_2'
  | 'RUN_3'
  | 'FOUR'
  | 'FIVE'
  | 'SIX'
  | 'WICKET'
  | 'WIDE'
  | 'NO_BALL'
  | 'BYE'
  | 'LEG_BYE'
  | 'PENALTY'
  | 'UNDO'
  | 'EDIT_PREVIOUS';
