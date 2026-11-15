/**
 * GullyScore Live Scoring Interface Screen
 * Route: /match/[id]/live
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, radius, spacing } from '../../../src/theme';
import { AppScreen } from '../../../src/components/ui/AppScreen';
import { AppText } from '../../../src/components/ui/AppText';
import { AppButton } from '../../../src/components/ui/AppButton';
import { AppLoadingState } from '../../../src/components/ui/AppLoadingState';
import { LiveScoreHeader } from '../../../src/components/scoring/LiveScoreHeader';
import { ScoreboardCard } from '../../../src/components/scoring/ScoreboardCard';
import { BatterScoreRow } from '../../../src/components/scoring/BatterScoreRow';
import { BowlerScoreRow } from '../../../src/components/scoring/BowlerScoreRow';
import { CurrentOverTimeline } from '../../../src/components/scoring/CurrentOverTimeline';
import { ScoringActionPanel } from '../../../src/components/scoring/ScoringActionPanel';
import { VoiceScoringButton } from '../../../src/components/voice/VoiceScoringButton';
import { VoiceStatusIndicator } from '../../../src/components/voice/VoiceStatusIndicator';
import { VoiceCommandPreview } from '../../../src/components/voice/VoiceCommandPreview';
import { matchesRepository } from '../../../src/database/repositories/matches.repository';
import { MatchEntity } from '../../../src/domain/match.types';
import { PREVIEW_LIVE_SCOREBOARD } from '../../../src/mocks/previewData';
import { FileText, ArrowRightCircle, Award, Sparkles } from 'lucide-react-native';

export default function LiveScoringScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [match, setMatch] = useState<MatchEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadMatch() {
      if (!id) return;
      try {
        const found = await matchesRepository.getMatchById(id);
        if (isMounted) {
          setMatch(found);
          setLoading(false);
        }
      } catch (err) {
        console.error('[LiveScoring] Failed to load match:', err);
        if (isMounted) setLoading(false);
      }
    }
    loadMatch();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <AppLoadingState message="Loading live scoring interface..." />;
  }

  const teamAName = match?.teamA.name || 'Gully Strikers';
  const teamBName = match?.teamB.name || 'Street Kings';
  const formatOvers = match?.config.overs || 10;

  return (
    <AppScreen scrollable edges={['top', 'left', 'right']}>
      {/* Section A: Match Header */}
      <LiveScoreHeader
        teamAName={teamAName}
        teamBName={teamBName}
        formatOvers={formatOvers}
        inningsNumber={PREVIEW_LIVE_SCOREBOARD.currentInnings}
        statusText="PREVIEW"
      />

      <View style={styles.content}>
        {/* Phase 1 Development Notice Banner */}
        <View style={styles.previewBadge}>
          <Sparkles size={16} color={colors.accentPrimary} />
          <AppText variant="caption" weight="bold" color="accent" style={styles.previewBadgeText}>
            PHASE 1 LIVE SCORING PREVIEW — SCORING ENGINE ARRIVES IN PHASE 2
          </AppText>
        </View>

        {/* Quick Screen Navigation Strip */}
        <View style={styles.navStrip}>
          <AppButton
            title="Scorecard"
            size="sm"
            variant="secondary"
            onPress={() => router.push(`/match/${id}/scorecard`)}
            icon={<FileText size={14} color={colors.textPrimary} />}
            style={styles.navBtn}
          />
          <AppButton
            title="Innings Break"
            size="sm"
            variant="secondary"
            onPress={() => router.push(`/match/${id}/innings-break`)}
            icon={<ArrowRightCircle size={14} color={colors.textPrimary} />}
            style={styles.navBtn}
          />
          <AppButton
            title="Result"
            size="sm"
            variant="secondary"
            onPress={() => router.push(`/match/${id}/result`)}
            icon={<Award size={14} color={colors.textPrimary} />}
            style={styles.navBtn}
          />
        </View>

        {/* Section B: Primary Scoreboard */}
        <ScoreboardCard
          totalRuns={PREVIEW_LIVE_SCOREBOARD.totalRuns}
          wickets={PREVIEW_LIVE_SCOREBOARD.wickets}
          oversText={PREVIEW_LIVE_SCOREBOARD.oversText}
          maxOvers={formatOvers}
          currentRunRate={PREVIEW_LIVE_SCOREBOARD.currentRunRate}
          target={PREVIEW_LIVE_SCOREBOARD.target}
          requiredRunRate={PREVIEW_LIVE_SCOREBOARD.requiredRunRate}
          battingTeamName={teamAName}
        />

        {/* Section C: Batting Information */}
        <BatterScoreRow
          striker={PREVIEW_LIVE_SCOREBOARD.striker}
          nonStriker={PREVIEW_LIVE_SCOREBOARD.nonStriker}
        />

        {/* Section D: Bowling Information */}
        <BowlerScoreRow bowler={PREVIEW_LIVE_SCOREBOARD.currentBowler} />

        {/* Section E: Current Over Timeline */}
        <CurrentOverTimeline balls={PREVIEW_LIVE_SCOREBOARD.timeline} />

        {/* Section F: Manual Scoring Controls */}
        <ScoringActionPanel />

        {/* Section G: Voice Scoring Interface */}
        <VoiceStatusIndicator state="IDLE" />
        <VoiceScoringButton />
        <VoiceCommandPreview />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.base,
    paddingBottom: spacing['4xl'],
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHover,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.xs + 2,
  },
  previewBadgeText: {
    flex: 1,
    letterSpacing: 0.5,
  },
  navStrip: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    marginBottom: spacing.base,
  },
  navBtn: {
    flex: 1,
  },
});
