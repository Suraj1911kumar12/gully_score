/**
 * GullyScore BatterScoreRow Component (Section C)
 * Displays batting stats for active batters with striker indicators
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppCard } from '../ui/AppCard';
import { AppText } from '../ui/AppText';
import { BattingScoreRow as BattingScoreRowType } from '../../domain/scoring.types';

export interface BatterScoreRowProps {
  striker: BattingScoreRowType;
  nonStriker: BattingScoreRowType;
}

export const BatterScoreRow: React.FC<BatterScoreRowProps> = ({
  striker,
  nonStriker,
}) => {
  const renderRow = (batter: BattingScoreRowType, isStriker: boolean) => (
    <View style={[styles.row, isStriker && styles.strikerRow]}>
      <View style={styles.nameCol}>
        <View style={styles.nameRow}>
          {isStriker && <View style={styles.strikerDot} />}
          <AppText
            variant="body"
            weight={isStriker ? 'bold' : 'medium'}
            color={isStriker ? 'accent' : 'primary'}
            numberOfLines={1}
          >
            {batter.name}
            {isStriker ? ' *' : ''}
          </AppText>
        </View>
      </View>

      <View style={styles.statCol}>
        <AppText variant="body" weight="bold" color="primary" align="center">
          {batter.runs}
        </AppText>
      </View>

      <View style={styles.statCol}>
        <AppText variant="bodySmall" color="secondary" align="center">
          {batter.balls}
        </AppText>
      </View>

      <View style={styles.statCol}>
        <AppText variant="bodySmall" color="secondary" align="center">
          {batter.fours}
        </AppText>
      </View>

      <View style={styles.statCol}>
        <AppText variant="bodySmall" color="secondary" align="center">
          {batter.sixes}
        </AppText>
      </View>

      <View style={[styles.statCol, styles.srCol]}>
        <AppText variant="bodySmall" color="accentSecondary" weight="semibold" align="right">
          {batter.strikeRate.toFixed(1)}
        </AppText>
      </View>
    </View>
  );

  return (
    <AppCard variant="elevated" padding="none" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.nameCol}>
          <AppText variant="caption" color="muted" weight="bold">
            BATTER
          </AppText>
        </View>
        <View style={styles.statCol}>
          <AppText variant="caption" color="muted" weight="bold" align="center">
            R
          </AppText>
        </View>
        <View style={styles.statCol}>
          <AppText variant="caption" color="muted" weight="bold" align="center">
            B
          </AppText>
        </View>
        <View style={styles.statCol}>
          <AppText variant="caption" color="muted" weight="bold" align="center">
            4s
          </AppText>
        </View>
        <View style={styles.statCol}>
          <AppText variant="caption" color="muted" weight="bold" align="center">
            6s
          </AppText>
        </View>
        <View style={[styles.statCol, styles.srCol]}>
          <AppText variant="caption" color="muted" weight="bold" align="right">
            SR
          </AppText>
        </View>
      </View>

      {renderRow(striker, true)}
      <View style={styles.divider} />
      {renderRow(nonStriker, false)}
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
  strikerRow: {
    backgroundColor: colors.surfaceHover,
  },
  nameCol: {
    flex: 2.2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  strikerDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.accentPrimary,
    marginRight: 6,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  srCol: {
    flex: 1.3,
    alignItems: 'flex-end',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
