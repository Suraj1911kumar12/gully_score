/**
 * GullyScore PlayerCountSelector Component
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppText } from '../ui/AppText';
import { AppIconButton } from '../ui/AppIconButton';
import { Minus, Plus, Users } from 'lucide-react-native';
import { appHaptics } from '../../utils/haptics';

export interface PlayerCountSelectorProps {
  value: number;
  onChange: (count: number) => void;
  min?: number;
  max?: number;
}

export const PlayerCountSelector: React.FC<PlayerCountSelectorProps> = ({
  value,
  onChange,
  min = 3,
  max = 11,
}) => {
  const handleDecrement = () => {
    if (value > min) {
      appHaptics.light();
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      appHaptics.light();
      onChange(value + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Users size={16} color={colors.accentSecondary} />
        <AppText variant="caption" color="secondary" weight="semibold" style={styles.label}>
          PLAYERS PER TEAM
        </AppText>
      </View>

      <View style={styles.selectorCard}>
        <View style={styles.info}>
          <AppText variant="body" weight="semibold">
            Squad size ({min} to {max})
          </AppText>
          <AppText variant="caption" color="muted">
            Each side will field {value} players
          </AppText>
        </View>

        <View style={styles.stepper}>
          <AppIconButton
            icon={<Minus size={18} color={colors.textPrimary} />}
            onPress={handleDecrement}
            size="sm"
            disabled={value <= min}
            accessibilityLabel="Decrease player count"
          />
          <View style={styles.valueBox}>
            <AppText variant="title" weight="heavy" color="accentSecondary">
              {value}
            </AppText>
          </View>
          <AppIconButton
            icon={<Plus size={18} color={colors.textPrimary} />}
            onPress={handleIncrement}
            size="sm"
            disabled={value >= max}
            accessibilityLabel="Increase player count"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  label: {
    letterSpacing: 1,
  },
  selectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceCard,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  info: {
    flex: 1,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueBox: {
    paddingHorizontal: spacing.md,
    minWidth: 44,
    alignItems: 'center',
  },
});
