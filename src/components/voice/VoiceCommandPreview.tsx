/**
 * GullyScore VoiceCommandPreview Component
 * Previews upcoming natural cricket voice scoring commands
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppText } from '../ui/AppText';
import { AppCard } from '../ui/AppCard';
import { Volume2 } from 'lucide-react-native';

export const VoiceCommandPreview: React.FC = () => {
  const sampleCommands = [
    { voice: '"Chauka lag gaya!" / "Four runs!"', outcome: 'Scores 4 runs to striker' },
    { voice: '"Wide ball plus ek run"', outcome: 'Scores 2 runs total & extra' },
    { voice: '"Clean bowled! Wicket"', outcome: 'Prompts dismissal modal' },
    { voice: '"Dot ball, single nahi hua"', outcome: 'Records 0 runs' },
  ];

  return (
    <AppCard variant="secondary" padding="md" style={styles.card}>
      <View style={styles.header}>
        <Volume2 size={16} color={colors.accentSecondary} />
        <AppText variant="caption" weight="bold" color="accentSecondary">
          FUTURE NATURAL VOICE COMMANDS (PHASE 2)
        </AppText>
      </View>

      <View style={styles.list}>
        {sampleCommands.map((cmd, idx) => (
          <View key={idx} style={styles.item}>
            <AppText variant="bodySmall" weight="bold" color="primary">
              {cmd.voice}
            </AppText>
            <AppText variant="caption" color="muted">
              {cmd.outcome}
            </AppText>
          </View>
        ))}
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceSecondary,
    marginBottom: spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  list: {
    gap: spacing.sm,
  },
  item: {
    backgroundColor: colors.surfaceElevated,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
