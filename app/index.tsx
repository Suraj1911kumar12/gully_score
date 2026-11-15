/**
 * GullyScore Home Dashboard Screen
 * Route: /
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors, radius, spacing } from '../src/theme';
import { AppScreen } from '../src/components/ui/AppScreen';
import { AppText } from '../src/components/ui/AppText';
import { AppButton } from '../src/components/ui/AppButton';
import { AppCard } from '../src/components/ui/AppCard';
import { AppIconButton } from '../src/components/ui/AppIconButton';
import { AppEmptyState } from '../src/components/ui/AppEmptyState';
import { MatchCard } from '../src/components/match/MatchCard';
import { matchesRepository } from '../src/database/repositories/matches.repository';
import { MatchEntity } from '../src/domain/match.types';
import { useMatchDraftStore } from '../src/stores/matchDraft.store';
import {
  Settings,
  PlusCircle,
  WifiOff,
  Flame,
  Mic,
  Trophy,
} from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const resetDraft = useMatchDraftStore((s) => s.resetDraft);

  // Reload matches whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      async function fetchMatches() {
        try {
          const list = await matchesRepository.listMatches();
          if (isMounted) {
            setMatches(list);
            setIsLoading(false);
          }
        } catch (e) {
          console.error('[HomeScreen] Error loading matches:', e);
          if (isMounted) setIsLoading(false);
        }
      }

      fetchMatches();
      return () => {
        isMounted = false;
      };
    }, [])
  );

  const handleStartNewMatch = () => {
    resetDraft();
    router.push('/match/create');
  };

  const handleOpenMatch = (match: MatchEntity) => {
    router.push(`/match/${match.id}/live`);
  };

  return (
    <AppScreen scrollable contentContainerStyle={styles.scrollContent}>
      {/* 1. Top Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoMark}>
            <View style={styles.stumpLine} />
            <View style={[styles.stumpLine, styles.stumpMiddle]} />
            <View style={styles.stumpLine} />
            <View style={styles.bails} />
          </View>
          <View>
            <AppText variant="h2" weight="black" color="primary">
              GULLY<AppText variant="h2" weight="black" color="accent">SCORE</AppText>
            </AppText>
            <AppText variant="caption" color="secondary" weight="semibold">
              Every Ball Counts.
            </AppText>
          </View>
        </View>

        <AppIconButton
          icon={<Settings size={22} color={colors.textPrimary} />}
          onPress={() => router.push('/settings')}
          variant="surface"
          size="md"
          accessibilityLabel="Open settings"
        />
      </View>

      {/* 2. Hero Section with Cricket Pitch Geometry */}
      <AppCard variant="elevated" padding="lg" style={styles.heroCard}>
        {/* Subtle Cricket Pitch Markings Background */}
        <View style={styles.pitchBackground} pointerEvents="none">
          <View style={styles.creaseLine} />
          <View style={styles.pitchMiddle} />
          <View style={styles.bowlerCrease} />
        </View>

        <View style={styles.heroBadge}>
          <Flame size={14} color={colors.accentPrimary} />
          <AppText variant="caption" color="accent" weight="bold">
            QUICK MATCH SCORING
          </AppText>
        </View>

        <AppText variant="h1" weight="black" color="primary" style={styles.heroTitle}>
          Ready for the next match?
        </AppText>
        <AppText variant="body" color="secondary" style={styles.heroSubtitle}>
          Start scoring every ball in seconds. Set overs, pick players, and track the game offline.
        </AppText>

        <AppButton
          title="Start New Match"
          variant="primary"
          size="lg"
          onPress={handleStartNewMatch}
          icon={<PlusCircle size={22} color={colors.textInverse} />}
          fullWidth
          style={styles.heroCTA}
        />
      </AppCard>

      {/* 3. Recent Matches Section */}
      <View style={styles.sectionHeader}>
        <AppText variant="title" weight="bold" color="primary">
          Recent Matches
        </AppText>
        {matches.length > 0 && (
          <AppText variant="caption" color="secondary">
            {matches.length} saved
          </AppText>
        )}
      </View>

      {matches.length === 0 ? (
        <AppEmptyState
          icon={<Trophy size={36} color={colors.accentPrimary} />}
          title="No Matches Yet"
          description="Create your first gully cricket match to track ball-by-ball scores offline."
          actionTitle="Create Quick Match"
          onAction={handleStartNewMatch}
          style={styles.emptyState}
        />
      ) : (
        <View style={styles.matchesList}>
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onPress={() => handleOpenMatch(match)}
              onResume={() => handleOpenMatch(match)}
            />
          ))}
        </View>
      )}

      {/* 4. Bottom Area: Feature Summary */}
      <View style={styles.featureSummaryCard}>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <WifiOff size={16} color={colors.accentSecondary} />
          </View>
          <View style={styles.featureInfo}>
            <AppText variant="bodySmall" weight="bold">
              100% Offline Ready
            </AppText>
            <AppText variant="caption" color="muted">
              Zero internet required.
            </AppText>
          </View>
        </View>

        <View style={styles.featureDivider} />

        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Flame size={16} color={colors.accentPrimary} />
          </View>
          <View style={styles.featureInfo}>
            <AppText variant="bodySmall" weight="bold">
              Ball-by-Ball Scoring
            </AppText>
            <AppText variant="caption" color="muted">
              Wickets, extras, and stats.
            </AppText>
          </View>
        </View>

        <View style={styles.featureDivider} />

        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Mic size={16} color={colors.warning} />
          </View>
          <View style={styles.featureInfo}>
            <AppText variant="bodySmall" weight="bold">
              Voice Scoring
            </AppText>
            <AppText variant="caption" color="warning" weight="semibold">
              Coming in Phase 2
            </AppText>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['4xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: colors.accentPrimary,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 6,
    position: 'relative',
    gap: 4,
  },
  stumpLine: {
    width: 3,
    height: 18,
    backgroundColor: colors.accentPrimary,
    borderRadius: radius.xs,
  },
  stumpMiddle: {
    height: 20,
  },
  bails: {
    position: 'absolute',
    top: 9,
    width: 19,
    height: 2,
    backgroundColor: colors.accentSecondary,
    borderRadius: 1,
  },
  heroCard: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    marginBottom: spacing.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  pitchBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.12,
  },
  creaseLine: {
    position: 'absolute',
    top: 24,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: colors.accentPrimary,
  },
  pitchMiddle: {
    position: 'absolute',
    top: '50%',
    left: '20%',
    right: '20%',
    height: 1,
    backgroundColor: colors.textMuted,
  },
  bowlerCrease: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: colors.accentSecondary,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accentPrimaryMuted,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.accentPrimary,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  heroCTA: {
    marginTop: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  matchesList: {
    marginBottom: spacing.lg,
  },
  emptyState: {
    marginBottom: spacing.xl,
  },
  featureSummaryCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  featureInfo: {
    flex: 1,
  },
  featureDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
