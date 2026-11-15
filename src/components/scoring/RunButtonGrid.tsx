/**
 * GullyScore RunButtonGrid Component (Section F)
 * Primary manual scoring keypad (0, 1, 2, 3, 4, 5, 6, W)
 */

import React, { useRef } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppText } from '../ui/AppText';
import { appHaptics } from '../../utils/haptics';

export interface RunButtonGridProps {
  onScorePress: (runValue: number | 'W') => void;
  disabled?: boolean;
}

export const RunButtonGrid: React.FC<RunButtonGridProps> = ({
  onScorePress,
  disabled = false,
}) => {
  const buttons: (number | 'W')[] = [0, 1, 2, 3, 4, 5, 6, 'W'];

  const renderButton = (val: number | 'W') => {
    const isWicket = val === 'W';
    const isFour = val === 4;
    const isSix = val === 6;

    let bg: string = colors.surfaceElevated;
    let textColor: 'primary' | 'inverse' | 'accent' | 'accentSecondary' | 'danger' = 'primary';
    let borderColor: string = colors.borderLight;

    if (isWicket) {
      bg = colors.danger;
      textColor = 'inverse';
      borderColor = colors.danger;
    } else if (isFour) {
      bg = colors.accentSecondary;
      textColor = 'inverse';
      borderColor = colors.accentSecondary;
    } else if (isSix) {
      bg = colors.accentPrimary;
      textColor = 'inverse';
      borderColor = colors.accentPrimary;
    }

    return (
      <Pressable
        key={val}
        onPress={() => {
          if (disabled) return;
          if (isWicket) {
            appHaptics.heavy();
          } else if (isFour || isSix) {
            appHaptics.medium();
          } else {
            appHaptics.light();
          }
          onScorePress(val);
        }}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`Score ${val}`}
        style={({ pressed }) => [
          styles.btn,
          { backgroundColor: bg, borderColor },
          pressed && styles.btnPressed,
          disabled && styles.btnDisabled,
        ]}
      >
        <AppText
          variant={isWicket || isFour || isSix ? 'h2' : 'h3'}
          weight="heavy"
          color={textColor}
        >
          {val}
        </AppText>
      </Pressable>
    );
  };

  return (
    <View style={styles.grid}>
      {buttons.map(renderButton)}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  btn: {
    width: '23%',
    aspectRatio: 1.25,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.85,
  },
  btnDisabled: {
    opacity: 0.4,
  },
});
