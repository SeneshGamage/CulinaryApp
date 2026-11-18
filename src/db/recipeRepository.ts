import { getDb } from './database';

export type RecipeSource = 'seed' | 'downloaded' | 'chef_upload';

export interface FullRecipe {
  id: string;
  title: string;
  cookTimeMinutes: number;
  difficulty: string;
  servings: number;
  ingredients: { name: string; amount: string }[];
  steps: { instruction: string; timerSeconds: number | null }[];
}

export interface LocalRecipeSummary {
  id: string;
  title: string;
  cook_time_minutes: number;
  difficulty: string;
  source: RecipeSource;
}

/** Inserts (or replaces) a full recipe — ingredients and steps included — into the local DB. */
export async function insertRecipeLocally(recipe: FullRecipe, source: RecipeSource): Promise<void> {
  const db = await getDb();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO recipes (id, title, cook_time_minutes, difficulty, servings, source)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title,
         cook_time_minutes = excluded.cook_time_minutes,
         difficulty = excluded.difficulty,
         servings = excluded.servings,
         source = excluded.source`,
      [recipe.id, recipe.title, recipe.cookTimeMinutes, recipe.difficulty, recipe.servings, source],
    );

    await db.runAsync('DELETE FROM ingredients WHERE recipe_id = ?', [recipe.id]);
    for (let i = 0; i < recipe.ingredients.length; i++) {
      const ing = recipe.ingredients[i];
      await db.runAsync(
        `INSERT INTO ingredients (id, recipe_id, name, amount, sort_order) VALUES (?, ?, ?, ?, ?)`,
        [`${recipe.id}-ing-${i}`, recipe.id, ing.name, ing.amount, i],
      );
    }

    await db.runAsync('DELETE FROM steps WHERE recipe_id = ?', [recipe.id]);
    for (let i = 0; i < recipe.steps.length; i++) {
      const step = recipe.steps[i];
      await db.runAsync(
        `INSERT INTO steps (id, recipe_id, step_number, instruction, timer_seconds) VALUES (?, ?, ?, ?, ?)`,
        [`${recipe.id}-step-${i}`, recipe.id, i + 1, step.instruction, step.timerSeconds],
      );
    }
  });
}

export async function listLocalRecipes(): Promise<LocalRecipeSummary[]> {
  const db = await getDb();
  return db.getAllAsync<LocalRecipeSummary>(
    'SELECT id, title, cook_time_minutes, difficulty, source FROM recipes ORDER BY created_at DESC',
  );
}

export async function getLocalRecipeIds(): Promise<Set<string>> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ id: string }>('SELECT id FROM recipes');
  return new Set(rows.map((r) => r.id));
}

/** Removes a downloaded recipe to free space. Refuses to remove seed/chef_upload recipes. */
export async function removeDownloadedRecipe(recipeId: string): Promise<void> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ source: RecipeSource }>(
    'SELECT source FROM recipes WHERE id = ?',
    [recipeId],
  );
  if (!row || row.source !== 'downloaded') {
    throw new Error('Only downloaded recipes can be removed.');
  }
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM favorites WHERE recipe_id = ?', [recipeId]);
    await db.runAsync('DELETE FROM cook_progress WHERE recipe_id = ?', [recipeId]);
    await db.runAsync('DELETE FROM ingredients WHERE recipe_id = ?', [recipeId]);
    await db.runAsync('DELETE FROM steps WHERE recipe_id = ?', [recipeId]);
    await db.runAsync('DELETE FROM recipes WHERE id = ?', [recipeId]);
  });
}
