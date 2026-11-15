/**
 * GullyScore LiveScoreHeader Component (Section A)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppText } from '../ui/AppText';
import { AppBadge } from '../ui/AppBadge';
import { AppIconButton } from '../ui/AppIconButton';
import { MoreVertical, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export interface LiveScoreHeaderProps {
  teamAName: string;
  teamBName: string;
  formatOvers: number;
  inningsNumber: number;
  statusText?: string;
  onOptionsPress?: () => void;
}

export const LiveScoreHeader: React.FC<LiveScoreHeaderProps> = ({
  teamAName,
  teamBName,
  formatOvers,
  inningsNumber,
  statusText = 'PREVIEW',
  onOptionsPress,
}) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <AppIconButton
          icon={<ArrowLeft size={20} color={colors.textPrimary} />}
          onPress={() => router.back()}
          variant="ghost"
          size="sm"
          accessibilityLabel="Back"
          style={styles.backButton}
        />
        <View>
          <AppText variant="title" weight="bold" numberOfLines={1}>
            {teamAName} vs {teamBName}
          </AppText>
          <View style={styles.metaRow}>
            <AppText variant="caption" color="secondary">
              {formatOvers} Overs Match
            </AppText>
            <View style={styles.metaDot} />
            <AppText variant="caption" color="accentSecondary" weight="semibold">
              Innings {inningsNumber}
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.rightRow}>
        <AppBadge label={statusText} variant="ready" size="sm" />
        {onOptionsPress && (
          <AppIconButton
            icon={<MoreVertical size={20} color={colors.textSecondary} />}
            onPress={onOptionsPress}
            variant="ghost"
            size="sm"
            accessibilityLabel="Match options"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: radius.full,
    backgroundColor: colors.textMuted,
    marginHorizontal: spacing.xs + 2,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
