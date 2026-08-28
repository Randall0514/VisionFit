import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/', icon: '📊', label: 'Dashboard' },
  { to: '/products', icon: '👓', label: 'Products' },
  { to: '/orders', icon: '📦', label: 'Orders' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.wrapper}>
      <aside style={{ ...styles.sidebar, width: collapsed ? 64 : 240 }}>
        <div style={styles.logoRow}>
          {!collapsed && <span style={styles.logo}>VISIONFIT</span>}
          <button onClick={() => setCollapsed(!collapsed)} style={styles.collapseBtn}>
            {collapsed ? '>' : '<'}
          </button>
        </div>
        <nav style={styles.nav}>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                ...styles.link,
                backgroundColor: isActive ? '#6C3BC6' : 'transparent',
                color: isActive ? '#fff' : '#555',
                justifyContent: collapsed ? 'center' : 'flex-start',
              })}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div style={styles.bottom}>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            🚪 {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>
      <main style={{ ...styles.main, marginLeft: collapsed ? 64 : 240, transition: 'margin-left 0.2s' }}>
        <header style={styles.header}>
          <div>
            <div style={styles.greeting}>Welcome back, {user?.firstName}</div>
            <div style={styles.email}>{user?.email}</div>
          </div>
        </header>
        <div style={styles.content}>{children}</div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: { display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' },
  sidebar: {
    backgroundColor: '#fff',
    borderRight: '1px solid #e5e5e5',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 10,
    transition: 'width 0.2s',
  },
  logoRow: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e5e5e5',
  },
  logo: { fontSize: 18, fontWeight: 900, letterSpacing: -0.5 },
  collapseBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    color: '#888',
    padding: 4,
  },
  nav: { flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    borderRadius: 8,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 600,
    transition: 'all 0.15s',
  },
  bottom: { padding: '12px 8px', borderTop: '1px solid #e5e5e5' },
  logoutBtn: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #e5e5e5',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    color: '#d33',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  main: { flex: 1, marginLeft: 240 },
  header: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e5e5e5',
    padding: '14px 28px',
    position: 'sticky',
    top: 0,
    zIndex: 5,
  },
  greeting: { fontSize: 16, fontWeight: 700, color: '#111' },
  email: { fontSize: 12, color: '#888', marginTop: 2 },
  content: { padding: 28 },
};
