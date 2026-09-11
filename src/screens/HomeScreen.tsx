import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../components/RecipeCard';
import { colors, spacing, radius } from '../theme/colors';

const TRENDING = [
  { title: 'Miso Glazed Salmon', subtitle: '25 min · Easy' },
  { title: 'Brown Butter Pasta', subtitle: '18 min · Easy' },
];

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.brand}>ChefGuru</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <TextInput
          placeholder="Search recipes, ingredients…"
          placeholderTextColor={colors.inkSoft}
          style={styles.search}
        />
        <View style={styles.hero} />
        <Text style={styles.sectionLabel}>Trending this week</Text>
        <View style={styles.row}>
          {TRENDING.map((r) => (
            <RecipeCard
              key={r.title}
              title={r.title}
              subtitle={r.subtitle}
              onPress={() => navigation.navigate('RecipeDetail', { title: r.title })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  topbar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  brand: { fontSize: 18, fontWeight: '700', color: colors.ink },
  search: {
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    color: colors.ink,
  },
  hero: {
    height: 130,
    borderRadius: radius.md,
    backgroundColor: colors.orange,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.inkSoft,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row', gap: spacing.sm },
});
