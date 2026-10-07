export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  cook_time_minutes INTEGER,
  difficulty TEXT,
  servings INTEGER,
  cover_image_key TEXT,
  source TEXT DEFAULT 'seed',       -- 'seed' | 'downloaded' | 'chef_upload'
  created_at INTEGER DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS ingredients (
  id TEXT PRIMARY KEY NOT NULL,
  recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS steps (
  id TEXT PRIMARY KEY NOT NULL,
  recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  timer_seconds INTEGER
);

CREATE TABLE IF NOT EXISTS favorites (
  recipe_id TEXT PRIMARY KEY NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  saved_at INTEGER DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS app_meta (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT
);
`;
