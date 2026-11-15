/**
 * GullyScore Match Draft Zustand Store
 * Transient state for configuring and setting up matches
 */

import { create } from 'zustand';
import { MatchRules, TossResult, MatchDraftData } from '../domain/match.types';
import { matchesRepository } from '../database/repositories/matches.repository';
import { playersRepository } from '../database/repositories/players.repository';

interface MatchDraftState {
  teamAName: string;
  teamBName: string;
  overs: number;
  ballsPerOver: number;
  playersPerTeam: number;
  rules: MatchRules;
  toss: TossResult;
  teamAPlayers: string[];
  teamBPlayers: string[];
  strikerName: string;
  nonStrikerName: string;
  openingBowlerName: string;
  isSaving: boolean;
  activeMatchId: string | null;

  // Actions
  setTeamAName: (name: string) => void;
  setTeamBName: (name: string) => void;
  setOvers: (overs: number) => void;
  setBallsPerOver: (balls: number) => void;
  setPlayersPerTeam: (count: number) => void;
  updateRules: (rules: Partial<MatchRules>) => void;
  setToss: (toss: TossResult) => void;
  setTeamAPlayers: (players: string[]) => void;
  setTeamBPlayers: (players: string[]) => void;
  updateTeamAPlayer: (index: number, name: string) => void;
  updateTeamBPlayer: (index: number, name: string) => void;
  addPlayerToTeamA: (name?: string) => void;
  addPlayerToTeamB: (name?: string) => void;
  removePlayerFromTeamA: (index: number) => void;
  removePlayerFromTeamB: (index: number) => void;
  setStrikerName: (name: string) => void;
  setNonStrikerName: (name: string) => void;
  setOpeningBowlerName: (name: string) => void;
  resetDraft: () => void;
  initializePlayersForCount: (count: number) => void;
  saveDraftToDatabase: () => Promise<string>;
  finalizeAndSaveReady: () => Promise<string>;
}

const defaultRules: MatchRules = {
  wideRuns: 1,
  noBallRuns: 1,
  freeHitEnabled: true,
  lbwEnabled: false,
  lastManBatting: false,
};

const defaultToss: TossResult = {
  winner: 'TEAM_A',
  decision: 'BAT',
  isSkipped: false,
};

const generateDefaultPlayers = (count: number, prefix: string): string[] => {
  return Array.from({ length: count }, (_, i) => `${prefix} Player ${i + 1}`);
};

