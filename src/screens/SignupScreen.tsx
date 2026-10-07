import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, radius } from '../theme/colors';
import { signUp } from '../services/auth';
import { useAppStore } from '../store/useAppStore';
import { useIsOnline } from '../hooks/useIsOnline';

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isOnline = useIsOnline();
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);
  const setRole = useAppStore((s) => s.setRole);

  const handleSignup = async () => {
    if (!isOnline) {
      setError('Creating an account needs an internet connection.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const user = await signUp(email, password);
      setRole(user.role);
      setAuthenticated(true);
      navigation.replace('MainTabs');
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong creating your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create your account</Text>
      {!isOnline && (
        <Text style={styles.offlineNotice}>You're offline — connect to sign up.</Text>
      )}
      <TextInput
        style={styles.field}
        placeholder="Email"
        placeholderTextColor={colors.inkSoft}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.field}
        placeholder="Password"
        placeholderTextColor={colors.inkSoft}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator color={colors.orange} style={{ marginTop: spacing.md }} />
      ) : (
        <PrimaryButton label="Sign Up" onPress={handleSignup} />
      )}
      <PrimaryButton
        label="Already have an account? Log in"
        variant="ghost"
        onPress={() => navigation.navigate('Login')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, padding: spacing.lg, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: colors.ink, marginBottom: spacing.lg, textAlign: 'center' },
  offlineNotice: {
    fontSize: 12, color: colors.pending, textAlign: 'center', marginBottom: spacing.md,
  },
  field: {
    height: 46, borderRadius: radius.md, backgroundColor: colors.cream,
    borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.md,
    marginBottom: spacing.sm, color: colors.ink,
  },
  error: { fontSize: 12, color: colors.danger, marginBottom: spacing.sm, textAlign: 'center' },
});
