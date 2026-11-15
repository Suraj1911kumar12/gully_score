/**
 * GullyScore Scoring Repository Contracts
 * Clean interfaces and future extension points for Phase 2 scoring engine
 */

import { BallEventEntity, WicketDetail } from '../../domain/scoring.types';

export interface IScoringRepository {
  recordBallEvent(event: Omit<BallEventEntity, 'id' | 'createdAt'>): Promise<string>;
  getBallEventsForInnings(matchId: string, inningsNumber: number): Promise<BallEventEntity[]>;
  undoLastBall(matchId: string): Promise<boolean>;
  recordWicket(matchId: string, wicket: WicketDetail): Promise<void>;
  saveMatchSnapshot(matchId: string, snapshotData: unknown): Promise<void>;
}

/**
 * Phase 1 Placeholder implementation that enforces Phase 2 boundaries
 */
export class ScoringRepositoryPlaceholder implements IScoringRepository {
  async recordBallEvent(): Promise<string> {
    throw new Error('Scoring engine recording is deferred to Phase 2.');
  }

  async getBallEventsForInnings(): Promise<BallEventEntity[]> {
    return [];
  }

  async undoLastBall(): Promise<boolean> {
    throw new Error('Undo operation is deferred to Phase 2.');
  }

  async recordWicket(): Promise<void> {
    throw new Error('Wicket recording is deferred to Phase 2.');
  }

  async saveMatchSnapshot(): Promise<void> {
    // Snapshot storage foundation ready for Phase 2
  }
}

export const scoringRepository = new ScoringRepositoryPlaceholder();
