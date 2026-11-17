import { supabase } from './supabase';
import { FullRecipe } from '../db/recipeRepository';

export interface CatalogEntry {
  id: string;
  title: string;
  cookTimeMinutes: number;
  difficulty: string;
  thumbnailUrl: string | null;
}

/**
 * Lightweight browse list — titles + thumbnails only, so this stays fast
 * even on a slow connection. Requires the `recipes` table in Supabase to
 * exist with these columns (id, title, cook_time_minutes, difficulty,
 * thumbnail_url).
 */
export async function fetchCatalog(): Promise<CatalogEntry[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('id, title, cook_time_minutes, difficulty, thumbnail_url')
    .eq('status', 'approved');

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    cookTimeMinutes: row.cook_time_minutes,
    difficulty: row.difficulty,
    thumbnailUrl: row.thumbnail_url,
  }));
}

/** Fetches the full recipe (ingredients + steps) for a single catalog entry, on demand. */
export async function fetchFullRecipe(recipeId: string): Promise<FullRecipe> {
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select('id, title, cook_time_minutes, difficulty, servings')
    .eq('id', recipeId)
    .single();
  if (recipeError) throw recipeError;

  const { data: ingredients, error: ingredientsError } = await supabase
    .from('ingredients')
    .select('name, amount')
    .eq('recipe_id', recipeId)
    .order('sort_order');
  if (ingredientsError) throw ingredientsError;

  const { data: steps, error: stepsError } = await supabase
    .from('steps')
    .select('instruction, timer_seconds')
    .eq('recipe_id', recipeId)
    .order('step_number');
  if (stepsError) throw stepsError;

  return {
    id: recipe.id,
    title: recipe.title,
    cookTimeMinutes: recipe.cook_time_minutes,
    difficulty: recipe.difficulty,
    servings: recipe.servings,
    ingredients: (ingredients ?? []).map((i) => ({ name: i.name, amount: i.amount })),
    steps: (steps ?? []).map((s) => ({
      instruction: s.instruction,
      timerSeconds: s.timer_seconds,
    })),
  };
}
