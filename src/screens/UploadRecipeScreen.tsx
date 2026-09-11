import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, radius } from '../theme/colors';

export default function UploadRecipeScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const submit = () => {
    // TODO: POST to /recipes (status: pending) on the backend
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.coverPlaceholder}>
        <Text style={styles.coverText}>Upload cover photo</Text>
      </View>

      <Text style={styles.label}>Recipe name</Text>
      <TextInput style={styles.field} value={name} onChangeText={setName} placeholder="e.g. Ceylon Fish Curry" />

      <Text style={styles.label}>Cook time</Text>
      <TextInput style={styles.field} value={cookTime} onChangeText={setCookTime} placeholder="30 min" />

      <Text style={styles.label}>Difficulty</Text>
      <TextInput style={styles.field} value={difficulty} onChangeText={setDifficulty} placeholder="Intermediate" />

      <PrimaryButton label="Save & Submit for Review" onPress={submit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, padding: spacing.md },
  coverPlaceholder: {
    height: 100, borderRadius: radius.md, backgroundColor: colors.orange,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  coverText: { color: colors.white, fontSize: 12 },
  label: { fontSize: 11, fontWeight: '600', color: colors.ink, marginBottom: 5 },
  field: {
    height: 44, borderRadius: radius.sm, backgroundColor: colors.cream,
    borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.md,
    marginBottom: spacing.sm, color: colors.ink,
  },
});
