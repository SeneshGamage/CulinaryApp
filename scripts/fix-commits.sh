#!/usr/bin/env bash
# ChefGuru — fix commits (dependency alignment, CI, regressions)
set -e

git config user.email "140165794+SeneshGamage@users.noreply.github.com"

if [ "$(git rev-parse --abbrev-ref HEAD)" != "dev" ]; then
  git checkout dev
fi

if [ -f .env ] && ! git check-ignore -q .env; then
  echo "!! .env exists and is NOT gitignored. Aborting."
  exit 1
fi

# Same gates CI runs. Prettier goes first so copy-paste whitespace can't fail the check.
npm run format
npm ci
npm run typecheck
npm run format:check

git add package.json package-lock.json
git commit -m "fix: align dependencies with Expo SDK 58" \
  -m "react-native 0.72.5 requires React 18, which broke npm ci in CI."

git add eas.json
git commit -m "chore: add EAS build profiles"

git add .gitignore .gitattributes .prettierignore
git commit -m "chore: ignore real .env files and enforce LF line endings"

git add App.tsx
git commit -m "fix: restore cached session on app launch"

git add src/screens/RecipeDetailScreen.tsx
git commit -m "fix: load recipe detail and favorite toggle from local DB"

git add src/screens/CookModeScreen.tsx
git commit -m "fix: cook mode reads steps from DB and saves progress"

git add src/screens/FavoritesScreen.tsx
git commit -m "fix: favorites screen reads saved recipes from local DB"

git add src/db/recipeRepository.ts
git commit -m "fix: keep null timers and stop dropping quick cook progress saves"

git add src/db/database.ts
git commit -m "fix: enforce SQLite foreign keys"

git add src/screens/LoginScreen.tsx src/screens/SignupScreen.tsx
git commit -m "fix: remove navigation call with no target after login and signup"

git add src/screens/ProfileScreen.tsx
git commit -m "fix: wire up log out"

git add src/screens/DownloadRecipesScreen.tsx
git commit -m "fix: handle errors when removing a downloaded recipe"

git add src/services/auth.ts src/services/supabase.ts
git commit -m "fix: require a session on signup and survive missing env vars"

git add src/screens/HomeScreen.tsx
git commit -m "refactor: remove dead code from home screen"

echo ""
git log --oneline -14
git push origin dev
echo "Pushed. Check the Actions tab and PR #16."