export const useMatchDraftStore = create<MatchDraftState>((set, get) => ({
  teamAName: 'Team A',
  teamBName: 'Team B',
  overs: 5,
  ballsPerOver: 6,
  playersPerTeam: 11,
  rules: defaultRules,
  toss: defaultToss,
  teamAPlayers: generateDefaultPlayers(11, 'A'),
  teamBPlayers: generateDefaultPlayers(11, 'B'),
  strikerName: '',
  nonStrikerName: '',
  openingBowlerName: '',
  isSaving: false,
  activeMatchId: null,

  setTeamAName: (name) => set({ teamAName: name }),
  setTeamBName: (name) => set({ teamBName: name }),
  setOvers: (overs) => set({ overs }),
  setBallsPerOver: (balls) => set({ ballsPerOver: balls }),
  setPlayersPerTeam: (count) => {
    const { teamAPlayers, teamBPlayers } = get();
    // Adjust arrays if count changes
    const newA = [...teamAPlayers];
    const newB = [...teamBPlayers];
    while (newA.length < count) newA.push(`A Player ${newA.length + 1}`);
    while (newB.length < count) newB.push(`B Player ${newB.length + 1}`);
    set({
      playersPerTeam: count,
      teamAPlayers: newA.slice(0, count),
      teamBPlayers: newB.slice(0, count),
    });
  },
  updateRules: (rules) =>
    set((state) => ({ rules: { ...state.rules, ...rules } })),
  setToss: (toss) => set({ toss }),
  setTeamAPlayers: (players) => set({ teamAPlayers: players }),
  setTeamBPlayers: (players) => set({ teamBPlayers: players }),

  updateTeamAPlayer: (index, name) => {
    const list = [...get().teamAPlayers];
    list[index] = name;
    set({ teamAPlayers: list });
  },

  updateTeamBPlayer: (index, name) => {
    const list = [...get().teamBPlayers];
    list[index] = name;
    set({ teamBPlayers: list });
  },

  addPlayerToTeamA: (name) => {
    const list = [...get().teamAPlayers];
    list.push(name || `A Player ${list.length + 1}`);
    set({ teamAPlayers: list, playersPerTeam: Math.max(get().playersPerTeam, list.length) });
  },

  addPlayerToTeamB: (name) => {
    const list = [...get().teamBPlayers];
    list.push(name || `B Player ${list.length + 1}`);
    set({ teamBPlayers: list, playersPerTeam: Math.max(get().playersPerTeam, list.length) });
  },

  removePlayerFromTeamA: (index) => {
    const list = get().teamAPlayers.filter((_, i) => i !== index);
    set({ teamAPlayers: list, playersPerTeam: list.length });
  },

  removePlayerFromTeamB: (index) => {
    const list = get().teamBPlayers.filter((_, i) => i !== index);
    set({ teamBPlayers: list, playersPerTeam: list.length });
  },

  setStrikerName: (name) => set({ strikerName: name }),
  setNonStrikerName: (name) => set({ nonStrikerName: name }),
  setOpeningBowlerName: (name) => set({ openingBowlerName: name }),

  resetDraft: () =>
    set({
      teamAName: 'Team A',
      teamBName: 'Team B',
      overs: 5,
      ballsPerOver: 6,
      playersPerTeam: 11,
      rules: defaultRules,
      toss: defaultToss,
      teamAPlayers: generateDefaultPlayers(11, 'A'),
      teamBPlayers: generateDefaultPlayers(11, 'B'),
      strikerName: '',
      nonStrikerName: '',
      openingBowlerName: '',
      isSaving: false,
      activeMatchId: null,
    }),

  initializePlayersForCount: (count) => {
    set({
      playersPerTeam: count,
      teamAPlayers: generateDefaultPlayers(count, 'A'),
      teamBPlayers: generateDefaultPlayers(count, 'B'),
    });
  },

  saveDraftToDatabase: async () => {
    const state = get();
    set({ isSaving: true });
    try {
      const draftData: MatchDraftData = {
        teamAName: state.teamAName,
        teamBName: state.teamBName,
        overs: state.overs,
        ballsPerOver: state.ballsPerOver,
        playersPerTeam: state.playersPerTeam,
        rules: state.rules,
        toss: state.toss,
        teamAPlayers: state.teamAPlayers,
        teamBPlayers: state.teamBPlayers,
        strikerName: state.strikerName,
        nonStrikerName: state.nonStrikerName,
        openingBowlerName: state.openingBowlerName,
      };

      const matchId = await matchesRepository.createMatchFromDraft(draftData, 'DRAFT');
      set({ activeMatchId: matchId, isSaving: false });
      return matchId;
    } catch (err) {
      set({ isSaving: false });
      throw err;
    }
  },

  finalizeAndSaveReady: async () => {
    const state = get();
    set({ isSaving: true });
    try {
      let matchId = state.activeMatchId;
      if (!matchId) {
        const draftData: MatchDraftData = {
          teamAName: state.teamAName,
          teamBName: state.teamBName,
          overs: state.overs,
          ballsPerOver: state.ballsPerOver,
          playersPerTeam: state.playersPerTeam,
          rules: state.rules,
          toss: state.toss,
          teamAPlayers: state.teamAPlayers,
          teamBPlayers: state.teamBPlayers,
        };
        matchId = await matchesRepository.createMatchFromDraft(draftData, 'DRAFT');
        set({ activeMatchId: matchId });
      }

      // Fetch saved players to find their UUIDs
      const players = await playersRepository.getMatchPlayers(matchId);
      const allPlayers = [...players.teamAPlayers, ...players.teamBPlayers];

      const striker = allPlayers.find((p) => p.name === state.strikerName);
      const nonStriker = allPlayers.find((p) => p.name === state.nonStrikerName);
      const bowler = allPlayers.find((p) => p.name === state.openingBowlerName);

      const strikerId = striker?.id || allPlayers[0]?.id || '';
      const nonStrikerId = nonStriker?.id || allPlayers[1]?.id || '';
      const bowlerId = bowler?.id || allPlayers[allPlayers.length - 1]?.id || '';

      await matchesRepository.updateOpenersAndReady(matchId, strikerId, nonStrikerId, bowlerId);

      set({ isSaving: false });
      return matchId;
    } catch (err) {
      set({ isSaving: false });
      throw err;
    }
  },
}));
