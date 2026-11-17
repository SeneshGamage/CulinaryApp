import { getMeta, setMeta } from './database';
import { insertRecipeLocally, FullRecipe } from './recipeRepository';
import seedRecipes from '../../assets/seed-data/recipes.json';

const SEED_VERSION = '1'; // bump this if you ship new seed data in an update
const SEED_META_KEY = 'seed_version';

export async function runSeedImportIfNeeded(): Promise<void> {
  const currentVersion = await getMeta(SEED_META_KEY);
  if (currentVersion === SEED_VERSION) return; // already seeded at this version

  const recipes = seedRecipes as FullRecipe[];
  for (const recipe of recipes) {
    await insertRecipeLocally(recipe, 'seed');
  }

  await setMeta(SEED_META_KEY, SEED_VERSION);
}
