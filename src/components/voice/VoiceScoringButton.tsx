/**
 * GullyScore VoiceScoringButton Component (Section G)
 * Prominent microphone scoring trigger with pulse animation and Phase 2 information modal
 */

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { AppText } from '../ui/AppText';
import { Mic } from 'lucide-react-native';
import { appHaptics } from '../../utils/haptics';
import { useUIStore } from '../../stores/ui.store';

export const VoiceScoringButton: React.FC = () => {
  const openPhase2Modal = useUIStore((s) => s.openPhase2Modal);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Subtle ambient breathing pulse for the mic button ring
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    return () => loop.stop();
  }, [pulseAnim]);

  const handlePress = () => {
    appHaptics.medium();
    openPhase2Modal('Voice-Controlled Cricket Scoring');
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulseRing,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel="Voice scoring - tap to speak"
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Mic size={28} color={colors.textInverse} />
      </Pressable>

      <AppText variant="title" weight="heavy" color="primary" style={styles.title}>
        Tap to Speak
      </AppText>
      <AppText variant="caption" color="secondary" align="center" style={styles.subtitle}>
        Voice scoring will be available soon in Phase 2.
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.base,
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    top: 24,
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.accentPrimaryMuted,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accentPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: spacing.sm,
  },
  buttonPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.9,
  },
  title: {
    marginTop: spacing.xs,
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 2,
    maxWidth: 240,
  },
});
