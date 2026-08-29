export const colors = {
  primary: '#1A1A2E',
  primaryLight: '#2D2D44',
  accent: '#E94560',
  accentHover: '#D63851',
  bg: '#F8F9FA',
  card: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  inputBg: '#F9FAFB',
  hover: '#F3F4F6',
  white: '#FFFFFF',
  red: '#EF4444',
  redLight: '#FEF2F2',
  redDark: '#B91C1C',
  green: '#10B981',
  greenLight: '#D1FAE5',
  greenDark: '#065F46',
  yellow: '#F59E0B',
  yellowLight: '#FEF3C7',
  yellowDark: '#92400E',
  blue: '#3B82F6',
  blueLight: '#DBEAFE',
  blueDark: '#1E40AF',
  purple: '#8B5CF6',
  purpleLight: '#EDE9FE',
  purpleDark: '#5B21B6',
  orange: '#F97316',
  orangeLight: '#FFEDD5',
  orangeDark: '#9A3412',
} as const;

export const radii = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  full: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  page: 32,
} as const;

export const shadow = {
  none: 'none',
  card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  cardHover: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
  elevated: '0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.04)',
  focus: '0 0 0 3px rgba(233,69,96,0.15)',
  focusStrong: '0 0 0 3px rgba(233,69,96,0.25)',
  sidebar: '2px 0 8px rgba(0,0,0,0.06)',
} as const;

export const fontSize = {
  xs: 11,
  sm: 12,
  base: 13,
  md: 14,
  lg: 15,
  xl: 16,
  xxl: 18,
  heading: 22,
  hero: 28,
} as const;

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

export const transition = {
  fast: '150ms ease',
  base: '200ms ease',
  slow: '300ms ease',
} as const;

export type OrderStatus = 'unpaid' | 'processing' | 'shipped' | 'delivered';

export function badgeColor(status: OrderStatus): { bg: string; color: string } {
  switch (status) {
    case 'unpaid':
      return { bg: colors.yellowLight, color: colors.yellowDark };
    case 'processing':
      return { bg: colors.blueLight, color: colors.blueDark };
    case 'shipped':
      return { bg: colors.greenLight, color: colors.greenDark };
    case 'delivered':
      return { bg: colors.purpleLight, color: colors.purpleDark };
    default:
      return { bg: colors.hover, color: colors.textSecondary };
  }
}

export const badgeBase: React.CSSProperties = {
  padding: '3px 10px',
  borderRadius: radii.sm,
  fontSize: fontSize.sm,
  fontWeight: fontWeight.semibold,
  textTransform: 'capitalize',
  display: 'inline-block',
  lineHeight: '1.4',
  whiteSpace: 'nowrap',
};

export const cardBase: React.CSSProperties = {
  backgroundColor: colors.card,
  borderRadius: radii.xl,
  boxShadow: shadow.card,
  transition: `box-shadow ${transition.base}, transform ${transition.base}`,
};

export const cardHover: React.CSSProperties = {
  boxShadow: shadow.cardHover,
  transform: 'translateY(-1px)',
};

export const inputBase: React.CSSProperties = {
  width: '100%',
  height: 44,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.lg,
  padding: '0 14px',
  fontSize: fontSize.md,
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: colors.inputBg,
  color: colors.text,
  transition: `border-color ${transition.fast}, box-shadow ${transition.fast}, background-color ${transition.fast}`,
};

export const inputFocus: React.CSSProperties = {
  borderColor: colors.accent,
  boxShadow: shadow.focus,
  backgroundColor: colors.white,
};

export const textareaBase: React.CSSProperties = {
  width: '100%',
  border: `1px solid ${colors.border}`,
  borderRadius: radii.lg,
  padding: '10px 14px',
  fontSize: fontSize.md,
  outline: 'none',
  resize: 'vertical' as const,
  boxSizing: 'border-box' as const,
  backgroundColor: colors.inputBg,
  color: colors.text,
  transition: `border-color ${transition.fast}, box-shadow ${transition.fast}`,
};

export const btnPrimary: React.CSSProperties = {
  padding: '10px 24px',
  borderRadius: radii.lg,
  border: 'none',
  backgroundColor: colors.accent,
  color: colors.white,
  fontSize: fontSize.md,
  fontWeight: fontWeight.bold,
  cursor: 'pointer',
  transition: `background-color ${transition.fast}, transform ${transition.fast}, box-shadow ${transition.fast}`,
};

export const btnPrimaryHover: React.CSSProperties = {
  backgroundColor: colors.accentHover,
  boxShadow: shadow.cardHover,
};

export const btnSecondary: React.CSSProperties = {
  padding: '10px 24px',
  borderRadius: radii.lg,
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.white,
  color: colors.text,
  fontSize: fontSize.md,
  fontWeight: fontWeight.semibold,
  cursor: 'pointer',
  transition: `background-color ${transition.fast}, border-color ${transition.fast}`,
};

export const labelBase: React.CSSProperties = {
  display: 'block',
  fontSize: fontSize.base,
  fontWeight: fontWeight.semibold,
  color: colors.textSecondary,
  marginBottom: spacing.sm,
  lineHeight: 1.4,
};
