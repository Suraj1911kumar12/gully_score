/**
 * GullyScore Innings Break Screen
 * Route: /match/[id]/innings-break
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, radius, spacing } from '../../../src/theme';
import { AppScreen } from '../../../src/components/ui/AppScreen';
import { AppHeader } from '../../../src/components/ui/AppHeader';
import { AppText } from '../../../src/components/ui/AppText';
import { AppCard } from '../../../src/components/ui/AppCard';
import { AppButton } from '../../../src/components/ui/AppButton';
import { matchesRepository } from '../../../src/database/repositories/matches.repository';
import { playersRepository } from '../../../src/database/repositories/players.repository';
import { MatchEntity } from '../../../src/domain/match.types';
import { MatchPlayerEntity } from '../../../src/domain/player.types';
import { useUIStore } from '../../../src/stores/ui.store';
import { appHaptics } from '../../../src/utils/haptics';
import { ArrowRight, Target, Clock, Sparkles } from 'lucide-react-native';

export default function InningsBreakScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const openPhase2Modal = useUIStore((s) => s.openPhase2Modal);

  const [match, setMatch] = useState<MatchEntity | null>(null);
  const [teamAPlayers, setTeamAPlayers] = useState<MatchPlayerEntity[]>([]);
  const [teamBPlayers, setTeamBPlayers] = useState<MatchPlayerEntity[]>([]);

  const [selectedStriker, setSelectedStriker] = useState<string>('');
  const [selectedNonStriker, setSelectedNonStriker] = useState<string>('');
  const [selectedBowler, setSelectedBowler] = useState<string>('');

  useEffect(() => {
    async function load() {
      if (id) {
        const found = await matchesRepository.getMatchById(id);
        if (found) setMatch(found);
        const players = await playersRepository.getMatchPlayers(id);
        setTeamAPlayers(players.teamAPlayers);
        setTeamBPlayers(players.teamBPlayers);

        // Preselect second innings openers
        if (players.teamBPlayers.length >= 2) {
          setSelectedStriker(players.teamBPlayers[0].name);
          setSelectedNonStriker(players.teamBPlayers[1].name);
        }
        if (players.teamAPlayers.length >= 1) {
          setSelectedBowler(players.teamAPlayers[0].name);
        }
      }
    }
    load();
  }, [id]);

  const teamAName = match?.teamA.name || 'Gully Strikers';
  const teamBName = match?.teamB.name || 'Street Kings';
  const overs = match?.config.overs || 10;

  // Preview target data
  const firstInningsScore = 142;
  const firstInningsWickets = 6;
  const targetRuns = firstInningsScore + 1;

  const secondInningsBattingPlayers = teamBPlayers.length > 0 ? teamBPlayers : [
    { id: '1', name: 'Rohit Sharma' },
    { id: '2', name: 'Virat Kohli' },
    { id: '3', name: 'Suryakumar Yadav' },
  ];

  const secondInningsBowlingPlayers = teamAPlayers.length > 0 ? teamAPlayers : [
    { id: '4', name: 'Jasprit Bumrah' },
    { id: '5', name: 'Mohammed Siraj' },
  ];

  const handleStartSecondInnings = () => {
    appHaptics.medium();
    openPhase2Modal('Second Innings Transition & Live Match Simulation');
  };

  return (
    <AppScreen scrollable edges={['top', 'left', 'right']}>
      <AppHeader
        title="Innings Break"
        subtitle="Mid-Match Target & Openers"
        showBack
      />

      <View style={styles.content}>
        {/* Phase 1 Notice */}
        <View style={styles.noticeBox}>
          <Sparkles size={14} color={colors.accentPrimary} />
          <AppText variant="caption" color="accent" weight="bold">
            PHASE 1 INNINGS BREAK PREVIEW
          </AppText>
        </View>

        {/* 1. First Innings Summary */}
        <AppCard variant="elevated" padding="lg" style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <AppText variant="caption" color="secondary" weight="semibold">
                FIRST INNINGS FINISHED
              </AppText>
              <AppText variant="h2" weight="black" color="primary">
                {teamAName}
              </AppText>
            </View>
            <View style={styles.scoreBox}>
              <AppText variant="scoreboard" weight="black" color="accent">
                {firstInningsScore}/{firstInningsWickets}
              </AppText>
              <AppText variant="caption" color="secondary" align="right">
                ({overs}.0 Overs)
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* 2. Target Display */}
        <AppCard variant="elevated" padding="md" style={styles.targetCard}>
          <View style={styles.targetRow}>
            <View style={styles.targetIcon}>
              <Target size={28} color={colors.warning} />
            </View>
            <View style={styles.targetInfo}>
              <AppText variant="caption" color="secondary" weight="bold">
                TARGET TO CHASE
              </AppText>
              <AppText variant="h1" weight="black" color="warning">
                {targetRuns} RUNS
              </AppText>
              <AppText variant="caption" color="muted">
                {teamBName} requires {targetRuns} runs from {overs} overs (RRR: {(targetRuns / overs).toFixed(2)})
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* 3. Second Innings Openers Selection */}
        <AppCard variant="elevated" padding="md" style={styles.openersCard}>
          <AppText variant="title" weight="bold">
            Select 2nd Innings Openers
          </AppText>
          <AppText variant="caption" color="secondary" style={styles.openersSub}>
            Batting: {teamBName} | Bowling: {teamAName}
          </AppText>

          {/* Striker */}
          <AppText variant="caption" color="muted" weight="bold" style={styles.pickerLabel}>
            STRIKER ({teamBName})
          </AppText>
          <View style={styles.chipRow}>
            {secondInningsBattingPlayers.map((p) => {
              const isSelected = selectedStriker === p.name;
              return (
                <Pressable
                  key={`striker-${p.name}`}
                  onPress={() => {
                    appHaptics.selection();
                    setSelectedStriker(p.name);
                  }}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <AppText
                    variant="caption"
                    weight={isSelected ? 'bold' : 'medium'}
                    color={isSelected ? 'inverse' : 'primary'}
                  >
                    {p.name}
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          {/* Non-Striker */}
          <AppText variant="caption" color="muted" weight="bold" style={styles.pickerLabel}>
            NON-STRIKER ({teamBName})
          </AppText>
          <View style={styles.chipRow}>
            {secondInningsBattingPlayers.map((p) => {
              const isSelected = selectedNonStriker === p.name;
              return (
                <Pressable
                  key={`nonstriker-${p.name}`}
                  onPress={() => {
                    appHaptics.selection();
                    setSelectedNonStriker(p.name);
                  }}
                  style={[styles.chip, isSelected && styles.chipSelectedSecondary]}
                >
                  <AppText
                    variant="caption"
                    weight={isSelected ? 'bold' : 'medium'}
                    color={isSelected ? 'inverse' : 'primary'}
                  >
                    {p.name}
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          {/* Opening Bowler */}
          <AppText variant="caption" color="muted" weight="bold" style={styles.pickerLabel}>
            OPENING BOWLER ({teamAName})
          </AppText>
          <View style={styles.chipRow}>
            {secondInningsBowlingPlayers.map((p) => {
              const isSelected = selectedBowler === p.name;
              return (
                <Pressable
                  key={`bowler-${p.name}`}
                  onPress={() => {
                    appHaptics.selection();
                    setSelectedBowler(p.name);
                  }}
                  style={[styles.chip, isSelected && styles.chipSelectedWarning]}
                >
                  <AppText
                    variant="caption"
                    weight={isSelected ? 'bold' : 'medium'}
                    color={isSelected ? 'inverse' : 'primary'}
                  >
                    {p.name}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </AppCard>

        {/* CTA */}
        <AppButton
          title="Start Second Innings"
          variant="primary"
          size="lg"
          onPress={handleStartSecondInnings}
          icon={<ArrowRight size={20} color={colors.textInverse} />}
          iconPosition="right"
          fullWidth
          style={styles.cta}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.base,
    paddingBottom: spacing['4xl'],
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    backgroundColor: colors.surfaceHover,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.base,
  },
  summaryCard: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    marginBottom: spacing.base,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreBox: {
    alignItems: 'flex-end',
  },
  targetCard: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 1.5,
    borderColor: colors.warning,
    marginBottom: spacing.base,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  targetIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.warningMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetInfo: {
    flex: 1,
  },
  openersCard: {
    marginBottom: spacing.lg,
  },
  openersSub: {
    marginBottom: spacing.md,
    marginTop: 2,
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
  chipSelectedWarning: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  cta: {
    marginTop: spacing.xs,
  },
});
