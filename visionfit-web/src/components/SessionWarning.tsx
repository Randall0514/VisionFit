import React, { useEffect, useState } from 'react';
import { colors, radii, fontSize, fontWeight, transition } from '../theme';

interface SessionWarningProps {
  isOpen: boolean;
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

export default function SessionWarning({ isOpen, onStayLoggedIn, onLogout }: SessionWarningProps) {
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    if (isOpen) {
      setCountdown(120);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onLogout]);

  if (!isOpen) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.icon}>⚠</div>
        <h3 style={styles.title}>Session Expiring Soon</h3>
        <p style={styles.message}>
          You will be logged out in <strong>{timeString}</strong> due to inactivity.
        </p>
        <div style={styles.actions}>
          <button style={styles.stayButton} onClick={onStayLoggedIn}>
            Stay Logged In
          </button>
          <button style={styles.logoutButton} onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: '32px 40px',
    maxWidth: 420,
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
  },
  icon: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: 8,
  },
  message: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 1.6,
    marginBottom: 24,
  },
  actions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
  },
  stayButton: {
    padding: '10px 24px',
    borderRadius: radii.lg,
    border: 'none',
    backgroundColor: colors.accent,
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    cursor: 'pointer',
    transition: `background-color ${transition.fast}`,
  },
  logoutButton: {
    padding: '10px 24px',
    borderRadius: radii.lg,
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.white,
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    cursor: 'pointer',
    transition: `background-color ${transition.fast}`,
  },
};
