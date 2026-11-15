/**
 * GullyScore MatchRulesCard Component
 * Expandable advanced match rules configuration
 */

import React, { useState } from 'react';
import { View, StyleSheet, Switch, Pressable } from 'react-native';
import { MatchRules } from '../../domain/match.types';
import { colors, radius, spacing } from '../../theme';
import { AppCard } from '../ui/AppCard';
import { AppText } from '../ui/AppText';
import { AppDivider } from '../ui/AppDivider';
import { ChevronDown, ChevronUp, Sliders } from 'lucide-react-native';
import { appHaptics } from '../../utils/haptics';

export interface MatchRulesCardProps {
  rules: MatchRules;
  onChange: (rules: Partial<MatchRules>) => void;
}

export const MatchRulesCard: React.FC<MatchRulesCardProps> = ({
  rules,
  onChange,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    appHaptics.light();
    setExpanded((prev) => !prev);
  };

  return (
    <AppCard variant="elevated" padding="md" style={styles.card}>
      <Pressable onPress={toggleExpand} style={styles.header}>
        <View style={styles.headerLeft}>
          <Sliders size={18} color={colors.accentPrimary} />
          <View style={styles.headerTitles}>
            <AppText variant="title" weight="bold">
              Match Rules & Extras
            </AppText>
            <AppText variant="caption" color="secondary">
              Free hit, wide penalty, LBW rules
            </AppText>
          </View>
        </View>
        {expanded ? (
          <ChevronUp size={20} color={colors.textSecondary} />
        ) : (
          <ChevronDown size={20} color={colors.textSecondary} />
        )}
      </Pressable>

      {expanded && (
        <View style={styles.expandedContent}>
          <AppDivider marginVertical="sm" />

          {/* Free Hit */}
          <View style={styles.ruleRow}>
            <View style={styles.ruleInfo}>
              <AppText variant="body" weight="medium">
                Free Hit on No-Ball
              </AppText>
              <AppText variant="caption" color="muted">
                Batter cannot be dismissed off next delivery
              </AppText>
            </View>
            <Switch
              value={rules.freeHitEnabled}
              onValueChange={(val) => {
                appHaptics.selection();
                onChange({ freeHitEnabled: val });
              }}
              trackColor={{ false: colors.border, true: colors.accentPrimary }}
              thumbColor={colors.textPrimary}
            />
          </View>

          <AppDivider marginVertical="xs" />

          {/* LBW */}
          <View style={styles.ruleRow}>
            <View style={styles.ruleInfo}>
              <AppText variant="body" weight="medium">
                LBW Dismissal
              </AppText>
              <AppText variant="caption" color="muted">
                Usually disabled in informal gully cricket
              </AppText>
            </View>
            <Switch
              value={rules.lbwEnabled}
              onValueChange={(val) => {
                appHaptics.selection();
                onChange({ lbwEnabled: val });
              }}
              trackColor={{ false: colors.border, true: colors.accentPrimary }}
              thumbColor={colors.textPrimary}
            />
          </View>

          <AppDivider marginVertical="xs" />

          {/* Last Man Batting */}
          <View style={styles.ruleRow}>
            <View style={styles.ruleInfo}>
              <AppText variant="body" weight="medium">
                Last Man Batting
              </AppText>
              <AppText variant="caption" color="muted">
                Sole surviving batter can continue batting
              </AppText>
            </View>
            <Switch
              value={rules.lastManBatting}
              onValueChange={(val) => {
                appHaptics.selection();
                onChange({ lastManBatting: val });
              }}
              trackColor={{ false: colors.border, true: colors.accentPrimary }}
              thumbColor={colors.textPrimary}
            />
          </View>

          <AppDivider marginVertical="xs" />

          {/* Wide & No-Ball Runs Summary */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryBadge}>
              <AppText variant="caption" color="secondary">
                Wide Penalty:
              </AppText>
              <AppText variant="caption" weight="bold" color="accent">
                +{rules.wideRuns} Run
              </AppText>
            </View>
            <View style={styles.summaryBadge}>
              <AppText variant="caption" color="secondary">
                No-Ball Penalty:
              </AppText>
              <AppText variant="caption" weight="bold" color="accent">
                +{rules.noBallRuns} Run
              </AppText>
            </View>
          </View>
        </View>
      )}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  headerTitles: {
    flex: 1,
  },
  expandedContent: {
    marginTop: spacing.xs,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  ruleInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceHover,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
});
