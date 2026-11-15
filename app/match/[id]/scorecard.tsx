/**
 * GullyScore Full Scorecard Screen
 * Route: /match/[id]/scorecard
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, radius, spacing } from '../../../src/theme';
import { AppScreen } from '../../../src/components/ui/AppScreen';
import { AppHeader } from '../../../src/components/ui/AppHeader';
import { AppText } from '../../../src/components/ui/AppText';
import { AppCard } from '../../../src/components/ui/AppCard';
import { AppBadge } from '../../../src/components/ui/AppBadge';
import { AppDivider } from '../../../src/components/ui/AppDivider';
import { matchesRepository } from '../../../src/database/repositories/matches.repository';
import { MatchEntity } from '../../../src/domain/match.types';
import { PREVIEW_SCORECARD } from '../../../src/mocks/previewData';
import { appHaptics } from '../../../src/utils/haptics';
import { Sparkles } from 'lucide-react-native';

export default function FullScorecardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [match, setMatch] = useState<MatchEntity | null>(null);
  const [activeTab, setActiveTab] = useState<'BATTING' | 'BOWLING' | 'FOW' | 'BALLS'>('BATTING');

  useEffect(() => {
    async function load() {
      if (id) {
        const found = await matchesRepository.getMatchById(id);
        if (found) setMatch(found);
      }
    }
    load();
  }, [id]);

  const teamAName = match?.teamA.name || PREVIEW_SCORECARD.battingTeamName;
  const teamBName = match?.teamB.name || PREVIEW_SCORECARD.bowlingTeamName;

  return (
    <AppScreen scrollable edges={['top', 'left', 'right']}>
      <AppHeader
        title="Full Scorecard"
        subtitle={`${teamAName} vs ${teamBName}`}
        showBack
      />

      <View style={styles.content}>
        {/* Phase 1 Fixture Notice */}
        <View style={styles.noticeBox}>
          <Sparkles size={14} color={colors.accentPrimary} />
          <AppText variant="caption" color="accent" weight="bold">
            PHASE 1 SCORECARD PREVIEW (FIXTURE DATA)
          </AppText>
        </View>

        {/* Scorecard Hero Banner */}
        <AppCard variant="elevated" padding="md" style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <AppText variant="title" weight="heavy">
                {teamAName} Innings
              </AppText>
              <AppText variant="caption" color="secondary">
                {PREVIEW_SCORECARD.oversCompleted} / {PREVIEW_SCORECARD.maxOvers} Overs
              </AppText>
            </View>
            <View style={styles.heroScore}>
              <AppText variant="h2" weight="black" color="accent">
                {PREVIEW_SCORECARD.totalScore}/{PREVIEW_SCORECARD.totalWickets}
              </AppText>
              <AppText variant="caption" color="secondary" align="right">
                CRR: {PREVIEW_SCORECARD.currentRunRate.toFixed(2)}
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* Scorecard Tabs */}
        <View style={styles.tabsRow}>
          {(['BATTING', 'BOWLING', 'FOW', 'BALLS'] as const).map((tab) => {
            const isSelected = activeTab === tab;
            const labels = {
              BATTING: 'Batting',
              BOWLING: 'Bowling',
              FOW: 'Fall of Wickets',
              BALLS: 'Ball History',
            };
            return (
              <Pressable
                key={tab}
                onPress={() => {
                  appHaptics.selection();
                  setActiveTab(tab);
                }}
                style={[styles.tab, isSelected && styles.tabSelected]}
              >
                <AppText
                  variant="caption"
                  weight={isSelected ? 'bold' : 'medium'}
                  color={isSelected ? 'inverse' : 'secondary'}
                >
                  {labels[tab]}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        {/* Tab 1: Batting */}
        {activeTab === 'BATTING' && (
          <AppCard variant="elevated" padding="none" style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <View style={styles.nameHeader}>
                <AppText variant="caption" color="muted" weight="bold">
                  BATTER
                </AppText>
              </View>
              <View style={styles.numHeader}><AppText variant="caption" color="muted" weight="bold" align="center">R</AppText></View>
              <View style={styles.numHeader}><AppText variant="caption" color="muted" weight="bold" align="center">B</AppText></View>
              <View style={styles.numHeader}><AppText variant="caption" color="muted" weight="bold" align="center">4s</AppText></View>
              <View style={styles.numHeader}><AppText variant="caption" color="muted" weight="bold" align="center">6s</AppText></View>
              <View style={styles.srHeader}><AppText variant="caption" color="muted" weight="bold" align="right">SR</AppText></View>
            </View>

            {PREVIEW_SCORECARD.batters.map((b, idx) => (
              <View key={b.playerId}>
                <View style={styles.tableRow}>
                  <View style={styles.nameHeader}>
                    <AppText variant="body" weight="bold" color="primary">
                      {b.name}
                    </AppText>
                    <AppText variant="caption" color="muted" numberOfLines={1}>
                      {b.dismissalText}
                    </AppText>
                  </View>
                  <View style={styles.numHeader}><AppText variant="body" weight="bold" align="center">{b.runs}</AppText></View>
                  <View style={styles.numHeader}><AppText variant="bodySmall" color="secondary" align="center">{b.balls}</AppText></View>
                  <View style={styles.numHeader}><AppText variant="bodySmall" color="secondary" align="center">{b.fours}</AppText></View>
                  <View style={styles.numHeader}><AppText variant="bodySmall" color="secondary" align="center">{b.sixes}</AppText></View>
                  <View style={styles.srHeader}><AppText variant="bodySmall" color="accentSecondary" weight="semibold" align="right">{b.strikeRate.toFixed(1)}</AppText></View>
                </View>
                {idx < PREVIEW_SCORECARD.batters.length - 1 && <View style={styles.rowDivider} />}
              </View>
            ))}

            {/* Extras Summary */}
            <View style={styles.extrasRow}>
              <AppText variant="bodySmall" color="secondary">
                Extras: (wd {PREVIEW_SCORECARD.extras.wides}, nb {PREVIEW_SCORECARD.extras.noBalls}, b {PREVIEW_SCORECARD.extras.byes}, lb {PREVIEW_SCORECARD.extras.legByes})
              </AppText>
              <AppText variant="body" weight="heavy" color="warning">
                {PREVIEW_SCORECARD.extras.total}
              </AppText>
            </View>
          </AppCard>
        )}

        {/* Tab 2: Bowling */}
        {activeTab === 'BOWLING' && (
          <AppCard variant="elevated" padding="none" style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <View style={styles.nameHeader}>
                <AppText variant="caption" color="muted" weight="bold">
                  BOWLER
                </AppText>
              </View>
              <View style={styles.numHeader}><AppText variant="caption" color="muted" weight="bold" align="center">O</AppText></View>
              <View style={styles.numHeader}><AppText variant="caption" color="muted" weight="bold" align="center">M</AppText></View>
              <View style={styles.numHeader}><AppText variant="caption" color="muted" weight="bold" align="center">R</AppText></View>
              <View style={styles.numHeader}><AppText variant="caption" color="muted" weight="bold" align="center">W</AppText></View>
              <View style={styles.srHeader}><AppText variant="caption" color="muted" weight="bold" align="right">ECON</AppText></View>
            </View>

            {PREVIEW_SCORECARD.bowlers.map((bw, idx) => (
              <View key={bw.playerId}>
                <View style={styles.tableRow}>
                  <View style={styles.nameHeader}>
                    <AppText variant="body" weight="bold" color="primary">
                      {bw.name}
                    </AppText>
                  </View>
                  <View style={styles.numHeader}><AppText variant="body" align="center">{bw.overs}</AppText></View>
                  <View style={styles.numHeader}><AppText variant="bodySmall" color="secondary" align="center">{bw.maidens}</AppText></View>
                  <View style={styles.numHeader}><AppText variant="bodySmall" color="secondary" align="center">{bw.runs}</AppText></View>
                  <View style={styles.numHeader}><AppText variant="body" weight="heavy" color="danger" align="center">{bw.wickets}</AppText></View>
                  <View style={styles.srHeader}><AppText variant="bodySmall" color="accentSecondary" weight="semibold" align="right">{bw.economy.toFixed(2)}</AppText></View>
                </View>
                {idx < PREVIEW_SCORECARD.bowlers.length - 1 && <View style={styles.rowDivider} />}
              </View>
            ))}
          </AppCard>
        )}

        {/* Tab 3: Fall of Wickets */}
        {activeTab === 'FOW' && (
          <AppCard variant="elevated" padding="md" style={styles.tableCard}>
            <AppText variant="caption" color="secondary" weight="bold" style={styles.fowTitle}>
              FALL OF WICKETS TIMELINE
            </AppText>
            {PREVIEW_SCORECARD.fallOfWickets.map((item) => (
              <View key={item.wicketNumber} style={styles.fowItem}>
                <View style={styles.fowBadge}>
                  <AppText variant="caption" weight="heavy" color="inverse">
                    W{item.wicketNumber}
                  </AppText>
                </View>
                <View style={styles.fowInfo}>
                  <AppText variant="bodySmall" weight="bold">
                    {item.score} runs ({item.playerName})
                  </AppText>
                  <AppText variant="caption" color="muted">
                    At {item.overs} overs
                  </AppText>
                </View>
              </View>
            ))}
          </AppCard>
        )}

        {/* Tab 4: Ball History */}
        {activeTab === 'BALLS' && (
          <AppCard variant="elevated" padding="md" style={styles.tableCard}>
            <AppText variant="caption" color="secondary" weight="bold" style={styles.fowTitle}>
              DELIVERY SEQUENCE (OVER 1)
            </AppText>
            <View style={styles.ballsGrid}>
              {PREVIEW_SCORECARD.timelineBalls.map((b) => (
                <View key={b.id} style={styles.ballCard}>
                  <AppBadge
                    label={b.displayText}
                    variant={b.type === 'WICKET' ? 'danger' : b.type === 'FOUR' ? 'accentSecondary' : b.type === 'SIX' ? 'accent' : 'muted'}
                  />
                  <AppText variant="caption" color="secondary" style={styles.ballDesc}>
                    Ball {b.ballNumber}: {b.type}
                  </AppText>
                </View>
              ))}
            </View>
          </AppCard>
        )}
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
  heroCard: {
    marginBottom: spacing.base,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroScore: {
    alignItems: 'flex-end',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.base,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabSelected: {
    backgroundColor: colors.accentPrimary,
    borderColor: colors.accentPrimary,
  },
  tableCard: {
    marginBottom: spacing.base,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  nameHeader: {
    flex: 2.5,
  },
  numHeader: {
    flex: 0.9,
    alignItems: 'center',
  },
  srHeader: {
    flex: 1.4,
    alignItems: 'flex-end',
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  extrasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  fowTitle: {
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  fowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  fowBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fowInfo: {
    flex: 1,
  },
  ballsGrid: {
    gap: spacing.sm,
  },
  ballCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceHover,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ballDesc: {
    flex: 1,
  },
});
