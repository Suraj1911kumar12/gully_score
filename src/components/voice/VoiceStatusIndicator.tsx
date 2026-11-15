/**
 * GullyScore VoiceStatusIndicator Component
 * Presentation states for Idle, Listening, Processing, Confirmation, Error
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppText } from '../ui/AppText';
import { VoiceRecognitionState } from '../../domain/voice.types';
import { Mic, Loader, CheckCircle2, AlertTriangle, Radio } from 'lucide-react-native';

export interface VoiceStatusIndicatorProps {
  state: VoiceRecognitionState;
}

export const VoiceStatusIndicator: React.FC<VoiceStatusIndicatorProps> = ({ state }) => {
  const getDetails = () => {
    switch (state) {
      case 'LISTENING':
        return {
          icon: <Radio size={16} color={colors.accentPrimary} />,
          text: 'Listening for cricket delivery command...',
          color: colors.accentPrimary,
        };
      case 'PROCESSING':
        return {
          icon: <Loader size={16} color={colors.accentSecondary} />,
          text: 'Interpreting voice intent...',
          color: colors.accentSecondary,
        };
      case 'CONFIRMATION':
        return {
          icon: <CheckCircle2 size={16} color={colors.success} />,
          text: 'Intent confirmed: 4 runs scored',
          color: colors.success,
        };
      case 'ERROR':
        return {
          icon: <AlertTriangle size={16} color={colors.danger} />,
          text: 'Command not recognized',
          color: colors.danger,
        };
      case 'IDLE':
      default:
        return {
          icon: <Mic size={16} color={colors.textMuted} />,
          text: 'Voice recognition idle (Phase 1 preview)',
          color: colors.textMuted,
        };
    }
  };

  const details = getDetails();

  return (
    <View style={styles.container}>
      {details.icon}
      <AppText variant="caption" weight="medium" style={{ color: details.color }}>
        {details.text}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceHover,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
});
