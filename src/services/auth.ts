import * as SecureStore from 'expo-secure-store';
import { supabase } from './supabase';

const SESSION_CACHE_KEY = 'chefguru_session_cache';

export interface CachedUser {
  id: string;
  email: string;
  role: 'user' | 'chef' | 'admin';
}

/**
 * Writes a lightweight, non-sensitive profile snapshot to SecureStore so the
 * app can identify "who's logged in" on a fully offline launch, without
 * needing to hit Supabase. The real session/token itself is already
 * persisted by the Supabase client via AsyncStorage (see supabase.ts).
 */
async function cacheUserProfile(user: CachedUser): Promise<void> {
  await SecureStore.setItemAsync(SESSION_CACHE_KEY, JSON.stringify(user));
}

export async function getCachedUser(): Promise<CachedUser | null> {
  const raw = await SecureStore.getItemAsync(SESSION_CACHE_KEY);
  return raw ? (JSON.parse(raw) as CachedUser) : null;
}

export async function clearCachedUser(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_CACHE_KEY);
}

export async function signUp(email: string, password: string): Promise<CachedUser> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('Sign up succeeded but no user was returned.');

  const user: CachedUser = { id: data.user.id, email: data.user.email ?? email, role: 'user' };
  await cacheUserProfile(user);
  return user;
}

export async function signIn(email: string, password: string): Promise<CachedUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('Sign in succeeded but no user was returned.');

  const user: CachedUser = { id: data.user.id, email: data.user.email ?? email, role: 'user' };
  await cacheUserProfile(user);
  return user;
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut().catch(() => {
    // If this fails because we're offline, that's fine — clear the local
    // cache anyway so the UI reflects "logged out" immediately.
  });
  await clearCachedUser();
}

/**
 * Call this on app startup. Returns a cached user immediately if one
 * exists (works fully offline), and does NOT block on a network call.
 */
export async function restoreSession(): Promise<CachedUser | null> {
  return getCachedUser();
}
