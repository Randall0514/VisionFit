import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors, radii, fontSize, fontWeight, transition, shadow } from '../theme';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <div style={styles.logoLarge}>VISIONFIT</div>
          <div style={styles.tagline}>Admin Dashboard</div>
          <div style={styles.leftDivider} />
          <p style={styles.leftDesc}>
            Manage your products, orders, and inventory from one place.
          </p>
        </div>
        <div style={styles.leftFooter}>
          <span style={styles.leftFooterText}>Powered by VisionFit</span>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formWrapper}>
          <div style={styles.mobileLogo}>VISIONFIT</div>
          <h2 style={styles.heading}>Welcome back</h2>
          <p style={styles.subheading}>Sign in to your admin account</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                placeholder="admin@visionfit.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: colors.bg,
  },
  leftPanel: {
    width: '42%',
    minWidth: 400,
    background: `linear-gradient(160deg, ${colors.primary} 0%, #16213E 100%)`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
    position: 'relative',
    overflow: 'hidden',
  },
  leftContent: {
    textAlign: 'center',
    zIndex: 1,
  },
  logoLarge: {
    fontSize: 36,
    fontWeight: fontWeight.black,
    color: colors.white,
    letterSpacing: -1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: fontSize.lg,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: fontWeight.medium,
    marginBottom: 32,
  },
  leftDivider: {
    width: 40,
    height: 3,
    backgroundColor: colors.accent,
    borderRadius: 2,
    margin: '0 auto 32px',
  },
  leftDesc: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.7,
    maxWidth: 280,
    margin: '0 auto',
  },
  leftFooter: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  leftFooterText: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.3)',
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  mobileLogo: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.black,
    color: colors.primary,
    letterSpacing: -0.5,
    marginBottom: 32,
  },
  heading: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    color: colors.text,
    marginBottom: 6,
  },
  subheading: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginBottom: 32,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  input: {
    height: 48,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.lg,
    padding: '0 16px',
    fontSize: fontSize.md,
    outline: 'none',
    boxSizing: 'border-box' as const,
    backgroundColor: colors.white,
    color: colors.text,
  },
  button: {
    height: 48,
    borderRadius: radii.lg,
    border: 'none',
    backgroundColor: colors.accent,
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    cursor: 'pointer',
    marginTop: 8,
    transition: `background-color ${transition.fast}, transform ${transition.fast}, box-shadow ${transition.fast}`,
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  error: {
    backgroundColor: colors.redLight,
    color: colors.redDark,
    padding: '12px 16px',
    borderRadius: radii.md,
    fontSize: fontSize.base,
    lineHeight: 1.4,
  },
};
