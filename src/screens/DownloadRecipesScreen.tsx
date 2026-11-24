import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../theme/colors';
import { useIsOnline } from '../hooks/useIsOnline';
import { fetchCatalog, fetchFullRecipe, CatalogEntry } from '../services/catalogService';
import {
  getLocalRecipeIds,
  insertRecipeLocally,
  removeDownloadedRecipe,
} from '../db/recipeRepository';

type DownloadState = 'idle' | 'downloading' | 'downloaded' | 'failed';

export default function DownloadRecipesScreen() {
  const isOnline = useIsOnline();
  const [catalog, setCatalog] = useState<CatalogEntry[]>([]);
  const [downloadStates, setDownloadStates] = useState<Record<string, DownloadState>>({});
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [catalogError, setCatalogError] = useState('');

  const loadCatalog = useCallback(async () => {
    if (!isOnline) return;
    setLoadingCatalog(true);
    setCatalogError('');
    try {
      const [entries, localIds] = await Promise.all([fetchCatalog(), getLocalRecipeIds()]);
      setCatalog(entries);
      const initialStates: Record<string, DownloadState> = {};
      entries.forEach((e) => {
        initialStates[e.id] = localIds.has(e.id) ? 'downloaded' : 'idle';
      });
      setDownloadStates(initialStates);
    } catch (e: any) {
      setCatalogError(e.message ?? 'Could not load the recipe catalog.');
    } finally {
      setLoadingCatalog(false);
    }
  }, [isOnline]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const handleDownload = async (entry: CatalogEntry) => {
    setDownloadStates((prev) => ({ ...prev, [entry.id]: 'downloading' }));
    try {
      const fullRecipe = await fetchFullRecipe(entry.id);
      await insertRecipeLocally(fullRecipe, 'downloaded');
      setDownloadStates((prev) => ({ ...prev, [entry.id]: 'downloaded' }));
    } catch {
      setDownloadStates((prev) => ({ ...prev, [entry.id]: 'failed' }));
    }
  };

  const handleRemove = async (entry: CatalogEntry) => {
    await removeDownloadedRecipe(entry.id);
    setDownloadStates((prev) => ({ ...prev, [entry.id]: 'idle' }));
  };

  if (!isOnline) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredNotice}>
          <View style={styles.hero} />
          <Text style={styles.offlineTitle}>You're offline</Text>
          <Text style={styles.offlineText}>
            Connect to the internet to browse and download more recipes.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.title}>Get More Recipes</Text>
      </View>

      {loadingCatalog && (
        <ActivityIndicator color={colors.orange} style={{ marginTop: spacing.lg }} />
      )}
      {catalogError ? <Text style={styles.error}>{catalogError}</Text> : null}

      <FlatList
        data={catalog}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item }) => {
          const state = downloadStates[item.id] ?? 'idle';
          return (
            <View style={styles.row}>
              <View style={styles.thumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.recipeTitle}>{item.title}</Text>
                <Text style={styles.recipeMeta}>
                  {item.cookTimeMinutes} min · {item.difficulty}
                </Text>
              </View>
              {state === 'idle' && (
                <Pressable style={styles.actionBtn} onPress={() => handleDownload(item)}>
                  <Text style={styles.actionBtnText}>Download</Text>
                </Pressable>
              )}
              {state === 'downloading' && <ActivityIndicator color={colors.orange} />}
              {state === 'downloaded' && (
                <Pressable style={styles.removeBtn} onPress={() => handleRemove(item)}>
                  <Text style={styles.removeBtnText}>Remove</Text>
                </Pressable>
              )}
              {state === 'failed' && (
                <Pressable style={styles.actionBtn} onPress={() => handleDownload(item)}>
                  <Text style={styles.actionBtnText}>Retry</Text>
                </Pressable>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  topbar: { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line },
  title: { fontSize: 17, fontWeight: '700', color: colors.ink },
  error: { fontSize: 12, color: colors.danger, textAlign: 'center', marginTop: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  thumb: { width: 46, height: 46, borderRadius: radius.sm, backgroundColor: '#FFE3CC' },
  recipeTitle: { fontSize: 13, fontWeight: '600', color: colors.ink },
  recipeMeta: { fontSize: 11, color: colors.inkSoft },
  actionBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    backgroundColor: colors.orange,
  },
  actionBtnText: { color: colors.white, fontSize: 11, fontWeight: '600' },
  removeBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.line,
  },
  removeBtnText: { color: colors.inkSoft, fontSize: 11, fontWeight: '600' },
  centeredNotice: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  hero: {
    width: '100%',
    height: 120,
    borderRadius: radius.md,
    backgroundColor: colors.orange,
    marginBottom: spacing.md,
  },
  offlineTitle: { fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: spacing.sm },
  offlineText: { fontSize: 12, color: colors.inkSoft, textAlign: 'center' },
});
