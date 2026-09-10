import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'ghost';
  style?: ViewStyle;
}

export default function PrimaryButton({ label, onPress, variant = 'primary', style }: Props) {
  const isGhost = variant === 'ghost';
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        isGhost ? styles.ghost : styles.primary,
        style,
      ]}
    >
      <Text style={isGhost ? styles.ghostText : styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  primary: {
    backgroundColor: colors.orange,
  },
  primaryText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.line,
  },
  ghostText: {
    color: colors.orangeDeep,
    fontWeight: '600',
    fontSize: 15,
  },
});
