import React from 'react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export default function StatsCard({ title, value, subtitle, color = '#6C3BC6' }: Props) {
  return (
    <div style={styles.card}>
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
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    flex: 1,
    minWidth: 200,
  },
  accent: { height: 4 },
  body: { padding: '16px 20px' },
  title: { fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 28, fontWeight: 800, color: '#111', marginTop: 4 },
  subtitle: { fontSize: 12, color: '#aaa', marginTop: 4 },
};
