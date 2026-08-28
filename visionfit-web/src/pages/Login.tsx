import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
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
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>VISIONFIT</h1>
        <p style={styles.subtitle}>Admin Dashboard</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 40, width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center' },
  logo: { fontSize: 28, fontWeight: 900, letterSpacing: -1, margin: 0 },
  subtitle: { color: '#888', fontSize: 14, marginTop: 4, marginBottom: 28 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { height: 48, border: '1px solid #ddd', borderRadius: 10, padding: '0 14px', fontSize: 14, outline: 'none', backgroundColor: '#fafafa' },
  button: { height: 48, borderRadius: 10, border: 'none', backgroundColor: '#6C3BC6', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4 },
  error: { backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 4 },
};
