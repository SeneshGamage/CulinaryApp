#!/usr/bin/env bash
# ChefGuru — Day 3 commit script (Phase C: Get More Recipes)
# Run from the root of your chefguru-app repo, on the `dev` branch,
# AFTER copying in the Day 3 files.
#
# Note: this assumes a `recipes` table (with a `status` column, 'approved'
# for public catalog entries), plus `ingredients` and `steps` tables, exist
# in your Supabase project — mirroring the local SQLite schema from Day 1.
# Create those tables in the Supabase dashboard before testing this feature.

set -e

echo "== ChefGuru Day 3 commit script =="

current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "dev" ]; then
  echo "Switching to dev branch..."
  git checkout dev
fi

if [ -f .env ]; then
  if ! git check-ignore -q .env; then
    echo ""
    echo "!! .env exists and is NOT gitignored. Add it to .gitignore before continuing."
    echo "!! Aborting — nothing was committed."
    exit 1
  fi
fi

# 1. Shared recipe repository (refactor)
git add src/db/recipeRepository.ts
git commit -m "feat: add shared recipe repository for local DB inserts/queries"

# 2. Seed import now uses the shared repository
git add src/db/seed.ts
git commit -m "refactor: use shared recipe repository in seed import"

# 3. Catalog service
git add src/services/catalogService.ts
git commit -m "feat: add catalog service to browse and fetch downloadable recipes"

# 4. Download screen
git add src/screens/DownloadRecipesScreen.tsx
git commit -m "feat: add Get More Recipes screen with offline gating and download states"

# 5. Navigation wiring
git add src/navigation/RootNavigator.tsx
git commit -m "feat: wire DownloadRecipes screen into navigation"

# 6. Home screen entry point
git add src/screens/HomeScreen.tsx
git commit -m "feat: add Get More Recipes entry point on home screen"

echo ""
echo "== Commits created: =="
git log --oneline -6

echo ""
echo "Pushing to origin/dev..."
git push origin dev

echo ""
echo "Day 3 done and pushed to dev."
