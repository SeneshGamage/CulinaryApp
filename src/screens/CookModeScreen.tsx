import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing } from '../theme/colors';
import {
  getRecipeById,
  getCookProgress,
  saveCookProgress,
  clearCookProgress,
  FullRecipe,
} from '../db/recipeRepository';

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Treats null and 0 as "this step has no timer". */
function timerFor(steps: FullRecipe['steps'], index: number): number | null {
  const seconds = steps[index]?.timerSeconds;
  return seconds && seconds > 0 ? seconds : null;
}

export default function CookModeScreen({ route, navigation }: any) {
  const recipeId: string = route.params.recipeId;
  const [steps, setSteps] = useState<FullRecipe['steps']>([]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [running, setRunning] = useState(false);

  // Load steps and restore saved progress
  useEffect(() => {
    (async () => {
      try {
        const [recipe, saved] = await Promise.all([
          getRecipeById(recipeId),
          getCookProgress(recipeId),
        ]);
        const loadedSteps = recipe?.steps ?? [];
        setSteps(loadedSteps);
        setStep(Math.min(saved, Math.max(loadedSteps.length - 1, 0)));
      } catch (e) {
        console.error('Cook mode load failed:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [recipeId]);

  // Reset the timer whenever the step changes
  useEffect(() => {
    setRunning(false);
    setSecondsLeft(timerFor(steps, step));
  }, [step, steps]);

  // Countdown tick
  useEffect(() => {
    if (!running || secondsLeft === null) return;
    if (secondsLeft <= 0) {
      setRunning(false);
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => (s === null ? s : s - 1)), 1000);
    return () => clearTimeout(id);
  }, [running, secondsLeft]);

  const goTo = (next: number) => {
    setStep(next);
    saveCookProgress(recipeId, next).catch((e) => console.error('saveCookProgress failed:', e));
  };

  const finish = async () => {
    await clearCookProgress(recipeId).catch((e) => console.error('clearCookProgress failed:', e));
    navigation.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.orange} style={{ marginTop: spacing.xl }} />
      </SafeAreaView>
    );
  }

  if (steps.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.empty}>This recipe has no steps.</Text>
      </SafeAreaView>
    );
  }

  const isLast = step === steps.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressRow}>
        {steps.map((_, i) => (
          <View key={i} style={[styles.progressSeg, i <= step && styles.progressDone]} />
        ))}
      </View>

      <View style={{ padding: spacing.md, flex: 1 }}>
        <Text style={styles.stepNum}>
          STEP {step + 1} OF {steps.length}
        </Text>
        <Text style={styles.stepText}>{steps[step].instruction}</Text>

        {secondsLeft !== null ? (
          <View style={{ alignItems: 'center' }}>
            <View style={[styles.timer, secondsLeft === 0 && { borderColor: colors.success }]}>
              <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
            </View>
            <Pressable
              style={styles.timerBtn}
              onPress={() => {
                if (secondsLeft === 0) setSecondsLeft(timerFor(steps, step));
                else setRunning((r) => !r);
              }}
            >
              <Text style={styles.timerBtnText}>
                {secondsLeft === 0 ? 'Restart timer' : running ? 'Pause' : 'Start timer'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <Text style={styles.noTimer}>No timer for this step.</Text>
        )}
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Back"
          variant="ghost"
          style={{ flex: 1 }}
          onPress={() => (step > 0 ? goTo(step - 1) : navigation.goBack())}
        />
        <View style={{ width: spacing.sm }} />
        <PrimaryButton
          label={isLast ? 'Finish' : 'Next Step'}
          style={{ flex: 1 }}
          onPress={() => (isLast ? finish() : goTo(step + 1))}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  empty: { fontSize: 13, color: colors.inkSoft, textAlign: 'center', marginTop: spacing.xl },
  progressRow: { flexDirection: 'row', gap: 4, padding: spacing.md, paddingBottom: 0 },
  progressSeg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.line },
  progressDone: { backgroundColor: colors.orange },
  stepNum: { fontSize: 12, color: colors.orangeDeep, fontWeight: '600', marginBottom: spacing.sm },
  stepText: { fontSize: 17, lineHeight: 24, color: colors.ink, marginBottom: spacing.lg },
  timer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 5,
    borderColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  timerText: { fontSize: 20, fontWeight: '700', color: colors.ink },
  timerBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
  },
  timerBtnText: { fontSize: 12, fontWeight: '600', color: colors.orangeDeep },
  noTimer: { fontSize: 12, color: colors.inkSoft, textAlign: 'center' },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
