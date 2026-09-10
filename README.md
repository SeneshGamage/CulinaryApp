# ChefGuru

A culinary tutorial app with an AI cooking assistant, built in React Native (Expo).

Three surfaces:
- **User app** — browse recipes, step-by-step Cook Mode, and chat with the ChefGuru AI assistant. Any user can apply to become a Chef.
- **Chef app** — extends the user app with a dashboard to manage and publish recipes (pending admin approval).
- **Admin panel** (separate desktop web app, not in this repo yet) — approve recipes and chef applications, view platform metrics.

## Tech stack
- React Native + Expo (TypeScript)
- React Navigation (native-stack + bottom-tabs)
- Zustand for state management

## Getting started

```bash
npm install
npm run start   # then press i / a / w for iOS, Android, or web
```

## Project structure

```
src/
  components/   Reusable UI components (buttons, cards)
  navigation/   Root stack + tab navigator
  screens/      One file per screen
  store/        Zustand stores
  theme/        Design tokens (colors, spacing, radius, typography)
```

## Design system
Orange & white palette, matching the ChefGuru wireframes:
- `colors.orange` `#FF7A30` — primary actions
- `colors.orangeDeep` `#C1502E` — emphasis/links
- `colors.cream` `#FFF6EE` — surfaces
- `colors.ink` `#2B2420` — primary text

See `src/theme/colors.ts` for the full token set.

## Roadmap
See the project workplan for phased delivery (discovery → design → core features → AI assistant → testing → launch).

## Status
🚧 Early development — screens are wired with placeholder/mock data. Backend integration (auth, recipes API, AI chat endpoint, admin approvals) is in progress.
