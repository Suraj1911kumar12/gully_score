/**
 * GullyScore BowlerScoreRow Component (Section D)
 * Displays active bowler figures and economy rate
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';
import { AppCard } from '../ui/AppCard';
import { AppText } from '../ui/AppText';
import { BowlingScoreRow as BowlingScoreRowType } from '../../domain/scoring.types';

export interface BowlerScoreRowProps {
  bowler: BowlingScoreRowType;
}

export const BowlerScoreRow: React.FC<BowlerScoreRowProps> = ({ bowler }) => {
  return (
    <AppCard variant="elevated" padding="none" style={styles.container}>
      <View style={styles.header}>
        <View style={styles.nameCol}>
          <AppText variant="caption" color="muted" weight="bold">
            BOWLER
          </AppText>
        </View>
        <View style={styles.statCol}>
          <AppText variant="caption" color="muted" weight="bold" align="center">
            O
          </AppText>
        </View>
        <View style={styles.statCol}>
          <AppText variant="caption" color="muted" weight="bold" align="center">
            M
          </AppText>
        </View>
        <View style={styles.statCol}>
          <AppText variant="caption" color="muted" weight="bold" align="center">
            R
          </AppText>
        </View>
        <View style={styles.statCol}>
          <AppText variant="caption" color="muted" weight="bold" align="center">
            W
          </AppText>
        </View>
        <View style={[styles.statCol, styles.econCol]}>
          <AppText variant="caption" color="muted" weight="bold" align="right">
            ECON
          </AppText>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.nameCol}>
          <AppText variant="body" weight="bold" color="primary" numberOfLines={1}>
            {bowler.name}
          </AppText>
        </View>

        <View style={styles.statCol}>
          <AppText variant="body" color="primary" align="center">
            {bowler.overs}
          </AppText>
        </View>

        <View style={styles.statCol}>
          <AppText variant="bodySmall" color="secondary" align="center">
            {bowler.maidens}
          </AppText>
        </View>

        <View style={styles.statCol}>
          <AppText variant="bodySmall" color="secondary" align="center">
            {bowler.runs}
          </AppText>
        </View>

        <View style={styles.statCol}>
          <AppText variant="body" weight="heavy" color="danger" align="center">
            {bowler.wickets}
          </AppText>
        </View>

        <View style={[styles.statCol, styles.econCol]}>
          <AppText variant="bodySmall" color="accentSecondary" weight="semibold" align="right">
            {bowler.economy.toFixed(2)}
          </AppText>
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceCard,
    marginBottom: spacing.base,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  nameCol: {
    flex: 2.2,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  econCol: {
    flex: 1.3,
    alignItems: 'flex-end',
  },
});
