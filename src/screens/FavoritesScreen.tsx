import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../components/RecipeCard';
import { colors, spacing } from '../theme/colors';

const FAVORITES = [
  { title: 'Sourdough Loaf', subtitle: 'Saved 3d ago' },
  { title: 'Thai Green Curry', subtitle: 'Saved 1w ago' },
];

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.title}>Favorites</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <View style={styles.row}>
          {FAVORITES.map((r) => (
            <RecipeCard key={r.title} title={r.title} subtitle={r.subtitle} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  topbar: { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line },
  title: { fontSize: 17, fontWeight: '700', color: colors.ink },
  row: { flexDirection: 'row', gap: spacing.sm },
});
