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

    // Reset cook progress if the number of steps has changed
    const existingSteps = await db.getAllAsync<{ step_number: number }>(
      'SELECT step_number FROM steps WHERE recipe_id = ? ORDER BY step_number',
      [recipe.id],
    );
    if (existingSteps.length !== recipe.steps.length) {
      await db.runAsync('DELETE FROM cook_progress WHERE recipe_id = ?', [recipe.id]);
    }

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

  await db.withTransactionAsync(async () => {
    // Recheck the source inside the transaction
    const row = await db.getFirstAsync<{ source: RecipeSource }>(
      'SELECT source FROM recipes WHERE id = ?',
      [recipeId],
    );

    if (!row || row.source !== 'downloaded') {
      throw new Error('Only downloaded recipes can be removed.');
    }

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

  let result: FullRecipe | null = null;
  await db.withTransactionAsync(async () => {
    // Fetch the main recipe details
    const r = await db.getFirstAsync<{
      id: string;
      title: string;
      cook_time_minutes: number | null;
      difficulty: string | null;
      servings: number | null;
    }>('SELECT id, title, cook_time_minutes, difficulty, servings FROM recipes WHERE id = ?', [id]);

    if (!r) {
      result = null;
      return;
    }

    // Normalize nullable values
    const cookTimeMinutes = r.cook_time_minutes ?? 0;
    const difficulty = r.difficulty ?? 'unknown';
    const servings = r.servings ?? 1;

    // Fetch the ingredients
    const ingredients = await db.getAllAsync<{ name: string; amount: string | null }>(
      'SELECT name, amount FROM ingredients WHERE recipe_id = ? ORDER BY sort_order',
      [id],
    ).then(rows =>
      rows.map(ing => ({
        name: ing.name,
        amount: ing.amount ?? 'unknown',
      })),
    );

    // Fetch the steps
    const steps = await db.getAllAsync<{ instruction: string; timer_seconds: number | null }>(
      'SELECT instruction, timer_seconds FROM steps WHERE recipe_id = ? ORDER BY step_number',
      [id],
    ).then(rows =>
      rows.map(step => ({
        instruction: step.instruction,
        timerSeconds: step.timer_seconds ?? 0,
      })),
    );

    // Assign the full recipe to the result variable
    result = {
      id: r.id,
      title: r.title,
      cookTimeMinutes,
      difficulty,
      servings,
      ingredients,
      steps,
    };
  });
  return result;
}

/** Lists favorite recipes with normalized values. */
export async function listFavoriteRecipes(): Promise<LocalRecipeSummary[]> {
  const db = await getDb();
  return db.getAllAsync<LocalRecipeSummary>(
    `SELECT r.id, r.title, COALESCE(r.cook_time_minutes, 0) AS cook_time_minutes,
            COALESCE(r.difficulty, 'unknown') AS difficulty, r.source
     FROM favorites f JOIN recipes r ON r.id = f.recipe_id
     ORDER BY f.saved_at DESC`,
  );
}

// Checks if a recipe is marked as a favorite. Returns true if it is, false otherwise.
export async function isFavorite(recipeId: string): Promise<boolean> {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT 1 FROM favorites WHERE recipe_id = ?', [recipeId]);
  return row !== null;
}

/** Toggles the favorite flag and returns the new state. */
export async function toggleFavorite(recipeId: string): Promise<boolean> {
  const db = await getDb();

  let result: boolean = false;

  await db.withTransactionAsync(async () => {
    // Check if the recipe is currently a favorite
    const isCurrentlyFavorite = await db.getFirstAsync<{ recipe_id: string }>(
      'SELECT recipe_id FROM favorites WHERE recipe_id = ?',
      [recipeId],
    );

    if (isCurrentlyFavorite) {
      // Remove from favorites if it is already a favorite
      await db.runAsync('DELETE FROM favorites WHERE recipe_id = ?', [recipeId]);
      result = false;
    } else {
      // Add to favorites if it is not a favorite
      await db.runAsync(
        `INSERT INTO favorites (recipe_id, saved_at) VALUES (?, strftime('%s','now'))
         ON CONFLICT(recipe_id) DO NOTHING`,
        [recipeId],
      );
      result = true;
    }
  });

  return result;
}

/*export async function listFavoriteRecipes(): Promise<LocalRecipeSummary[]> {
  const db = await getDb();
  return db.getAllAsync<LocalRecipeSummary>(
    `SELECT r.id, r.title, r.cook_time_minutes, r.difficulty, r.source
     FROM favorites f JOIN recipes r ON r.id = f.recipe_id
     ORDER BY f.saved_at DESC`,
  );
}
*/

// Retrieves the cook progress for a given recipe. Returns 0 if no progress is found.
export async function getCookProgress(recipeId: string): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ step_index: number }>(
    'SELECT step_index FROM cook_progress WHERE recipe_id = ?',
    [recipeId],
  );
  return row?.step_index ?? 0;
}

// Saves the cook progress for a given recipe. If the step index is invalid (negative or greater than the number of steps), it throws an error.
export async function saveCookProgress(recipeId: string, stepIndex: number): Promise<void> {
  const db = await getDb();

  // Validate the step index
  const stepCount = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) AS count FROM steps WHERE recipe_id = ?',
    [recipeId],
  ).then(row => row?.count ?? 0);

  if (stepIndex < 0 || stepIndex >= stepCount) {
    throw new Error(`Invalid step index: ${stepIndex}. Must be between 0 and ${stepCount - 1}.`);
  }

  await db.runAsync(
    `INSERT INTO cook_progress (recipe_id, step_index, updated_at)
     VALUES (?, ?, strftime('%s','now'))
     ON CONFLICT(recipe_id) DO UPDATE SET
       step_index = excluded.step_index,
       updated_at = excluded.updated_at
     WHERE excluded.updated_at > cook_progress.updated_at`,
    [recipeId, stepIndex],
  );
}


// Clears the cook progress for a given recipe. This is useful when the recipe steps have changed.
export async function clearCookProgress(recipeId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM cook_progress WHERE recipe_id = ?', [recipeId]);
}
