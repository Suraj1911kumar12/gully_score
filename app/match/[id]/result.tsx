/**
 * GullyScore Match Result Screen
 * Route: /match/[id]/result
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, radius, spacing } from '../../../src/theme';
import { AppScreen } from '../../../src/components/ui/AppScreen';
import { AppHeader } from '../../../src/components/ui/AppHeader';
import { AppText } from '../../../src/components/ui/AppText';
import { AppCard } from '../../../src/components/ui/AppCard';
import { AppButton } from '../../../src/components/ui/AppButton';
import { AppBadge } from '../../../src/components/ui/AppBadge';
import { matchesRepository } from '../../../src/database/repositories/matches.repository';
import { MatchEntity } from '../../../src/domain/match.types';
import { PREVIEW_MATCH_RESULT } from '../../../src/mocks/previewData';
import { appHaptics } from '../../../src/utils/haptics';
import { Trophy, Share2, Home, Sparkles, Award } from 'lucide-react-native';

export default function MatchResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [match, setMatch] = useState<MatchEntity | null>(null);

  useEffect(() => {
    async function load() {
      if (id) {
        const found = await matchesRepository.getMatchById(id);
        if (found) setMatch(found);
      }
    }
    load();
  }, [id]);

  const teamAName = match?.teamA.name || PREVIEW_MATCH_RESULT.teamA.name;
  const teamBName = match?.teamB.name || PREVIEW_MATCH_RESULT.teamB.name;

  const handleShare = async () => {
    appHaptics.light();
    try {
      await Share.share({
        message: `🏏 GullyScore Match Result!\n${teamAName} vs ${teamBName}\nResult: Street Kings won by 6 wickets!\nScored on GullyScore: Every Ball Counts.`,
      });
    } catch {
      // Fallback
    }
  };

  const handleBackToHome = () => {
    appHaptics.light();
    router.replace('/');
  };

  return (
    <AppScreen scrollable edges={['top', 'left', 'right']}>
      <AppHeader
        title="Match Result"
        subtitle={`${teamAName} vs ${teamBName}`}
        showBack
      />

      <View style={styles.content}>
        {/* Phase 1 Notice */}
        <View style={styles.noticeBox}>
          <Sparkles size={14} color={colors.accentPrimary} />
          <AppText variant="caption" color="accent" weight="bold">
            PHASE 1 MATCH RESULT PREVIEW
          </AppText>
        </View>

        {/* 1. Winner Trophy Banner */}
        <AppCard variant="elevated" padding="lg" style={styles.trophyCard}>
          <View style={styles.trophyIconCircle}>
            <Trophy size={48} color={colors.accentPrimary} />
          </View>

          <AppBadge label="MATCH WINNER" variant="ready" size="md" style={styles.winnerBadge} />

          <AppText variant="h1" weight="black" color="accent" align="center" style={styles.winnerText}>
            {teamBName}
          </AppText>

          <AppText variant="title" weight="bold" color="primary" align="center" style={styles.marginText}>
            Won by 6 wickets (3 balls remaining)
          </AppText>

          <AppText variant="bodySmall" color="secondary" align="center" style={styles.summaryText}>
            {'summary' in PREVIEW_MATCH_RESULT.outcome ? PREVIEW_MATCH_RESULT.outcome.summary : ''}
          </AppText>
        </AppCard>

        {/* 2. Team Scores Comparison */}
        <AppCard variant="elevated" padding="md" style={styles.scoresCard}>
          <View style={styles.scoreRow}>
            <View style={styles.teamCol}>
              <AppText variant="title" weight="bold">
                {teamAName}
              </AppText>
              <AppText variant="caption" color="secondary">
                1st Innings
              </AppText>
            </View>
            <View style={styles.scoreCol}>
              <AppText variant="h2" weight="heavy">
                {PREVIEW_MATCH_RESULT.teamA.score}
              </AppText>
              <AppText variant="caption" color="muted">
                ({PREVIEW_MATCH_RESULT.teamA.overs} ov)
              </AppText>
            </View>
          </View>

          <View style={styles.scoreDivider} />

          <View style={styles.scoreRow}>
            <View style={styles.teamCol}>
              <AppText variant="title" weight="bold" color="accent">
                {teamBName}
              </AppText>
              <AppText variant="caption" color="accent" weight="semibold">
                Winner 🏆
              </AppText>
            </View>
            <View style={styles.scoreCol}>
              <AppText variant="h2" weight="heavy" color="accent">
                {PREVIEW_MATCH_RESULT.teamB.score}
              </AppText>
              <AppText variant="caption" color="muted">
                ({PREVIEW_MATCH_RESULT.teamB.overs} ov)
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* 3. Player of the Match */}
        {PREVIEW_MATCH_RESULT.playerOfTheMatch && (
          <AppCard variant="secondary" padding="md" style={styles.potmCard}>
            <View style={styles.potmRow}>
              <View style={styles.potmBadge}>
                <Award size={20} color={colors.accentSecondary} />
              </View>
              <View style={styles.potmInfo}>
                <AppText variant="caption" color="secondary" weight="bold">
                  PLAYER OF THE MATCH
                </AppText>
                <AppText variant="title" weight="bold" color="accentSecondary">
                  {PREVIEW_MATCH_RESULT.playerOfTheMatch}
                </AppText>
              </View>
            </View>
          </AppCard>
        )}

        {/* 4. Action Buttons */}
        <View style={styles.actions}>
          <AppButton
            title="Share Result"
            variant="primary"
            size="lg"
            onPress={handleShare}
            icon={<Share2 size={18} color={colors.textInverse} />}
            fullWidth
            style={styles.shareBtn}
          />

          <AppButton
            title="Back to Home"
            variant="secondary"
            size="lg"
            onPress={handleBackToHome}
            icon={<Home size={18} color={colors.textPrimary} />}
            fullWidth
          />
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.base,
    paddingBottom: spacing['4xl'],
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    backgroundColor: colors.surfaceHover,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.base,
  },
  trophyCard: {
    alignItems: 'center',
    backgroundColor: colors.surfaceCard,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    marginBottom: spacing.base,
  },
  trophyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.accentPrimaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.accentPrimary,
  },
  winnerBadge: {
    marginBottom: spacing.xs,
  },
  winnerText: {
    marginBottom: spacing.xs,
  },
  marginText: {
    marginBottom: spacing.sm,
  },
  summaryText: {
    maxWidth: 280,
    lineHeight: 20,
  },
  scoresCard: {
    marginBottom: spacing.base,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  teamCol: {
    flex: 1,
  },
  scoreCol: {
    alignItems: 'flex-end',
  },
  scoreDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  potmCard: {
    marginBottom: spacing.lg,
  },
  potmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  potmBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.accentSecondaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  potmInfo: {
    flex: 1,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  shareBtn: {
    marginBottom: spacing.xs,
  },
});
