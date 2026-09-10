import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, radius } from '../theme/colors';

export default function OnboardingScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.illustration} />
      <Text style={styles.title}>Learn to cook like a guru</Text>
      <Text style={styles.subtitle}>
        Step-by-step tutorials and an AI sous-chef in your pocket.
      </Text>
      <PrimaryButton label="Get Started" onPress={() => navigation.replace('MainTabs')} />
      <PrimaryButton
        label="I already have an account"
        variant="ghost"
        onPress={() => navigation.replace('MainTabs')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  illustration: {
    height: 260,
    borderRadius: radius.lg,
    backgroundColor: colors.orange,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 13,
    color: colors.inkSoft,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
});
