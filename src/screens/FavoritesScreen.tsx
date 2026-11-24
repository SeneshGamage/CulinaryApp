import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../components/RecipeCard';
import { colors, spacing } from '../theme/colors';
import { listFavoriteRecipes, LocalRecipeSummary } from '../db/recipeRepository';
import { useFocusData } from '../hooks/useFocusData';

export default function FavoritesScreen({ navigation }: any) {
  const { data: favorites, loading } = useFocusData<LocalRecipeSummary[]>(listFavoriteRecipes, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.title}>Favorites</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        {loading && <ActivityIndicator color={colors.orange} />}
        {!loading && favorites.length === 0 && (
          <Text style={styles.empty}>No favorites yet. Tap ♡ Save on any recipe to keep it here.</Text>
        )}
        <View style={styles.grid}>
          {favorites.map((r) => (
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
  topbar: { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line },
  title: { fontSize: 17, fontWeight: '700', color: colors.ink },
  empty: { fontSize: 12, color: colors.inkSoft, textAlign: 'center', marginTop: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  cell: { width: '48%' },
});