/**
 * GullyScore Phase2NoticeModal Component
 * Informs the user when an action is deferred to Phase 2 (Cricket Scoring Engine & Voice Recognition)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppModal } from './AppModal';
import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { useUIStore } from '../../stores/ui.store';
import { Sparkles, CalendarClock } from 'lucide-react-native';

export const Phase2NoticeModal: React.FC = () => {
  const { isPhase2ModalOpen, phase2ModalFeature, closePhase2Modal } = useUIStore();

  return (
    <AppModal
      visible={isPhase2ModalOpen}
      onClose={closePhase2Modal}
      title="Phase 2 Feature"
    >
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Sparkles size={32} color={colors.accentPrimary} />
        </View>

        <AppText variant="title" weight="heavy" align="center" style={styles.featureTitle}>
          {phase2ModalFeature || 'Scoring Action'}
        </AppText>

        <AppText variant="body" color="secondary" align="center" style={styles.description}>
          In Phase 1, you have full access to match setup, team configurations, local SQLite persistence, and UI layout previews.
        </AppText>

        <View style={styles.scheduleBox}>
          <CalendarClock size={16} color={colors.accentSecondary} />
          <AppText variant="caption" color="accentSecondary" weight="semibold">
            Operational scoring engine & speech processing arrive in Phase 2.
          </AppText>
        </View>

        <AppButton
          title="Got it"
          variant="primary"
          size="md"
          onPress={closePhase2Modal}
          fullWidth
          style={styles.button}
        />
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: radius.full,
    backgroundColor: colors.accentPrimaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.accentPrimary,
  },
  featureTitle: {
    marginBottom: spacing.xs,
  },
  description: {
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  scheduleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    backgroundColor: colors.surfaceHover,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.lg,
    width: '100%',
  },
  button: {
    marginTop: spacing.xs,
  },
});
