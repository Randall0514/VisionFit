import React from 'react';
import { colors, radii, fontSize, fontWeight, shadow, transition } from '../theme';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export default function StatsCard({ title, value, subtitle, color = colors.accent }: Props) {
  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = shadow.cardHover;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = shadow.card;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ ...styles.accent, backgroundColor: color }} />
      <div style={styles.body}>
        <div style={styles.title}>{title}</div>
        <div style={styles.value}>{value}</div>
        {subtitle && <div style={styles.subtitle}>{subtitle}</div>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    overflow: 'hidden',
    boxShadow: shadow.card,
    flex: 1,
    minWidth: 200,
    transition: `box-shadow ${transition.base}, transform ${transition.base}`,
  },
  accent: { height: 4 },
  body: { padding: '18px 22px' },
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 26,
    fontWeight: fontWeight.extrabold,
    color: colors.text,
    marginTop: 6,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 4,
  },
};
