import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors, radii, fontSize, fontWeight, transition, shadow } from '../theme';
import api from '../api';

const nav = [
  { to: '/', icon: '📊', label: 'Dashboard' },
  { to: '/products', icon: '👓', label: 'Products' },
  { to: '/inventory', icon: '📦', label: 'Inventory' },
  { to: '/orders', icon: '🛒', label: 'Orders' },
  { to: '/notifications', icon: '🔔', label: 'Notifications' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api.getNotifications().then((n: any[]) => {
      setUnreadCount(n.filter((item: any) => !item.read).length);
    }).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarWidth = collapsed ? 68 : 240;

  return (
    <div style={styles.wrapper}>
      <aside style={{ ...styles.sidebar, width: sidebarWidth }}>
        <div style={styles.logoRow}>
          {!collapsed && <span style={styles.logo}>VISIONFIT</span>}
          <button onClick={() => setCollapsed(!collapsed)} style={styles.collapseBtn}>
            {collapsed ? '›' : '‹'}
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
                backgroundColor: isActive ? colors.accent : 'transparent',
                color: isActive ? colors.white : 'rgba(255,255,255,0.65)',
                justifyContent: collapsed ? 'center' : 'flex-start',
              })}
            >
              <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div style={styles.bottom}>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <span style={{ fontSize: 16 }}>⏻</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
      <main style={{ ...styles.main, marginLeft: sidebarWidth }}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.greeting}>Welcome back, {user?.firstName}</div>
            <div style={styles.email}>{user?.email}</div>
          </div>
          <div style={styles.headerRight}>
            <NavLink to="/notifications" style={styles.bellBtn}>
              🔔
              {unreadCount > 0 && <span style={styles.bellBadge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </NavLink>
            <div style={styles.avatar}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </div>
        </header>
        <div style={styles.content}>{children}</div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: colors.bg,
  },
  sidebar: {
    backgroundColor: colors.primary,
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 10,
    transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: shadow.sidebar,
  },
  logoRow: {
    padding: '20px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  logo: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.black,
    color: colors.white,
    letterSpacing: -0.5,
  },
  collapseBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 22,
    color: 'rgba(255,255,255,0.4)',
    padding: '4px 6px',
    borderRadius: radii.sm,
    lineHeight: 1,
    transition: `color ${transition.fast}, background-color ${transition.fast}`,
  },
  nav: {
    flex: 1,
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 14px',
    borderRadius: radii.md,
    textDecoration: 'none',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    transition: `all ${transition.fast}`,
    whiteSpace: 'nowrap' as const,
  },
  bottom: {
    padding: '12px 8px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  logoutBtn: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: radii.md,
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.06)',
    cursor: 'pointer',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: 'rgba(255,255,255,0.5)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    transition: `background-color ${transition.fast}, color ${transition.fast}`,
  },
  main: {
    flex: 1,
    transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  header: {
    backgroundColor: colors.white,
    borderBottom: `1px solid ${colors.border}`,
    padding: '16px 32px',
    position: 'sticky',
    top: 0,
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
  },
  headerLeft: {},
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  email: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  bellBtn: {
    position: 'relative',
    fontSize: 20,
    cursor: 'pointer',
    padding: '6px 8px',
    borderRadius: radii.sm,
    textDecoration: 'none',
    transition,
  },
  bellBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.accent,
    color: colors.white,
    fontSize: 10,
    fontWeight: fontWeight.bold,
    borderRadius: radii.full,
    minWidth: 16,
    height: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.accent,
    color: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase' as const,
  },
  content: {
    padding: 32,
  },
};
