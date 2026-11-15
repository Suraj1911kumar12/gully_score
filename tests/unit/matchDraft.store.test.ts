import { useMatchDraftStore } from '../../src/stores/matchDraft.store';

describe('useMatchDraftStore', () => {
  beforeEach(() => {
    useMatchDraftStore.getState().resetDraft();
  });

  it('initializes with production defaults', () => {
    const state = useMatchDraftStore.getState();
    expect(state.teamAName).toBe('Team A');
    expect(state.teamBName).toBe('Team B');
    expect(state.overs).toBe(5);
    expect(state.ballsPerOver).toBe(6);
    expect(state.playersPerTeam).toBe(11);
    expect(state.rules.wideRuns).toBe(1);
    expect(state.rules.freeHitEnabled).toBe(true);
    expect(state.teamAPlayers.length).toBe(11);
    expect(state.teamBPlayers.length).toBe(11);
  });

  it('updates team names and format', () => {
    const store = useMatchDraftStore.getState();
    store.setTeamAName('Gully Kings');
    store.setTeamBName('Street Warriors');
    store.setOvers(10);
    store.setBallsPerOver(8);

    const updated = useMatchDraftStore.getState();
    expect(updated.teamAName).toBe('Gully Kings');
    expect(updated.teamBName).toBe('Street Warriors');
    expect(updated.overs).toBe(10);
    expect(updated.ballsPerOver).toBe(8);
  });

  it('resizes squads when player count changes', () => {
    const store = useMatchDraftStore.getState();
    store.setPlayersPerTeam(6);

    const updated = useMatchDraftStore.getState();
    expect(updated.playersPerTeam).toBe(6);
    expect(updated.teamAPlayers.length).toBe(6);
    expect(updated.teamBPlayers.length).toBe(6);
  });

  it('updates individual player names in team lists', () => {
    const store = useMatchDraftStore.getState();
    store.updateTeamAPlayer(0, 'Rohit Sharma');
    store.updateTeamBPlayer(1, 'Jasprit Bumrah');

    const updated = useMatchDraftStore.getState();
    expect(updated.teamAPlayers[0]).toBe('Rohit Sharma');
    expect(updated.teamBPlayers[1]).toBe('Jasprit Bumrah');
  });

  it('can reset back to initial defaults', () => {
    const store = useMatchDraftStore.getState();
    store.setTeamAName('Custom Team');
    store.setOvers(20);
    store.resetDraft();

    const reset = useMatchDraftStore.getState();
    expect(reset.teamAName).toBe('Team A');
    expect(reset.overs).toBe(5);
  });
});
