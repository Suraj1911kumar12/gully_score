/**
 * GullyScore Players Setup Screen
 * Route: /match/players
 */

import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius, spacing } from '../../src/theme';
import { AppScreen } from '../../src/components/ui/AppScreen';
import { AppHeader } from '../../src/components/ui/AppHeader';
import { AppButton } from '../../src/components/ui/AppButton';
import { AppText } from '../../src/components/ui/AppText';
import { AppCard } from '../../src/components/ui/AppCard';
import { AppInput } from '../../src/components/ui/AppInput';
import { AppIconButton } from '../../src/components/ui/AppIconButton';
import { AppModal } from '../../src/components/ui/AppModal';
import { AppBadge } from '../../src/components/ui/AppBadge';
import { useMatchDraftStore } from '../../src/stores/matchDraft.store';
import { openingSelectionsSchema } from '../../src/utils/validation';
import {
  Users,
  Plus,
  Trash2,
  CheckCircle,
  Play,
  UserCheck,
} from 'lucide-react-native';
import { appHaptics } from '../../src/utils/haptics';

export default function PlayersSetupScreen() {
  const router = useRouter();
  const draft = useMatchDraftStore();

  const [activeTab, setActiveTab] = useState<'TEAM_A' | 'TEAM_B'>('TEAM_A');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Determine which team bats first based on toss
  const battingTeamSide = useMemo(() => {
    if (draft.toss.isSkipped) {
      return draft.toss.winner; // winner bats first
    }
    if (draft.toss.winner === 'TEAM_A') {
      return draft.toss.decision === 'BAT' ? 'TEAM_A' : 'TEAM_B';
    }
    return draft.toss.decision === 'BAT' ? 'TEAM_B' : 'TEAM_A';
  }, [draft.toss]);

  const battingPlayers = battingTeamSide === 'TEAM_A' ? draft.teamAPlayers : draft.teamBPlayers;
  const bowlingPlayers = battingTeamSide === 'TEAM_A' ? draft.teamBPlayers : draft.teamAPlayers;

  const currentTeamName = activeTab === 'TEAM_A' ? draft.teamAName : draft.teamBName;
  const currentPlayers = activeTab === 'TEAM_A' ? draft.teamAPlayers : draft.teamBPlayers;

  // Initialize openers if not selected yet
  const strikerName = draft.strikerName || battingPlayers[0] || '';
  const nonStrikerName = draft.nonStrikerName || battingPlayers[1] || '';
  const openingBowlerName = draft.openingBowlerName || bowlingPlayers[0] || '';

  const handlePlayerNameChange = (index: number, newName: string) => {
    if (activeTab === 'TEAM_A') {
      draft.updateTeamAPlayer(index, newName);
    } else {
      draft.updateTeamBPlayer(index, newName);
    }
  };

  const handleAddPlayer = () => {
    appHaptics.light();
    if (activeTab === 'TEAM_A') {
      draft.addPlayerToTeamA();
    } else {
      draft.addPlayerToTeamB();
    }
  };

  const handleRemovePlayer = (index: number) => {
    appHaptics.light();
    if (activeTab === 'TEAM_A') {
      if (draft.teamAPlayers.length <= 3) {
        alert('Each team must have at least 3 players.');
        return;
      }
      draft.removePlayerFromTeamA(index);
    } else {
      if (draft.teamBPlayers.length <= 3) {
        alert('Each team must have at least 3 players.');
        return;
      }
      draft.removePlayerFromTeamB(index);
    }
  };

  const handleValidateAndReview = () => {
    setErrorMessage(null);

    // Validate player names are non-empty
    const emptyPlayerA = draft.teamAPlayers.find((p) => !p.trim());
    if (emptyPlayerA !== undefined) {
      setErrorMessage(`Please enter a valid name for all ${draft.teamAName} players.`);
      return;
    }

    const emptyPlayerB = draft.teamBPlayers.find((p) => !p.trim());
    if (emptyPlayerB !== undefined) {
      setErrorMessage(`Please enter a valid name for all ${draft.teamBName} players.`);
      return;
    }

    // Validate openers
    const validationResult = openingSelectionsSchema.safeParse({
      striker: strikerName,
      nonStriker: nonStrikerName,
      openingBowler: openingBowlerName,
      battingPlayers,
      bowlingPlayers,
    });

    if (!validationResult.success) {
      setErrorMessage(validationResult.error.issues[0].message);
      return;
    }

    // Save opener selections to store
    draft.setStrikerName(strikerName);
    draft.setNonStrikerName(nonStrikerName);
    draft.setOpeningBowlerName(openingBowlerName);

    appHaptics.success();
    setShowReviewModal(true);
  };

  const handleFinalizeMatch = async () => {
    try {
      setShowReviewModal(false);
      const matchId = await draft.finalizeAndSaveReady();
      appHaptics.success();
      // Navigate to live scoring preview
      router.replace(`/match/${matchId}/live`);
    } catch (e) {
      console.error('[PlayersSetup] Error finalizing match:', e);
      alert('Could not save match to database. Please try again.');
    }
  };

  return (
    <AppScreen scrollable edges={['top', 'left', 'right']}>
      <AppHeader
        title="Players Setup"
        subtitle="Step 2 of 2: Squads & Openers"
        showBack
      />

      <View style={styles.content}>
        {/* Team Switching Tabs */}
        <View style={styles.tabsContainer}>
          <Pressable
            onPress={() => {
              appHaptics.selection();
              setActiveTab('TEAM_A');
            }}
            style={[
              styles.tab,
              activeTab === 'TEAM_A' && styles.tabActiveA,
            ]}
          >
            <AppText
              variant="title"
              weight="bold"
              color={activeTab === 'TEAM_A' ? 'inverse' : 'secondary'}
              numberOfLines={1}
            >
              {draft.teamAName} ({draft.teamAPlayers.length})
            </AppText>
          </Pressable>

          <Pressable
            onPress={() => {
              appHaptics.selection();
              setActiveTab('TEAM_B');
            }}
            style={[
              styles.tab,
              activeTab === 'TEAM_B' && styles.tabActiveB,
            ]}
          >
            <AppText
              variant="title"
              weight="bold"
              color={activeTab === 'TEAM_B' ? 'inverse' : 'secondary'}
              numberOfLines={1}
            >
              {draft.teamBName} ({draft.teamBPlayers.length})
            </AppText>
          </Pressable>
        </View>

        {/* Players List for Active Tab */}
        <AppCard variant="elevated" padding="md" style={styles.playersCard}>
          <View style={styles.cardHeader}>
            <View style={styles.teamBadgeRow}>
              <Users size={16} color={colors.accentPrimary} />
              <AppText variant="caption" weight="heavy" color="accent">
                {currentTeamName} SQUAD
              </AppText>
            </View>

            <AppButton
              title="Add Player"
              size="sm"
              variant="secondary"
              onPress={handleAddPlayer}
              icon={<Plus size={14} color={colors.textPrimary} />}
            />
          </View>

          {currentPlayers.map((player, idx) => (
            <View key={idx} style={styles.playerRow}>
              <View style={styles.orderBadge}>
                <AppText variant="caption" weight="bold" color="muted">
                  #{idx + 1}
                </AppText>
              </View>

              <AppInput
                value={player}
                onChangeText={(val) => handlePlayerNameChange(idx, val)}
                placeholder={`Player ${idx + 1}`}
                containerStyle={styles.inputContainer}
              />

              <AppIconButton
                icon={<Trash2 size={16} color={colors.textMuted} />}
                onPress={() => handleRemovePlayer(idx)}
                size="sm"
                variant="ghost"
                accessibilityLabel={`Remove player ${idx + 1}`}
              />
            </View>
          ))}
        </AppCard>

        {/* Opening Players Selectors */}
        <AppCard variant="elevated" padding="md" style={styles.openersCard}>
          <View style={styles.openersHeader}>
            <UserCheck size={18} color={colors.accentSecondary} />
            <AppText variant="title" weight="bold">
              Opening Players Selection
            </AppText>
          </View>
          <AppText variant="caption" color="secondary" style={styles.openersSub}>
            Batting: {battingTeamSide === 'TEAM_A' ? draft.teamAName : draft.teamBName} | Bowling: {battingTeamSide === 'TEAM_A' ? draft.teamBName : draft.teamAName}
          </AppText>

          {/* Striker Picker */}
          <AppText variant="caption" color="muted" weight="bold" style={styles.pickerLabel}>
            STRIKER (BATTING)
          </AppText>
          <View style={styles.chipRow}>
            {battingPlayers.map((name) => {
              const isSelected = strikerName === name;
              return (
                <Pressable
                  key={`striker-${name}`}
                  onPress={() => {
                    appHaptics.selection();
                    draft.setStrikerName(name);
                  }}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <AppText
                    variant="caption"
                    weight={isSelected ? 'bold' : 'medium'}
                    color={isSelected ? 'inverse' : 'primary'}
                  >
                    {name}
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          {/* Non-Striker Picker */}
          <AppText variant="caption" color="muted" weight="bold" style={styles.pickerLabel}>
            NON-STRIKER (BATTING)
          </AppText>
          <View style={styles.chipRow}>
            {battingPlayers.map((name) => {
              const isSelected = nonStrikerName === name;
              return (
                <Pressable
                  key={`nonstriker-${name}`}
                  onPress={() => {
                    appHaptics.selection();
                    draft.setNonStrikerName(name);
                  }}
                  style={[styles.chip, isSelected && styles.chipSelectedSecondary]}
                >
                  <AppText
                    variant="caption"
                    weight={isSelected ? 'bold' : 'medium'}
                    color={isSelected ? 'inverse' : 'primary'}
                  >
                    {name}
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          {/* Opening Bowler Picker */}
          <AppText variant="caption" color="muted" weight="bold" style={styles.pickerLabel}>
            OPENING BOWLER (BOWLING)
          </AppText>
          <View style={styles.chipRow}>
            {bowlingPlayers.map((name) => {
              const isSelected = openingBowlerName === name;
              return (
                <Pressable
                  key={`bowler-${name}`}
                  onPress={() => {
                    appHaptics.selection();
                    draft.setOpeningBowlerName(name);
                  }}
                  style={[styles.chip, isSelected && styles.chipSelectedBowler]}
                >
                  <AppText
                    variant="caption"
                    weight={isSelected ? 'bold' : 'medium'}
                    color={isSelected ? 'inverse' : 'primary'}
                  >
                    {name}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </AppCard>

        {errorMessage && (
          <View style={styles.errorBanner}>
            <AppText variant="caption" color="danger" weight="semibold">
              {errorMessage}
            </AppText>
          </View>
        )}

        {/* Primary CTA */}
        <AppButton
          title="Review Match"
          variant="primary"
          size="lg"
          onPress={handleValidateAndReview}
          fullWidth
          style={styles.reviewCTA}
        />
      </View>

      {/* Review Match Confirmation Modal */}
      <AppModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Match Summary"
      >
        <View style={styles.modalContent}>
          <View style={styles.summaryRow}>
            <AppText variant="bodySmall" color="secondary">
              Format:
            </AppText>
            <AppText variant="bodySmall" weight="bold">
              {draft.overs} Overs ({draft.ballsPerOver} balls/over)
            </AppText>
          </View>

          <View style={styles.summaryRow}>
            <AppText variant="bodySmall" color="secondary">
              Teams:
            </AppText>
            <AppText variant="bodySmall" weight="bold">
              {draft.teamAName} vs {draft.teamBName}
            </AppText>
          </View>

          <View style={styles.summaryRow}>
            <AppText variant="bodySmall" color="secondary">
              Batting First:
            </AppText>
            <AppBadge
              label={battingTeamSide === 'TEAM_A' ? draft.teamAName : draft.teamBName}
              variant="accent"
              size="sm"
            />
          </View>

          <View style={styles.summaryRow}>
            <AppText variant="bodySmall" color="secondary">
              Striker:
            </AppText>
            <AppText variant="bodySmall" weight="bold" color="accent">
              {strikerName}
            </AppText>
          </View>

          <View style={styles.summaryRow}>
            <AppText variant="bodySmall" color="secondary">
              Non-Striker:
            </AppText>
            <AppText variant="bodySmall" weight="bold" color="accentSecondary">
              {nonStrikerName}
            </AppText>
          </View>

          <View style={styles.summaryRow}>
            <AppText variant="bodySmall" color="secondary">
              Opening Bowler:
            </AppText>
            <AppText variant="bodySmall" weight="bold" color="warning">
              {openingBowlerName}
            </AppText>
          </View>

          <View style={styles.modalNotice}>
            <AppText variant="caption" color="secondary">
              Match will be saved to your local SQLite database with status READY.
            </AppText>
          </View>

          <AppButton
            title="Start Match Preview"
            variant="primary"
            size="lg"
            onPress={handleFinalizeMatch}
            loading={draft.isSaving}
            icon={<Play size={18} color={colors.textInverse} />}
            fullWidth
            style={styles.modalCTA}
          />
        </View>
      </AppModal>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.base,
    paddingBottom: spacing['4xl'],
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActiveA: {
    backgroundColor: colors.accentPrimary,
    borderColor: colors.accentPrimary,
  },
  tabActiveB: {
    backgroundColor: colors.accentSecondary,
    borderColor: colors.accentSecondary,
  },
  playersCard: {
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  teamBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  orderBadge: {
    width: 32,
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  openersCard: {
    marginBottom: spacing.lg,
  },
  openersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  openersSub: {
    marginBottom: spacing.md,
  },
  pickerLabel: {
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
    marginBottom: spacing.xs,
  },
  chip: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.accentPrimary,
    borderColor: colors.accentPrimary,
  },
  chipSelectedSecondary: {
    backgroundColor: colors.accentSecondary,
    borderColor: colors.accentSecondary,
  },
  chipSelectedBowler: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  errorBanner: {
    backgroundColor: colors.dangerMuted,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  reviewCTA: {
    marginTop: spacing.sm,
  },
  modalContent: {
    gap: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  modalNotice: {
    backgroundColor: colors.surfaceHover,
    padding: spacing.md,
    borderRadius: radius.md,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  modalCTA: {
    marginTop: spacing.xs,
  },
});
