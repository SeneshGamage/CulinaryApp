import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, radius } from '../theme/colors';

const INGREDIENTS = [
  { name: 'Salmon fillet', amount: '2 pcs' },
  { name: 'White miso paste', amount: '2 tbsp' },
  { name: 'Mirin', amount: '1 tbsp' },
];

export default function RecipeDetailScreen({ route, navigation }: any) {
  const title = route?.params?.title ?? 'Miso Glazed Salmon';
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <View style={styles.hero} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>25 min · Easy · 2 servings</Text>
        <Text style={styles.sectionLabel}>Ingredients</Text>
        {INGREDIENTS.map((i) => (
          <View key={i.name} style={styles.ingredientRow}>
            <Text style={styles.ingredientName}>{i.name}</Text>
            <Text style={styles.ingredientAmount}>{i.amount}</Text>
          </View>
        ))}
        <PrimaryButton label="Start Cooking" onPress={() => navigation.navigate('CookMode')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  hero: { height: 150, borderRadius: radius.md, backgroundColor: colors.orange, marginBottom: spacing.md },
  title: { fontSize: 19, fontWeight: '700', color: colors.ink, marginBottom: 4 },
  meta: { fontSize: 12, color: colors.inkSoft, marginBottom: spacing.md },
  sectionLabel: {
    fontSize: 11, fontWeight: '600', color: colors.inkSoft,
    textTransform: 'uppercase', marginBottom: spacing.sm,
  },
  ingredientRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  ingredientName: { fontSize: 13, color: colors.ink },
  ingredientAmount: { fontSize: 13, color: colors.inkSoft },
});
