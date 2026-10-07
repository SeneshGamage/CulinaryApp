import { getDb, getMeta, setMeta } from './database';
import seedRecipes from '../../assets/seed-data/recipes.json';

const SEED_VERSION = '1'; // bump this if you ship new seed data in an update
const SEED_META_KEY = 'seed_version';

interface SeedRecipe {
  id: string;
  title: string;
  cookTimeMinutes: number;
  difficulty: string;
  servings: number;
  ingredients: { name: string; amount: string }[];
  steps: { instruction: string; timerSeconds: number | null }[];
}

export async function runSeedImportIfNeeded(): Promise<void> {
  const currentVersion = await getMeta(SEED_META_KEY);
  if (currentVersion === SEED_VERSION) return; // already seeded at this version

  const db = await getDb();
  const recipes = seedRecipes as SeedRecipe[];

  await db.withTransactionAsync(async () => {
    for (const recipe of recipes) {
      await db.runAsync(
        `INSERT OR REPLACE INTO recipes (id, title, cook_time_minutes, difficulty, servings, source)
         VALUES (?, ?, ?, ?, ?, 'seed')`,
        [recipe.id, recipe.title, recipe.cookTimeMinutes, recipe.difficulty, recipe.servings],
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
    }
  });

  await setMeta(SEED_META_KEY, SEED_VERSION);
}
