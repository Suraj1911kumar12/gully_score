/**
 * GullyScore Reusable AppDivider Component
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';

export interface AppDividerProps {
  color?: string;
  marginVertical?: keyof typeof spacing;
  style?: ViewStyle;
}

export const AppDivider: React.FC<AppDividerProps> = ({
  color = colors.divider,
  marginVertical = 'md',
  style,
}) => {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color,
          marginVertical: spacing[marginVertical],
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
  },
});
