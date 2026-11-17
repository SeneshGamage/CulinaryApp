#!/usr/bin/env bash
# ChefGuru — Day 1 commit script (Phase A: offline DB foundation)
# Run this from the root of your chefguru-app repo, on the `dev` branch,
# AFTER copying in the Day 1 files (src/db/*, assets/seed-data/recipes.json, App.tsx)
# and running: npx expo install expo-sqlite

set -e  # stop immediately if any command fails

echo "== ChefGuru Day 1 commit script =="

# Make sure we're on dev
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "dev" ]; then
  echo "Switching to dev branch..."
  git checkout dev
fi

# 1. Dependency install
git add package.json package-lock.json
git commit -m "chore: install expo-sqlite for offline recipe storage"

# 2. Schema + DB init
git add src/db/schema.ts src/db/database.ts
git commit -m "feat: add local SQLite schema and database init helper"

# 3. Seed data
git add assets/seed-data/recipes.json
git commit -m "feat: add bundled starter recipe seed data"

# 4. Seed import logic
git add src/db/seed.ts
git commit -m "feat: add first-launch seed import logic"

# 5. Wire into App.tsx
git add App.tsx
git commit -m "feat: run seed import on app startup with loading state"

echo ""
echo "== Commits created: =="
git log --oneline -5

echo ""
echo "Pushing to origin/dev..."
git push origin dev

echo ""
echo "Day 1 done and pushed to dev."
