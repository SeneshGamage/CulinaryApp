import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/colors';
import { useAppStore } from '../store/useAppStore';

function SettingsRow({ label, value, onPress, highlight }: any) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={[styles.rowLabel, highlight && { color: colors.orangeDeep, fontWeight: '600' }]}>
        {label}
      </Text>
      <Text style={styles.rowValue}>{value ?? '›'}</Text>
    </Pressable>
  );
}

export default function ProfileScreen({ navigation }: any) {
  const role = useAppStore((s) => s.role);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.avatar} />
      <Text style={styles.name}>Dona</Text>
      <Text style={styles.sub}>Home cook · Intermediate</Text>

      <SettingsRow label="Dietary preferences" value="Vegetarian ›" />
      <SettingsRow label="Skill level" value="Intermediate ›" />

      {role === 'user' && (
        <SettingsRow
          label="Become a Chef"
          highlight
          onPress={() => navigation.navigate('BecomeChef')}
        />
      )}
      {role === 'chef' && (
        <SettingsRow
          label="My Kitchen (Chef Dashboard)"
          highlight
          onPress={() => navigation.navigate('ChefDashboard')}
        />
      )}

      <SettingsRow label="Cook reminders" value="On ›" />
      <SettingsRow label="Log out" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, padding: spacing.md },
  avatar: {
    width: 74, height: 74, borderRadius: 37, backgroundColor: colors.orange,
    alignSelf: 'center', marginBottom: spacing.sm,
  },
  name: { fontSize: 17, fontWeight: '700', textAlign: 'center', color: colors.ink },
  sub: { fontSize: 12, color: colors.inkSoft, textAlign: 'center', marginBottom: spacing.lg },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.sm + 4, borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  rowLabel: { fontSize: 13, color: colors.ink },
  rowValue: { fontSize: 13, color: colors.inkSoft },
});
