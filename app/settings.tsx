/**
 * GullyScore Settings Screen
 * Route: /settings
 */

import React from 'react';
import { View, StyleSheet, Switch, Pressable } from 'react-native';
import { colors, radius, spacing } from '../src/theme';
import { AppScreen } from '../src/components/ui/AppScreen';
import { AppHeader } from '../src/components/ui/AppHeader';
import { AppText } from '../src/components/ui/AppText';
import { AppCard } from '../src/components/ui/AppCard';
import { AppDivider } from '../src/components/ui/AppDivider';
import { AppIconButton } from '../src/components/ui/AppIconButton';
import { useSettingsStore } from '../src/stores/settings.store';
import { appHaptics } from '../src/utils/haptics';
import {
  Globe,
  Vibrate,
  Volume2,
  Sliders,
  Info,
  Minus,
  Plus,
  Shield,
  WifiOff,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const {
    scoringLanguage,
    hapticsEnabled,
    voiceFeedbackEnabled,
    defaultOvers,
    defaultPlayerCount,
    setScoringLanguage,
    setHaptics,
    setVoiceFeedback,
    setDefaultOvers,
    setDefaultPlayerCount,
  } = useSettingsStore();

  const handleLanguageChange = (lang: 'hindi' | 'english' | 'hinglish') => {
    appHaptics.selection();
    setScoringLanguage(lang);
  };

  const handleHapticsToggle = (val: boolean) => {
    appHaptics.selection();
    setHaptics(val);
  };

  const handleVoiceToggle = (val: boolean) => {
    appHaptics.selection();
    setVoiceFeedback(val);
  };

  return (
    <AppScreen scrollable edges={['top', 'left', 'right']}>
      <AppHeader
        title="Settings"
        subtitle="Preferences & Match Defaults"
        showBack
      />

      <View style={styles.content}>
        {/* 1. Scoring Language Preference */}
        <AppCard variant="elevated" padding="md" style={styles.card}>
          <View style={styles.cardHeader}>
            <Globe size={18} color={colors.accentPrimary} />
            <AppText variant="title" weight="bold">
              Scoring Language
            </AppText>
          </View>
          <AppText variant="caption" color="secondary" style={styles.cardSub}>
            Used for future voice scoring recognition and audio feedback
          </AppText>

          <View style={styles.languageOptions}>
            {(['english', 'hindi', 'hinglish'] as const).map((lang) => {
              const isSelected = scoringLanguage === lang;
              const displayLabels = {
                english: 'English',
                hindi: 'हिंदी (Hindi)',
                hinglish: 'Hinglish (Street)',
              };
              return (
                <Pressable
                  key={lang}
                  onPress={() => handleLanguageChange(lang)}
                  style={[
                    styles.langChip,
                    isSelected && styles.langChipSelected,
                  ]}
                >
                  <AppText
                    variant="bodySmall"
                    weight={isSelected ? 'bold' : 'medium'}
                    color={isSelected ? 'inverse' : 'primary'}
                  >
                    {displayLabels[lang]}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </AppCard>

        {/* 2. Tactile & Voice Feedback */}
        <AppCard variant="elevated" padding="md" style={styles.card}>
          <View style={styles.cardHeader}>
            <Sliders size={18} color={colors.accentSecondary} />
            <AppText variant="title" weight="bold">
              Interaction & Feedback
            </AppText>
          </View>

          {/* Haptics */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <View style={styles.iconRow}>
                <Vibrate size={16} color={colors.accentPrimary} />
                <AppText variant="body" weight="medium">
                  Tactile Haptic Feedback
                </AppText>
              </View>
              <AppText variant="caption" color="muted">
                Vibrate on scoring button presses and events
              </AppText>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={handleHapticsToggle}
              trackColor={{ false: colors.border, true: colors.accentPrimary }}
              thumbColor={colors.textPrimary}
            />
          </View>

          <AppDivider marginVertical="sm" />

          {/* Voice Alerts */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <View style={styles.iconRow}>
                <Volume2 size={16} color={colors.warning} />
                <AppText variant="body" weight="medium">
                  Voice Announcements
                </AppText>
              </View>
              <AppText variant="caption" color="muted">
                Speak score aloud on boundaries and wickets (Phase 2)
              </AppText>
            </View>
            <Switch
              value={voiceFeedbackEnabled}
              onValueChange={handleVoiceToggle}
              trackColor={{ false: colors.border, true: colors.warning }}
              thumbColor={colors.textPrimary}
            />
          </View>
        </AppCard>

        {/* 3. Match Defaults */}
        <AppCard variant="elevated" padding="md" style={styles.card}>
          <View style={styles.cardHeader}>
            <Sliders size={18} color={colors.textPrimary} />
            <AppText variant="title" weight="bold">
              Match Defaults
            </AppText>
          </View>

          {/* Default Overs */}
          <View style={styles.stepperRow}>
            <View>
              <AppText variant="body" weight="medium">
                Default Overs
              </AppText>
              <AppText variant="caption" color="muted">
                Pre-selected overs for quick matches
              </AppText>
            </View>
            <View style={styles.stepperControls}>
              <AppIconButton
                icon={<Minus size={16} color={colors.textPrimary} />}
                onPress={() => {
                  if (defaultOvers > 1) {
                    appHaptics.light();
                    setDefaultOvers(defaultOvers - 1);
                  }
                }}
                size="sm"
                disabled={defaultOvers <= 1}
                accessibilityLabel="Decrease default overs"
              />
              <View style={styles.valueBox}>
                <AppText variant="title" weight="bold" color="accent">
                  {defaultOvers}
                </AppText>
              </View>
              <AppIconButton
                icon={<Plus size={16} color={colors.textPrimary} />}
                onPress={() => {
                  if (defaultOvers < 50) {
                    appHaptics.light();
                    setDefaultOvers(defaultOvers + 1);
                  }
                }}
                size="sm"
                disabled={defaultOvers >= 50}
                accessibilityLabel="Increase default overs"
              />
            </View>
          </View>

          <AppDivider marginVertical="sm" />

          {/* Default Player Count */}
          <View style={styles.stepperRow}>
            <View>
              <AppText variant="body" weight="medium">
                Default Squad Size
              </AppText>
              <AppText variant="caption" color="muted">
                Players per team (3 to 11)
              </AppText>
            </View>
            <View style={styles.stepperControls}>
              <AppIconButton
                icon={<Minus size={16} color={colors.textPrimary} />}
                onPress={() => {
                  if (defaultPlayerCount > 3) {
                    appHaptics.light();
                    setDefaultPlayerCount(defaultPlayerCount - 1);
                  }
                }}
                size="sm"
                disabled={defaultPlayerCount <= 3}
                accessibilityLabel="Decrease default players"
              />
              <View style={styles.valueBox}>
                <AppText variant="title" weight="bold" color="accentSecondary">
                  {defaultPlayerCount}
                </AppText>
              </View>
              <AppIconButton
                icon={<Plus size={16} color={colors.textPrimary} />}
                onPress={() => {
                  if (defaultPlayerCount < 11) {
                    appHaptics.light();
                    setDefaultPlayerCount(defaultPlayerCount + 1);
                  }
                }}
                size="sm"
                disabled={defaultPlayerCount >= 11}
                accessibilityLabel="Increase default players"
              />
            </View>
          </View>
        </AppCard>

        {/* 4. About GullyScore */}
        <AppCard variant="secondary" padding="md" style={styles.card}>
          <View style={styles.cardHeader}>
            <Info size={18} color={colors.accentPrimary} />
            <AppText variant="title" weight="bold">
              About GullyScore
            </AppText>
          </View>

          <View style={styles.aboutRow}>
            <View style={styles.featurePill}>
              <WifiOff size={14} color={colors.accentSecondary} />
              <AppText variant="caption" color="accentSecondary" weight="semibold">
                Offline-First
              </AppText>
            </View>
            <View style={styles.featurePill}>
              <Shield size={14} color={colors.accentPrimary} />
              <AppText variant="caption" color="accent" weight="semibold">
                SQLite Persistence
              </AppText>
            </View>
          </View>

          <AppText variant="bodySmall" color="secondary" style={styles.aboutText}>
            GullyScore is an offline-first cricket companion crafted for gully, street, and tennis-ball cricket lovers. No logins, no ads, no cloud dependency.
          </AppText>

          <AppDivider marginVertical="sm" />

          <View style={styles.versionRow}>
            <AppText variant="caption" color="muted">
              App Version
            </AppText>
            <AppText variant="caption" weight="bold" color="secondary">
              1.0.0 (Phase 1 Foundation)
            </AppText>
          </View>
        </AppCard>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.base,
    paddingBottom: spacing['4xl'],
  },
  card: {
    marginBottom: spacing.base,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  cardSub: {
    marginBottom: spacing.md,
  },
  languageOptions: {
    gap: spacing.sm,
  },
  langChip: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceHover,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langChipSelected: {
    backgroundColor: colors.accentPrimary,
    borderColor: colors.accentPrimary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  toggleInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueBox: {
    width: 44,
    alignItems: 'center',
  },
  aboutRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  aboutText: {
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
