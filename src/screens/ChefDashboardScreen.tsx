import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, radius } from '../theme/colors';

const MY_RECIPES = [
  { title: 'Ceylon Fish Curry', status: 'approved' as const },
  { title: 'Coconut Roti', status: 'pending' as const },
];

const STATUS_COLOR = {
  approved: { bg: colors.successBg, text: colors.success },
  pending: { bg: colors.pendingBg, text: colors.pending },
  rejected: { bg: colors.dangerBg, text: colors.danger },
};

export default function ChefDashboardScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.title}>My Kitchen</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>128</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>14</Text>
            <Text style={styles.statLabel}>Published</Text>
          </View>
        </View>
        <Text style={styles.sectionLabel}>My recipes</Text>
        {MY_RECIPES.map((r) => {
          const c = STATUS_COLOR[r.status];
          return (
            <View key={r.title} style={styles.recipeRow}>
              <View style={styles.thumb} />
              <Text style={styles.recipeName}>{r.title}</Text>
              <View style={[styles.badge, { backgroundColor: c.bg }]}>
                <Text style={[styles.badgeText, { color: c.text }]}>{r.status.toUpperCase()}</Text>
              </View>
            </View>
          );
        })}
        <PrimaryButton label="+ New Recipe" onPress={() => navigation.navigate('UploadRecipe')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  topbar: { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line },
  title: { fontSize: 17, fontWeight: '700', color: colors.ink },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  statCard: {
    flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md,
  },
  statNum: { fontSize: 20, fontWeight: '700', color: colors.ink },
  statLabel: { fontSize: 11, color: colors.inkSoft },
  sectionLabel: { fontSize: 11, fontWeight: '600', color: colors.inkSoft, textTransform: 'uppercase', marginBottom: spacing.sm },
  recipeRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  thumb: { width: 46, height: 46, borderRadius: radius.sm, backgroundColor: '#FFE3CC' },
  recipeName: { flex: 1, fontSize: 12.5, fontWeight: '600', color: colors.ink },
  badge: { paddingVertical: 3, paddingHorizontal: 10, borderRadius: radius.pill },
  badgeText: { fontSize: 9.5, fontWeight: '700' },
});
