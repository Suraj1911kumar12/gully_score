/**
 * GullyScore Create Match Screen
 * Route: /match/create
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { colors, spacing } from '../../src/theme';
import { AppScreen } from '../../src/components/ui/AppScreen';
import { AppHeader } from '../../src/components/ui/AppHeader';
import { AppButton } from '../../src/components/ui/AppButton';
import { AppText } from '../../src/components/ui/AppText';
import { TeamNameInput } from '../../src/components/match/TeamNameInput';
import { OversSelector } from '../../src/components/match/OversSelector';
import { PlayerCountSelector } from '../../src/components/match/PlayerCountSelector';
import { MatchRulesCard } from '../../src/components/match/MatchRulesCard';
import { TossSelector } from '../../src/components/match/TossSelector';
import { useMatchDraftStore } from '../../src/stores/matchDraft.store';
import { matchCreateSchema, MatchCreateFormData } from '../../src/utils/validation';
import { ArrowRight } from 'lucide-react-native';

export default function CreateMatchScreen() {
  const router = useRouter();
  const draft = useMatchDraftStore();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MatchCreateFormData>({
    defaultValues: {
      teamAName: draft.teamAName || 'Team A',
      teamBName: draft.teamBName || 'Team B',
      overs: draft.overs || 5,
      ballsPerOver: draft.ballsPerOver || 6,
      playersPerTeam: draft.playersPerTeam || 11,
      rules: draft.rules,
      toss: draft.toss,
    },
    // We can validate using zod manually or resolver
  });

  const currentValues = watch();

  const onSubmit = () => {
    // Validate with Zod
    const result = matchCreateSchema.safeParse(currentValues);
    if (!result.success) {
      const issue = result.error.issues[0];
      alert(issue.message);
      return;
    }

    const data = result.data;
    // Save to Zustand draft store
    draft.setTeamAName(data.teamAName);
    draft.setTeamBName(data.teamBName);
    draft.setOvers(data.overs);
    draft.setBallsPerOver(data.ballsPerOver);
    draft.setPlayersPerTeam(data.playersPerTeam);
    draft.updateRules(data.rules);
    draft.setToss(data.toss);

    // Proceed to player entries
    router.push('/match/players');
  };

  return (
    <AppScreen scrollable edges={['top', 'left', 'right']}>
      <AppHeader
        title="Create Match"
        subtitle="Step 1 of 2: Format & Rules"
        showBack
      />

      <View style={styles.formContainer}>
        {/* Team Names Section */}
        <AppText variant="caption" color="secondary" weight="semibold" style={styles.sectionTitle}>
          TEAM DETAILS
        </AppText>

        <Controller
          control={control}
          name="teamAName"
          render={({ field: { onChange, value } }) => (
            <TeamNameInput
              label="Team A Name"
              value={value}
              onChangeText={(text) => {
                onChange(text);
                setValue('teamAName', text);
              }}
              badgeText="Team A"
              badgeColor={colors.accentPrimary}
              error={errors.teamAName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="teamBName"
          render={({ field: { onChange, value } }) => (
            <TeamNameInput
              label="Team B Name"
              value={value}
              onChangeText={(text) => {
                onChange(text);
                setValue('teamBName', text);
              }}
              badgeText="Team B"
              badgeColor={colors.accentSecondary}
              error={errors.teamBName?.message}
            />
          )}
        />

        {/* Overs Selector */}
        <Controller
          control={control}
          name="overs"
          render={({ field: { onChange, value } }) => (
            <OversSelector
              value={value}
              onChange={(val) => {
                onChange(val);
                setValue('overs', val);
              }}
            />
          )}
        />

        {/* Players Per Team Selector */}
        <Controller
          control={control}
          name="playersPerTeam"
          render={({ field: { onChange, value } }) => (
            <PlayerCountSelector
              value={value}
              onChange={(val) => {
                onChange(val);
                setValue('playersPerTeam', val);
              }}
            />
          )}
        />

        {/* Match Rules & Extras Card */}
        <Controller
          control={control}
          name="rules"
          render={({ field: { onChange, value } }) => (
            <MatchRulesCard
              rules={value}
              onChange={(updated) => {
                const newRules = { ...value, ...updated };
                onChange(newRules);
                setValue('rules', newRules);
              }}
            />
          )}
        />

        {/* Toss Selector */}
        <Controller
          control={control}
          name="toss"
          render={({ field: { onChange, value } }) => (
            <TossSelector
              teamAName={currentValues.teamAName || 'Team A'}
              teamBName={currentValues.teamBName || 'Team B'}
              toss={value}
              onChange={(newToss) => {
                onChange(newToss);
                setValue('toss', newToss);
              }}
            />
          )}
        />

        {/* Submit CTA */}
        <AppButton
          title="Continue to Players"
          variant="primary"
          size="lg"
          onPress={onSubmit}
          icon={<ArrowRight size={20} color={colors.textInverse} />}
          iconPosition="right"
          fullWidth
          style={styles.submitBtn}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: spacing.base,
    paddingBottom: spacing['4xl'],
  },
  sectionTitle: {
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  submitBtn: {
    marginTop: spacing.md,
  },
});
