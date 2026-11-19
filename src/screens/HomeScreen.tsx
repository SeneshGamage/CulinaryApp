import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../components/RecipeCard';
import { colors, spacing, radius } from '../theme/colors';
import { listLocalRecipes, LocalRecipeSummary } from '../db/recipeRepository';
import { useFocusData } from '../hooks/useFocusData';

export default function HomeScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const { data: recipes, loading } = useFocusData<LocalRecipeSummary[]>(listLocalRecipes, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? recipes.filter((r) => r.title.toLowerCase().includes(q)) : recipes;
  }, [recipes, query]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.brand}>ChefGuru</Text>
        <Pressable onPress={() => navigation.navigate('DownloadRecipes')}>
          <Text style={styles.getMore}>Get More Recipes</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <TextInput
          placeholder="Search recipes…"
          placeholderTextColor={colors.inkSoft}
          style={styles.search}
          value={query}
          onChangeText={setQuery}
        />
        <View style={styles.hero} />
        <Text style={styles.sectionLabel}>Your recipes</Text>

        {loading && <ActivityIndicator color={colors.orange} />}
        {!loading && filtered.length === 0 && (
          <Text style={styles.empty}>
            {query ? 'No recipes match your search.' : 'No recipes yet. Tap "Get More Recipes".'}
          </Text>
        )}

        <View style={styles.grid}>
          {filtered.map((r) => (
            <View key={r.id} style={styles.cell}>
              <RecipeCard
                title={r.title}
                subtitle={`${r.cook_time_minutes} min · ${r.difficulty}`}
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: r.id })}
              />
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: { fontSize: 18, fontWeight: '700', color: colors.ink },
  getMore: { fontSize: 11.5, fontWeight: '600', color: colors.orangeDeep },
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
  hero: { height: 130, borderRadius: radius.md, backgroundColor: colors.orange, marginBottom: spacing.md },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.inkSoft,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  empty: { fontSize: 12, color: colors.inkSoft, textAlign: 'center', marginTop: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  cell: { width: '48%' },
});