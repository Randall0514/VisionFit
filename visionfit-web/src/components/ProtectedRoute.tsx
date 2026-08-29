import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors, fontSize, fontWeight } from '../theme';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.spinner} />
        <div style={styles.text}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    gap: 16,
  },
  spinner: {
    width: 32,
    height: 32,
    border: `3px solid ${colors.border}`,
    borderTopColor: colors.accent,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  text: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
  },
};
