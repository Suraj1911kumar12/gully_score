/**
 * GullyScore TossSelector Component
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { TossResult, TossWinner, TossDecision } from '../../domain/match.types';
import { colors, radius, spacing } from '../../theme';
import { AppText } from '../ui/AppText';
import { AppCard } from '../ui/AppCard';
import { Coins, Check } from 'lucide-react-native';
import { appHaptics } from '../../utils/haptics';

export interface TossSelectorProps {
  teamAName: string;
  teamBName: string;
  toss: TossResult;
  onChange: (toss: TossResult) => void;
}

export const TossSelector: React.FC<TossSelectorProps> = ({
  teamAName,
  teamBName,
  toss,
  onChange,
}) => {
  const handleWinnerChange = (winner: TossWinner) => {
    appHaptics.selection();
    onChange({ ...toss, winner, isSkipped: false });
  };

  const handleDecisionChange = (decision: TossDecision) => {
    appHaptics.selection();
    onChange({ ...toss, decision, isSkipped: false });
  };

  const handleToggleSkip = () => {
    appHaptics.selection();
    onChange({ ...toss, isSkipped: !toss.isSkipped });
  };

  const currentWinnerName = toss.winner === 'TEAM_A' ? teamAName : teamBName;

  return (
    <AppCard variant="elevated" padding="md" style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Coins size={18} color={colors.warning} />
          <AppText variant="title" weight="bold">
            Match Toss
          </AppText>
        </View>

        <Pressable onPress={handleToggleSkip} style={styles.skipButton}>
          <AppText
            variant="caption"
            color={toss.isSkipped ? 'accent' : 'muted'}
            weight="semibold"
          >
            {toss.isSkipped ? 'Toss Skipped' : 'Skip Toss'}
          </AppText>
        </Pressable>
      </View>

      {toss.isSkipped ? (
        <View style={styles.skippedContainer}>
          <AppText variant="caption" color="secondary" style={styles.sectionSubtitle}>
            Select which team will bat first:
          </AppText>
          <View style={styles.buttonsRow}>
            <Pressable
              onPress={() => handleWinnerChange('TEAM_A')}
              style={[
                styles.choiceButton,
                toss.winner === 'TEAM_A' && styles.choiceButtonSelected,
              ]}
            >
              <AppText
                variant="body"
                weight="bold"
                color={toss.winner === 'TEAM_A' ? 'inverse' : 'primary'}
                numberOfLines={1}
              >
                {teamAName} Bats
              </AppText>
            </Pressable>

            <Pressable
              onPress={() => handleWinnerChange('TEAM_B')}
              style={[
                styles.choiceButton,
                toss.winner === 'TEAM_B' && styles.choiceButtonSelected,
              ]}
            >
              <AppText
                variant="body"
                weight="bold"
                color={toss.winner === 'TEAM_B' ? 'inverse' : 'primary'}
                numberOfLines={1}
              >
                {teamBName} Bats
              </AppText>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.tossDetails}>
          {/* Toss Winner */}
          <AppText variant="caption" color="secondary" style={styles.sectionSubtitle}>
            Who won the toss?
          </AppText>
          <View style={styles.buttonsRow}>
            <Pressable
              onPress={() => handleWinnerChange('TEAM_A')}
              style={[
                styles.choiceButton,
                toss.winner === 'TEAM_A' && styles.choiceButtonSelected,
              ]}
            >
              <AppText
                variant="body"
                weight="bold"
                color={toss.winner === 'TEAM_A' ? 'inverse' : 'primary'}
                numberOfLines={1}
              >
                {teamAName}
              </AppText>
            </Pressable>

            <Pressable
              onPress={() => handleWinnerChange('TEAM_B')}
              style={[
                styles.choiceButton,
                toss.winner === 'TEAM_B' && styles.choiceButtonSelected,
              ]}
            >
              <AppText
                variant="body"
                weight="bold"
                color={toss.winner === 'TEAM_B' ? 'inverse' : 'primary'}
                numberOfLines={1}
              >
                {teamBName}
              </AppText>
            </Pressable>
          </View>

          {/* Decision */}
          <AppText variant="caption" color="secondary" style={styles.sectionSubtitle}>
            {currentWinnerName} elected to:
          </AppText>
          <View style={styles.buttonsRow}>
            <Pressable
              onPress={() => handleDecisionChange('BAT')}
              style={[
                styles.choiceButton,
                toss.decision === 'BAT' && styles.choiceButtonSelectedSecondary,
              ]}
            >
              <AppText
                variant="body"
                weight="bold"
                color={toss.decision === 'BAT' ? 'inverse' : 'primary'}
              >
                BAT FIRST
              </AppText>
            </Pressable>

            <Pressable
              onPress={() => handleDecisionChange('BOWL')}
              style={[
                styles.choiceButton,
                toss.decision === 'BOWL' && styles.choiceButtonSelectedSecondary,
              ]}
            >
              <AppText
                variant="body"
                weight="bold"
                color={toss.decision === 'BOWL' ? 'inverse' : 'primary'}
              >
                BOWL FIRST
              </AppText>
            </Pressable>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  skipButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  tossDetails: {
    marginTop: spacing.xs,
  },
  skippedContainer: {
    marginTop: spacing.xs,
  },
  sectionSubtitle: {
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  choiceButton: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceButtonSelected: {
    backgroundColor: colors.accentPrimary,
    borderColor: colors.accentPrimary,
  },
  choiceButtonSelectedSecondary: {
    backgroundColor: colors.accentSecondary,
    borderColor: colors.accentSecondary,
  },
});
