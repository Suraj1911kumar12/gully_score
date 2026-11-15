/**
 * GullyScore TeamNameInput Component
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppInput } from '../ui/AppInput';
import { AppText } from '../ui/AppText';
import { Shield } from 'lucide-react-native';

export interface TeamNameInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  badgeText: string;
  badgeColor?: string;
}

export const TeamNameInput: React.FC<TeamNameInputProps> = ({
  label,
  value,
  onChangeText,
  error,
  badgeText,
  badgeColor = colors.accentPrimary,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: badgeColor + '20', borderColor: badgeColor }]}>
          <Shield size={14} color={badgeColor} />
          <AppText variant="caption" weight="bold" style={[styles.badgeText, { color: badgeColor }]}>
            {badgeText}
          </AppText>
        </View>
      </View>
      <AppInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={`Enter ${label.toLowerCase()}`}
        error={error}
        maxLength={30}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  badgeText: {
    marginLeft: 4,
    textTransform: 'uppercase',
  },
});
