import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../store/useAppStore';

const BADGE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: colors.pendingBg, text: colors.pending, label: 'PENDING' },
  approved: { bg: colors.successBg, text: colors.success, label: 'APPROVED' },
  rejected: { bg: colors.dangerBg, text: colors.danger, label: 'REJECTED' },
};

export default function ChefApplicationStatusScreen() {
  const status = useAppStore((s) => s.chefApplicationStatus);
  const badge = BADGE_STYLES[status] ?? BADGE_STYLES.pending;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero} />
      <Text style={styles.title}>Application under review</Text>
      <View style={[styles.badge, { backgroundColor: badge.bg }]}>
        <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
      </View>
      <Text style={styles.note}>
        We'll notify you once our team has reviewed your submission — usually within 2–3 days.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, padding: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  hero: { width: '100%', height: 120, borderRadius: radius.md, backgroundColor: colors.orange, marginBottom: spacing.md },
  title: { fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: spacing.sm },
  badge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: radius.pill, marginBottom: spacing.md },
  badgeText: { fontSize: 10, fontWeight: '700' },
  note: { fontSize: 12, color: colors.inkSoft, textAlign: 'center' },
});
