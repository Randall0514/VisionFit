import React, { useEffect, useState } from 'react';
import api from '../api';
import StatsCard from '../components/StatsCard';
import type { DashboardStats } from '../types';
import { colors, radii, fontSize, fontWeight, shadow, badgeColor, badgeBase, transition } from '../theme';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    api.getDashboard().then(setStats).catch(console.error).finally(() => setLoading(false));
    api.getLowStock().then((items) => setLowStockCount(items.length)).catch(console.error);
  }, []);

  if (loading) return <div style={styles.loading}>Loading dashboard...</div>;
  if (!stats) return <div style={styles.error}>Failed to load dashboard</div>;

  return (
    <div>
      <h2 style={styles.heading}>Dashboard</h2>
      <div style={styles.statsRow}>
        <StatsCard title="Total Orders" value={stats.totalOrders} color={colors.primary} />
        <StatsCard title="Revenue" value={`₱${stats.totalRevenue.toLocaleString()}`} color={colors.green} />
        <StatsCard title="Users" value={stats.totalUsers} color={colors.blue} />
        <StatsCard title="Processing" value={stats.statusCounts.processing || 0} subtitle="Orders in progress" color={colors.orange} />
      </div>

      {lowStockCount > 0 && (
        <div style={styles.alertCard}>
          <span>⚠️</span>
          <div>
            <strong>{lowStockCount} product{lowStockCount !== 1 ? 's' : ''} low on stock</strong>
            <p style={{ margin: 0, fontSize: fontSize.sm, color: colors.textSecondary }}>Check Inventory to restock items below threshold.</p>
          </div>
        </div>
      )}

      <div style={styles.tableCard}>
        <h3 style={styles.tableTitle}>Recent Orders</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.map((order) => {
              const customer = order.user;
              const name = 'firstName' in customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown';
              const bc = badgeColor(order.status as any);
              return (
                <tr key={order._id} style={styles.tr}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.hover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <td style={styles.td}><span style={styles.customerName}>{name}</span></td>
                  <td style={styles.td}>₱{order.totalPrice.toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={{ ...badgeBase, backgroundColor: bc.bg, color: bc.color }}>{order.status}</span>
                  </td>
                  <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
            {stats.recentOrders.length === 0 && (
              <tr><td style={{ ...styles.td, textAlign: 'center', color: colors.textMuted }} colSpan={4}>No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heading: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.extrabold,
    marginBottom: 24,
    color: colors.text,
  },
  statsRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 28,
    flexWrap: 'wrap',
  },
  alertCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 20px',
    marginBottom: 20,
    borderRadius: radii.lg,
    backgroundColor: '#FFF8E1',
    border: `1px solid ${colors.orange}`,
    fontSize: fontSize.md,
    color: colors.text,
  },
  tableCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    overflow: 'hidden',
    boxShadow: shadow.card,
  },
  tableTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    padding: '18px 24px',
    margin: 0,
    borderBottom: `1px solid ${colors.border}`,
    color: colors.text,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 24px',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    borderBottom: `1px solid ${colors.border}`,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tr: {
    borderBottom: `1px solid ${colors.borderLight}`,
    transition: `background-color ${transition.fast}`,
  },
  td: {
    padding: '14px 24px',
    fontSize: fontSize.md,
    color: colors.text,
  },
  customerName: {
    fontWeight: fontWeight.medium,
  },
  loading: {
    padding: 24,
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
  error: {
    padding: 24,
    color: colors.red,
    fontSize: fontSize.md,
  },
};
