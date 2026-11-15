/**
 * GullyScore ScoringActionPanel Component
 * Complete scoring control panel integrating runs, extras, undos, and Phase 1 boundary modal
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppCard } from '../ui/AppCard';
import { AppText } from '../ui/AppText';
import { AppButton } from '../ui/AppButton';
import { RunButtonGrid } from './RunButtonGrid';
import { ExtrasActionBar } from './ExtrasActionBar';
import { RotateCcw, Edit3, Info } from 'lucide-react-native';
import { useUIStore } from '../../stores/ui.store';

export interface ScoringActionPanelProps {
  onScoreAction?: (actionName: string) => void;
}

export const ScoringActionPanel: React.FC<ScoringActionPanelProps> = ({
  onScoreAction,
}) => {
  const openPhase2Modal = useUIStore((s) => s.openPhase2Modal);

  const handleAction = (featureName: string) => {
    onScoreAction?.(featureName);
    openPhase2Modal(featureName);
  };

  return (
    <AppCard variant="elevated" padding="md" style={styles.card}>
      {/* Informational Phase 1 Banner */}
      <View style={styles.infoBanner}>
        <Info size={16} color={colors.accentPrimary} />
        <AppText variant="caption" color="secondary" style={styles.infoText}>
          Phase 1 Scoring Preview: Controls respond with tactile feedback. Delivery mutation activates in Phase 2.
        </AppText>
      </View>

      {/* Primary Keypad (0-6, W) */}
      <RunButtonGrid onScorePress={(val) => handleAction(`Delivery Score: ${val}`)} />

      {/* Extras Row */}
      <ExtrasActionBar onExtraPress={(extra) => handleAction(`Extra: ${extra}`)} />

      {/* Undo and Edit Ball Row */}
      <View style={styles.auditRow}>
        <AppButton
          title="Undo Last Ball"
          variant="secondary"
          size="sm"
          onPress={() => handleAction('Undo Last Delivery')}
          icon={<RotateCcw size={14} color={colors.textSecondary} />}
          style={styles.auditBtn}
        />
        <AppButton
          title="Edit Ball"
          variant="secondary"
          size="sm"
          onPress={() => handleAction('Edit Previous Delivery')}
          icon={<Edit3 size={14} color={colors.textSecondary} />}
          style={styles.auditBtn}
        />
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    marginBottom: spacing.base,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHover,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.sm,
  },
  infoText: {
    flex: 1,
  },
  auditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  auditBtn: {
    flex: 1,
  },
});
