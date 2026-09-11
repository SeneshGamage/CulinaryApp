import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, radius } from '../theme/colors';

const STEPS = [
  'Preheat the pan over medium heat.',
  'Pat the salmon dry and season lightly.',
  'Whisk miso, mirin and soy sauce, then brush over the salmon.',
  'Sear skin-side down for 4 minutes.',
  'Flip and cook 2 more minutes, then rest.',
];

export default function CookModeScreen({ navigation }: any) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressRow}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.progressSeg, i <= step && styles.progressDone]} />
        ))}
      </View>
      <View style={{ padding: spacing.md, flex: 1 }}>
        <Text style={styles.stepNum}>STEP {step + 1} OF {STEPS.length}</Text>
        <Text style={styles.stepText}>{STEPS[step]}</Text>
        <View style={styles.timer}>
          <Text style={styles.timerText}>04:12</Text>
        </View>
        <View style={styles.hero} />
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          label="Back"
          variant="ghost"
          style={{ flex: 1 }}
          onPress={() => (step > 0 ? setStep(step - 1) : navigation.goBack())}
        />
        <View style={{ width: spacing.sm }} />
        <PrimaryButton
          label={isLast ? 'Finish' : 'Next Step'}
          style={{ flex: 1 }}
          onPress={() => (isLast ? navigation.goBack() : setStep(step + 1))}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  progressRow: { flexDirection: 'row', gap: 4, padding: spacing.md, paddingBottom: 0 },
  progressSeg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.line },
  progressDone: { backgroundColor: colors.orange },
  stepNum: { fontSize: 12, color: colors.orangeDeep, fontWeight: '600', marginBottom: spacing.sm },
  stepText: { fontSize: 17, lineHeight: 24, color: colors.ink, marginBottom: spacing.lg },
  timer: {
    width: 110, height: 110, borderRadius: 55, borderWidth: 5, borderColor: colors.orange,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: spacing.lg,
  },
  timerText: { fontSize: 20, fontWeight: '700', color: colors.ink },
  hero: { height: 90, borderRadius: radius.md, backgroundColor: colors.orange },
  footer: { flexDirection: 'row', padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.line },
});
