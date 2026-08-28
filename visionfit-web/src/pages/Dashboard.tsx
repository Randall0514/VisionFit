import React, { useEffect, useState } from 'react';
import api from '../api';
import StatsCard from '../components/StatsCard';
import type { DashboardStats } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 20, color: '#888' }}>Loading dashboard...</div>;
  if (!stats) return <div style={{ padding: 20, color: '#d33' }}>Failed to load dashboard</div>;

  return (
    <div>
      <h2 style={styles.heading}>Dashboard</h2>
      <div style={styles.statsRow}>
        <StatsCard title="Total Orders" value={stats.totalOrders} color="#6C3BC6" />
        <StatsCard title="Revenue" value={`₱${stats.totalRevenue.toLocaleString()}`} color="#315B4A" />
        <StatsCard title="Users" value={stats.totalUsers} color="#2D5F8A" />
        <StatsCard title="Processing" value={stats.statusCounts.processing || 0} subtitle="Orders in progress" color="#B45A3C" />
      </div>

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
              return (
                <tr key={order._id} style={styles.tr}>
                  <td style={styles.td}>{name}</td>
                  <td style={styles.td}>₱{order.totalPrice.toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...badgeColor(order.status) }}>{order.status}</span>
                  </td>
                  <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
            {stats.recentOrders.length === 0 && (
              <tr><td style={{ ...styles.td, textAlign: 'center', color: '#aaa' }} colSpan={4}>No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function badgeColor(status: string): React.CSSProperties {
  const colors: Record<string, { background: string; color: string }> = {
    unpaid: { background: '#fef3c7', color: '#92400e' },
    processing: { background: '#dbeafe', color: '#1e40af' },
    shipped: { background: '#d1fae5', color: '#065f46' },
    delivered: { background: '#ede9fe', color: '#5b21b6' },
  };
  const c = colors[status] || { background: '#f3f4f6', color: '#374151' };
  return { backgroundColor: c.background, color: c.color, padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 };
}

const styles: Record<string, React.CSSProperties> = {
  heading: { fontSize: 22, fontWeight: 800, marginBottom: 20 },
  statsRow: { display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' },
  tableCard: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  tableTitle: { fontSize: 16, fontWeight: 700, padding: '16px 20px', margin: 0, borderBottom: '1px solid #eee' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 20px', fontSize: 12, fontWeight: 600, color: '#888', borderBottom: '1px solid #eee', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '12px 20px', fontSize: 14 },
};
