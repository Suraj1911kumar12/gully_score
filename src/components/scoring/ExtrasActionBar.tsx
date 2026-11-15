/**
 * GullyScore ExtrasActionBar Component (Section F Secondary)
 * Controls for Wide, No Ball, Bye, Leg Bye, Penalty
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppText } from '../ui/AppText';
import { appHaptics } from '../../utils/haptics';

export interface ExtrasActionBarProps {
  onExtraPress: (extraType: 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE' | 'PENALTY') => void;
  disabled?: boolean;
}

export const ExtrasActionBar: React.FC<ExtrasActionBarProps> = ({
  onExtraPress,
  disabled = false,
}) => {
  const extras: { label: string; key: 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE' | 'PENALTY' }[] = [
    { label: 'WD', key: 'WIDE' },
    { label: 'NB', key: 'NO_BALL' },
    { label: 'BYE', key: 'BYE' },
    { label: 'LB', key: 'LEG_BYE' },
    { label: 'PEN', key: 'PENALTY' },
  ];

  return (
    <View style={styles.container}>
      {extras.map((item) => (
        <Pressable
          key={item.key}
          onPress={() => {
            if (disabled) return;
            appHaptics.light();
            onExtraPress(item.key);
          }}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`Extra ${item.label}`}
          style={({ pressed }) => [
            styles.extraBtn,
            pressed && styles.extraBtnPressed,
            disabled && styles.extraBtnDisabled,
          ]}
        >
          <AppText variant="caption" weight="heavy" color="secondary">
            {item.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs + 2,
    marginBottom: spacing.md,
  },
  extraBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraBtnPressed: {
    backgroundColor: colors.surfaceHover,
    borderColor: colors.warning,
  },
  extraBtnDisabled: {
    opacity: 0.4,
  },
});
