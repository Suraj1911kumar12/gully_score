/**
 * GullyScore Reusable AppLoadingState Component
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppText } from './AppText';

export interface AppLoadingStateProps {
  message?: string;
  style?: ViewStyle;
}

export const AppLoadingState: React.FC<AppLoadingStateProps> = ({
  message = 'Loading match data...',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color={colors.accentPrimary} />
      </View>
      <AppText variant="body" color="secondary" align="center" style={styles.message}>
        {message}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  spinnerContainer: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  message: {
    letterSpacing: 0.5,
  },
});
