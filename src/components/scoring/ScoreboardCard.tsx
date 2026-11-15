/**
 * GullyScore Primary ScoreboardCard Component (Section B)
 * Oversized high-contrast scoreboard display
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppCard } from '../ui/AppCard';
import { AppText } from '../ui/AppText';

export interface ScoreboardCardProps {
  totalRuns: number;
  wickets: number;
  oversText: string;
  maxOvers: number;
  currentRunRate: number;
  target?: number;
  requiredRunRate?: number;
  battingTeamName: string;
}

export const ScoreboardCard: React.FC<ScoreboardCardProps> = ({
  totalRuns,
  wickets,
  oversText,
  maxOvers,
  currentRunRate,
  target,
  requiredRunRate,
  battingTeamName,
}) => {
  return (
    <AppCard variant="elevated" padding="lg" style={styles.card}>
      {/* Batting team title */}
      <View style={styles.teamHeader}>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <AppText variant="caption" weight="bold" color="accent" style={styles.liveText}>
            BATTING
          </AppText>
        </View>
        <AppText variant="title" weight="bold" color="primary" numberOfLines={1}>
          {battingTeamName}
        </AppText>
      </View>

      {/* Primary Score & Overs Display */}
      <View style={styles.primaryDisplay}>
        <View style={styles.scoreContainer}>
          <AppText variant="scoreboardLg" weight="black" color="accent">
            {totalRuns}
            <AppText variant="scoreboard" color="secondary" weight="bold">
              /{wickets}
            </AppText>
          </AppText>
        </View>

        <View style={styles.oversContainer}>
          <AppText variant="caption" color="secondary" weight="semibold">
            OVERS
          </AppText>
          <AppText variant="h2" weight="heavy" color="primary">
            {oversText}
            <AppText variant="title" color="muted">
              /{maxOvers}
            </AppText>
          </AppText>
        </View>
      </View>

      {/* Run Rate & Target Information */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <AppText variant="caption" color="muted" weight="semibold">
            CURRENT RR
          </AppText>
          <AppText variant="title" weight="heavy" color="accentSecondary">
            {currentRunRate.toFixed(2)}
          </AppText>
        </View>

        {target !== undefined && (
          <View style={styles.statBox}>
            <AppText variant="caption" color="muted" weight="semibold">
              TARGET
            </AppText>
            <AppText variant="title" weight="heavy" color="warning">
              {target}
            </AppText>
          </View>
        )}

        {requiredRunRate !== undefined && (
          <View style={styles.statBox}>
            <AppText variant="caption" color="muted" weight="semibold">
              REQ RR
            </AppText>
            <AppText variant="title" weight="heavy" color="danger">
              {requiredRunRate.toFixed(2)}
            </AppText>
          </View>
        )}
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    marginBottom: spacing.base,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentPrimaryMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.accentPrimary,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.accentPrimary,
    marginRight: 4,
  },
  liveText: {
    letterSpacing: 0.5,
  },
  primaryDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  scoreContainer: {
    flex: 1,
  },
  oversContainer: {
    alignItems: 'flex-end',
    paddingBottom: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.md,
  },
  statBox: {
    alignItems: 'center',
  },
});
