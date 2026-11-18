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

/** Fetches a full recipe by ID, including ingredients and steps. Returns null if not found. */
export async function getRecipeById(id: string): Promise<FullRecipe | null> {
  const db = await getDb();
  const r = await db.getFirstAsync<{
    id: string;
    title: string;
    cook_time_minutes: number;
    difficulty: string;
    servings: number;
  }>('SELECT id, title, cook_time_minutes, difficulty, servings FROM recipes WHERE id = ?', [id]);
  if (!r) return null;

  const ingredients = await db.getAllAsync<{ name: string; amount: string }>(
    'SELECT name, amount FROM ingredients WHERE recipe_id = ? ORDER BY sort_order',
    [id],
  );
  const steps = await db.getAllAsync<{ instruction: string; timer_seconds: number | null }>(
    'SELECT instruction, timer_seconds FROM steps WHERE recipe_id = ? ORDER BY step_number',
    [id],
  );

  return {
    id: r.id,
    title: r.title,
    cookTimeMinutes: r.cook_time_minutes,
    difficulty: r.difficulty,
    servings: r.servings,
    ingredients,
    steps: steps.map((s) => ({ instruction: s.instruction, timerSeconds: s.timer_seconds })),
  };
}

export async function isFavorite(recipeId: string): Promise<boolean> {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT 1 FROM favorites WHERE recipe_id = ?', [recipeId]);
  return row !== null;
}

/** Toggles the favorite flag and returns the new state. */
export async function toggleFavorite(recipeId: string): Promise<boolean> {
  const db = await getDb();
  if (await isFavorite(recipeId)) {
    await db.runAsync('DELETE FROM favorites WHERE recipe_id = ?', [recipeId]);
    return false;
  }
  await db.runAsync('INSERT INTO favorites (recipe_id) VALUES (?)', [recipeId]);
  return true;
}

export async function listFavoriteRecipes(): Promise<LocalRecipeSummary[]> {
  const db = await getDb();
  return db.getAllAsync<LocalRecipeSummary>(
    `SELECT r.id, r.title, r.cook_time_minutes, r.difficulty, r.source
     FROM favorites f JOIN recipes r ON r.id = f.recipe_id
     ORDER BY f.saved_at DESC`,
  );
}

export async function getCookProgress(recipeId: string): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ step_index: number }>(
    'SELECT step_index FROM cook_progress WHERE recipe_id = ?',
    [recipeId],
  );
  return row?.step_index ?? 0;
}

export async function saveCookProgress(recipeId: string, stepIndex: number): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO cook_progress (recipe_id, step_index) VALUES (?, ?)
     ON CONFLICT(recipe_id) DO UPDATE SET step_index = excluded.step_index, updated_at = strftime('%s','now')`,
    [recipeId, stepIndex],
  );
}

export async function clearCookProgress(recipeId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM cook_progress WHERE recipe_id = ?', [recipeId]);
}
