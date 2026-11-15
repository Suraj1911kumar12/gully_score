/**
 * GullyScore CurrentOverTimeline Component (Section E)
 * Horizontally scrollable ball-by-ball delivery timeline
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppText } from '../ui/AppText';
import { TimelineBall } from '../../domain/scoring.types';

export interface CurrentOverTimelineProps {
  balls: TimelineBall[];
  overLabel?: string;
}

export const CurrentOverTimeline: React.FC<CurrentOverTimelineProps> = ({
  balls,
  overLabel = 'THIS OVER',
}) => {
  const getBallStyle = (ball: TimelineBall) => {
    switch (ball.type) {
      case 'WICKET':
        return {
          bg: colors.danger,
          text: colors.textPrimary,
          border: colors.danger,
          isWicket: true,
        };
      case 'FOUR':
        return {
          bg: colors.accentSecondary,
          text: colors.textInverse,
          border: colors.accentSecondary,
          isWicket: false,
        };
      case 'SIX':
        return {
          bg: colors.accentPrimary,
          text: colors.textInverse,
          border: colors.accentPrimary,
          isWicket: false,
        };
      case 'WIDE':
      case 'NO_BALL':
        return {
          bg: colors.warningMuted,
          text: colors.warning,
          border: colors.warning,
          isWicket: false,
        };
      case 'DOT':
        return {
          bg: colors.surfaceHover,
          text: colors.textMuted,
          border: colors.borderLight,
          isWicket: false,
        };
      default:
        return {
          bg: colors.surfaceElevated,
          text: colors.ballRun,
          border: colors.borderLight,
          isWicket: false,
        };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="caption" color="secondary" weight="bold">
          {overLabel}
        </AppText>
        <AppText variant="caption" color="muted">
          {balls.filter((b) => b.isLegal).length} legal balls
        </AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {balls.length === 0 ? (
          <View style={styles.emptyOver}>
            <AppText variant="caption" color="muted">
              Over yet to start
            </AppText>
          </View>
        ) : (
          balls.map((ball) => {
            const styleInfo = getBallStyle(ball);
            return (
              <View
                key={ball.id}
                style={[
                  styles.ballCircle,
                  {
                    backgroundColor: styleInfo.bg,
                    borderColor: styleInfo.border,
                  },
                  styleInfo.isWicket && styles.wicketBall,
                ]}
              >
                <AppText
                  variant="bodySmall"
                  weight="heavy"
                  style={{ color: styleInfo.text }}
                >
                  {ball.displayText}
                </AppText>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceCard,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  scrollList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 2,
  },
  ballCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wicketBall: {
    borderWidth: 2,
  },
  emptyOver: {
    paddingVertical: spacing.xs,
  },
});
