export const colors = {
  orange: '#FF7A30',
  orangeDeep: '#C1502E',
  cream: '#FFF6EE',
  white: '#FFFFFF',
  ink: '#2B2420',
  inkSoft: '#6B5F55',
  line: '#EFE2D6',
  success: '#2F8542',
  successBg: '#E4F3E5',
  pending: '#B5710A',
  pendingBg: '#FFF0DB',
  danger: '#C0392B',
  dangerBg: '#FDE7E4',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

export const typography = {
  heading: {
    fontFamily: 'System', // swap for Fraunces once custom fonts are loaded
    fontWeight: '700' as const,
  },
  body: {
    fontFamily: 'System', // swap for Inter once custom fonts are loaded
    fontWeight: '400' as const,
  },
};
