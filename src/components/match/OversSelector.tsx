/**
 * GullyScore OversSelector Component
 */

import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppText } from '../ui/AppText';
import { AppIconButton } from '../ui/AppIconButton';
import { Minus, Plus } from 'lucide-react-native';
import { appHaptics } from '../../utils/haptics';

export interface OversSelectorProps {
  value: number;
  onChange: (overs: number) => void;
}

const PRESET_OVERS = [2, 3, 5, 6, 10, 20];

export const OversSelector: React.FC<OversSelectorProps> = ({
  value,
  onChange,
}) => {
  const [isCustom, setIsCustom] = useState(!PRESET_OVERS.includes(value));

  const handleSelectPreset = (overs: number) => {
    appHaptics.selection();
    setIsCustom(false);
    onChange(overs);
  };

  const handleIncrement = () => {
    if (value < 50) {
      appHaptics.light();
      setIsCustom(true);
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > 1) {
      appHaptics.light();
      setIsCustom(true);
      onChange(value - 1);
    }
  };

  return (
    <View style={styles.container}>
      <AppText variant="caption" color="secondary" weight="semibold" style={styles.label}>
        MATCH OVERS
      </AppText>

      {/* Preset Chips */}
      <View style={styles.presetsRow}>
        {PRESET_OVERS.map((preset) => {
          const isSelected = !isCustom && value === preset;
          return (
            <Pressable
              key={preset}
              onPress={() => handleSelectPreset(preset)}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
              ]}
            >
              <AppText
                variant="body"
                weight={isSelected ? 'bold' : 'medium'}
                color={isSelected ? 'inverse' : 'primary'}
              >
                {preset} Ov
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {/* Stepper for custom overs */}
      <View style={styles.stepperContainer}>
        <AppText variant="caption" color="muted">
          Custom overs adjustment:
        </AppText>
        <View style={styles.stepperControls}>
          <AppIconButton
            icon={<Minus size={18} color={colors.textPrimary} />}
            onPress={handleDecrement}
            size="sm"
            disabled={value <= 1}
            accessibilityLabel="Decrease overs"
          />
          <View style={styles.valueBox}>
            <AppText variant="title" weight="heavy" color="accent">
              {value}
            </AppText>
            <AppText variant="caption" color="secondary">
              overs
            </AppText>
          </View>
          <AppIconButton
            icon={<Plus size={18} color={colors.textPrimary} />}
            onPress={handleIncrement}
            size="sm"
            disabled={value >= 50}
            accessibilityLabel="Increase overs"
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
  label: {
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 64,
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: colors.accentPrimary,
    borderColor: colors.accentPrimary,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceCard,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    minWidth: 60,
  },
});
