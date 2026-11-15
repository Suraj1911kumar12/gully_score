/**
 * GullyScore MatchCard Component
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MatchEntity } from '../../domain/match.types';
import { colors, radius, spacing } from '../../theme';
import { AppCard } from '../ui/AppCard';
import { AppText } from '../ui/AppText';
import { AppBadge } from '../ui/AppBadge';
import { AppButton } from '../ui/AppButton';
import { Calendar, ChevronRight } from 'lucide-react-native';

export interface MatchCardProps {
  match: MatchEntity;
  onPress: () => void;
  onResume?: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onPress,
  onResume,
}) => {
  const formattedDate = new Date(match.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getStatusBadgeVariant = (status: MatchEntity['status']) => {
    switch (status) {
      case 'LIVE':
        return 'live';
      case 'READY':
        return 'ready';
      case 'DRAFT':
        return 'draft';
      case 'COMPLETED':
        return 'completed';
      default:
        return 'muted';
    }
  };

  return (
    <AppCard variant="elevated" padding="md" style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.dateContainer}>
          <Calendar size={14} color={colors.textMuted} />
          <AppText variant="caption" color="muted" style={styles.dateText}>
            {formattedDate}
          </AppText>
        </View>
        <AppBadge
          label={match.status}
          variant={getStatusBadgeVariant(match.status)}
          size="sm"
        />
      </View>

      <View style={styles.teamsRow}>
        <View style={styles.teamColumn}>
          <AppText variant="title" weight="bold" numberOfLines={1}>
            {match.teamA.name}
          </AppText>
          <AppText variant="caption" color="secondary">
            {match.config.playersPerTeam} Players
          </AppText>
        </View>

        <View style={styles.vsBadge}>
          <AppText variant="caption" color="accent" weight="heavy">
            VS
          </AppText>
        </View>

        <View style={[styles.teamColumn, styles.teamRight]}>
          <AppText variant="title" weight="bold" numberOfLines={1} align="right">
            {match.teamB.name}
          </AppText>
          <AppText variant="caption" color="secondary" align="right">
            {match.config.overs} Overs
          </AppText>
        </View>
      </View>

      <View style={styles.footerRow}>
        <AppText variant="caption" color="muted">
          Format: {match.config.overs} Overs ({match.config.ballsPerOver} balls/over)
        </AppText>

        <AppButton
          title={match.status === 'READY' ? 'Open' : 'View'}
          size="sm"
          variant="secondary"
          onPress={onResume || onPress}
          icon={<ChevronRight size={14} color={colors.textPrimary} />}
          iconPosition="right"
        />
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.base,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: spacing.xs,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  teamColumn: {
    flex: 1,
  },
  teamRight: {
    alignItems: 'flex-end',
  },
  vsBadge: {
    backgroundColor: colors.surfaceHover,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
});
