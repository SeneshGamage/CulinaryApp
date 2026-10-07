#!/usr/bin/env bash
# ChefGuru — Day 2 commit script (Phase B: auth with offline session caching)
# Run from the root of your chefguru-app repo, on the `dev` branch,
# AFTER copying in the Day 2 files and running:
#   npx expo install @react-native-async-storage/async-storage expo-secure-store @react-native-community/netinfo
#   npm install @supabase/supabase-js react-native-url-polyfill
# and setting EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env

set -e

echo "== ChefGuru Day 2 commit script =="

current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "dev" ]; then
  echo "Switching to dev branch..."
  git checkout dev
fi

# Safety check: make sure .env is actually gitignored before we stage anything.
# This stops you from ever accidentally committing real Supabase keys.
if [ -f .env ]; then
  if ! git check-ignore -q .env; then
    echo ""
    echo "!! .env exists and is NOT gitignored. Add it to .gitignore before continuing."
    echo "!! Aborting — nothing was committed."
    exit 1
  fi
fi

# 1. Dependency install
git add package.json package-lock.json
git commit -m "chore: install auth, secure storage, and connectivity packages"

# 2. Env template (never the real .env — just the example)
git add .env.example
git commit -m "docs: add .env.example for Supabase and AI provider config"

# 3. Supabase client
git add src/services/supabase.ts
git commit -m "feat: add Supabase client with persisted session storage"

# 4. Auth service with offline caching
git add src/services/auth.ts
git commit -m "feat: add auth service with offline-aware session caching"

# 5. Online/offline hook
git add src/hooks/useIsOnline.ts
git commit -m "feat: add useIsOnline connectivity hook"

# 6. Login + Signup screens
git add src/screens/LoginScreen.tsx src/screens/SignupScreen.tsx
git commit -m "feat: add login and signup screens with offline-aware error states"

# 7. Navigation + onboarding wiring
git add src/navigation/RootNavigator.tsx src/screens/OnboardingScreen.tsx
git commit -m "feat: gate navigation on auth state, wire onboarding to real login/signup"

# 8. Session restore on launch
git add App.tsx src/store/useAppStore.ts
git commit -m "feat: restore cached session on app launch for offline login persistence"

echo ""
echo "== Commits created: =="
git log --oneline -8

echo ""
echo "Pushing to origin/dev..."
git push origin dev

echo ""
echo "Day 2 done and pushed to dev."