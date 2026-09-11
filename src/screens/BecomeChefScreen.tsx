import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../store/useAppStore';

export default function BecomeChefScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const setChefApplicationStatus = useAppStore((s) => s.setChefApplicationStatus);

  const submit = () => {
    // TODO: POST to /chef-applications on the backend
    setChefApplicationStatus('pending');
    navigation.navigate('ChefApplicationStatus');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.intro}>
        Tell us about your culinary background — our team reviews every request.
      </Text>

      <Text style={styles.label}>Full name</Text>
      <TextInput style={styles.field} value={name} onChangeText={setName} placeholder="Your name" />

      <Text style={styles.label}>Specialty</Text>
      <TextInput
        style={styles.field}
        value={specialty}
        onChangeText={setSpecialty}
        placeholder="e.g. Pastry, Sri Lankan cuisine"
      />

      <PrimaryButton label="Submit Application" onPress={submit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, padding: spacing.md },
  intro: { fontSize: 12, color: colors.inkSoft, marginBottom: spacing.md },
  label: { fontSize: 11, fontWeight: '600', color: colors.ink, marginBottom: 5 },
  field: {
    height: 44, borderRadius: radius.sm, backgroundColor: colors.cream,
    borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.md,
    marginBottom: spacing.sm, color: colors.ink,
  },
});
