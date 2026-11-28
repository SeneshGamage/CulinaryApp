import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, radius } from '../theme/colors';
import { getRecipeById, isFavorite, toggleFavorite, FullRecipe } from '../db/recipeRepository';
import { useFocusData } from '../hooks/useFocusData';

export default function RecipeDetailScreen({ route, navigation }: any) {
  const recipeId: string = route.params.recipeId;
  const loader = useCallback(() => getRecipeById(recipeId), [recipeId]);
  const { data: recipe, loading, error, retry } = useFocusData<FullRecipe | null>(loader, null);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    isFavorite(recipeId)
      .then(setFavorite)
      .catch((e) => console.error('isFavorite failed:', e));
  }, [recipeId]);

  const onToggleFavorite = async () => {
    try {
      setFavorite(await toggleFavorite(recipeId));
    } catch (e) {
      console.error('toggleFavorite failed:', e);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.orange} style={{ marginTop: spacing.xl }} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>Could not load this recipe.</Text>
        <Pressable onPress={retry}>
          <Text style={styles.retry}>Try again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>This recipe is no longer on your device.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <View style={styles.hero} />
        <View style={styles.titleRow}>
          <Text style={styles.title}>{recipe.title}</Text>
          <Pressable onPress={onToggleFavorite} style={styles.favBtn}>
            <Text style={[styles.favText, favorite && { color: colors.orangeDeep }]}>
              {favorite ? '♥ Saved' : '♡ Save'}
            </Text>
          </Pressable>
        </View>
        <Text style={styles.meta}>
          {recipe.cookTimeMinutes} min · {recipe.difficulty} · {recipe.servings} servings
        </Text>

        <Text style={styles.sectionLabel}>Ingredients</Text>
        {recipe.ingredients.map((i, idx) => (
          <View key={`${i.name}-${idx}`} style={styles.ingredientRow}>
            <Text style={styles.ingredientName}>{i.name}</Text>
            <Text style={styles.ingredientAmount}>{i.amount}</Text>
          </View>
        ))}

        <PrimaryButton
          label="Start Cooking"
          onPress={() => navigation.navigate('CookMode', { recipeId })}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  notFound: { fontSize: 13, color: colors.inkSoft, textAlign: 'center', marginTop: spacing.xl },
  retry: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.orangeDeep,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  hero: {
    height: 150,
    borderRadius: radius.md,
    backgroundColor: colors.orange,
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: { flex: 1, fontSize: 19, fontWeight: '700', color: colors.ink },
  favBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
  },
  favText: { fontSize: 12, fontWeight: '600', color: colors.inkSoft },
  meta: { fontSize: 12, color: colors.inkSoft, marginBottom: spacing.md },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.inkSoft,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  ingredientName: { fontSize: 13, color: colors.ink },
  ingredientAmount: { fontSize: 13, color: colors.inkSoft },
});
