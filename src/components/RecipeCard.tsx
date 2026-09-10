import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

interface Props {
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export default function RecipeCard({ title, subtitle, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.thumb} />
      <View style={styles.meta}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  thumb: {
    height: 70,
    backgroundColor: '#FFE3CC',
  },
  meta: {
    padding: spacing.sm,
  },
  title: {
    fontWeight: '600',
    fontSize: 13,
    color: colors.ink,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: colors.inkSoft,
  },
});
