import React, { useEffect, useState } from 'react';
import api from '../api';
import { colors, radii, fontSize, fontWeight, shadow, transition } from '../theme';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link: string;
  createdAt: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const load = () => {
    setLoading(true);
    api.getNotifications().then(setNotifications).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err: any) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const n of unread) {
      try { await api.markNotificationRead(n._id); } catch {}
    }
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = async (id: string) => {
    try {
      await api.deleteNotification(id);
      setNotifications((prev) => prev.filter(n => n._id !== id));
    } catch (err: any) {
      console.error(err);
    }
  };

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  const typeIcon = (type: string) => {
    switch (type) {
      case 'new_order': return '📦';
      case 'low_stock': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <div>
      <div style={styles.topRow}>
        <h2 style={styles.heading}>Notifications {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}</h2>
        {unreadCount > 0 && <button onClick={markAllRead} style={styles.markAllBtn}>Mark all as read</button>}
      </div>

      <div style={styles.filterRow}>
        <button onClick={() => setFilter('all')} style={{ ...styles.filterBtn, ...(filter === 'all' ? styles.filterActive : {}) }}>All</button>
        <button onClick={() => setFilter('unread')} style={{ ...styles.filterBtn, ...(filter === 'unread' ? styles.filterActive : {}) }}>Unread</button>
      </div>

      <div style={styles.list}>
        {loading ? (
          <div style={styles.empty}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>No notifications</div>
        ) : filtered.map((n) => (
          <div key={n._id} style={{ ...styles.item, backgroundColor: n.read ? colors.white : `${colors.accent}05` }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.hover; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = n.read ? colors.white : `${colors.accent}05`; }}
          >
            <div style={styles.iconWrap}>
              <span style={styles.icon}>{typeIcon(n.type)}</span>
              {!n.read && <span style={styles.dot} />}
            </div>
            <div style={styles.content}>
              <div style={styles.title}>{n.title}</div>
              <div style={styles.message}>{n.message}</div>
              <div style={styles.time}>{new Date(n.createdAt).toLocaleString()}</div>
            </div>
            <div style={styles.actions}>
              {!n.read && <button onClick={() => markRead(n._id)} style={styles.actionBtn}>Mark read</button>}
              <button onClick={() => removeNotification(n._id)} style={{ ...styles.actionBtn, color: colors.red }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  heading: { fontSize: fontSize.heading, fontWeight: fontWeight.extrabold, color: colors.text, display: 'flex', alignItems: 'center', gap: 10 },
  badge: { backgroundColor: colors.accent, color: colors.white, fontSize: fontSize.sm, fontWeight: fontWeight.bold, padding: '2px 10px', borderRadius: radii.full },
  markAllBtn: { padding: '8px 16px', borderRadius: radii.md, border: `1px solid ${colors.border}`, backgroundColor: colors.white, cursor: 'pointer', fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textSecondary },
  filterRow: { display: 'flex', gap: 8, marginBottom: 20 },
  filterBtn: { padding: '7px 18px', borderRadius: radii.full, border: `1px solid ${colors.border}`, backgroundColor: colors.white, cursor: 'pointer', fontSize: fontSize.base, fontWeight: fontWeight.medium, color: colors.textSecondary, transition: `all ${transition.fast}` },
  filterActive: { backgroundColor: colors.accent, color: colors.white, borderColor: colors.accent },
  list: { display: 'flex', flexDirection: 'column', gap: 8 },
  empty: { padding: 40, textAlign: 'center', color: colors.textMuted, fontSize: fontSize.md },
  item: { display: 'flex', alignItems: 'flex-start', gap: 16, padding: 16, borderRadius: radii.lg, transition: `background-color ${transition.fast}`, cursor: 'default' },
  iconWrap: { position: 'relative' as const, flexShrink: 0 },
  icon: { fontSize: 20 },
  dot: { position: 'absolute' as const, top: -2, right: -2, width: 8, height: 8, borderRadius: radii.full, backgroundColor: colors.accent },
  content: { flex: 1 },
  title: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
  message: { fontSize: fontSize.base, color: colors.textSecondary, marginTop: 2 },
  time: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 4 },
  actions: { display: 'flex', gap: 8, flexShrink: 0 },
  actionBtn: { padding: '4px 12px', borderRadius: radii.sm, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.textSecondary },
};
