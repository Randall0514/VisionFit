import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import type { Order } from '../types';
import { colors, radii, fontSize, fontWeight, shadow, badgeColor, badgeBase, transition } from '../theme';

const STATUSES = ['', 'unpaid', 'processing', 'shipped', 'delivered'];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = (p = 1, s = status) => {
    setLoading(true);
    api.getOrders(p, s || undefined).then((data) => {
      setOrders(data.orders);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleFilter = (s: string) => {
    setStatus(s);
    setPage(1);
    load(1, s);
  };

  return (
    <div>
      <div style={styles.topRow}>
        <h2 style={styles.heading}>Orders ({total})</h2>
      </div>

      <div style={styles.filterRow}>
        {STATUSES.map((s) => (
          <button key={s || 'all'} onClick={() => handleFilter(s)}
            style={{ ...styles.filterBtn, ...(status === s ? styles.filterActive : {}) }}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Items</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td style={{ ...styles.td, textAlign: 'center', color: colors.textMuted }} colSpan={6}>Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td style={{ ...styles.td, textAlign: 'center', color: colors.textMuted }} colSpan={6}>No orders found</td></tr>
            ) : orders.map((o) => {
              const user = o.user as any;
              const name = user?.firstName ? `${user.firstName} ${user.lastName}` : 'Unknown';
              const bc = badgeColor(o.status as any);
              return (
                <tr key={o._id} style={styles.tr} onClick={() => navigate(`/orders/${o._id}`)}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.hover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <td style={styles.td}><code style={styles.orderId}>{o._id.slice(-8)}</code></td>
                  <td style={styles.td}><span style={styles.customerName}>{name}</span></td>
                  <td style={styles.td}>{o.items.length} item(s)</td>
                  <td style={styles.td}>₱{o.totalPrice.toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={{ ...badgeBase, backgroundColor: bc.bg, color: bc.color }}>{o.status}</span>
                  </td>
                  <td style={styles.td}>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div style={styles.pagination}>
          <button disabled={page <= 1} onClick={() => { setPage(page - 1); load(page - 1); }}
            style={{ ...styles.pageBtn, ...(page <= 1 ? styles.pageBtnDisabled : {}) }}>Prev</button>
          <span style={styles.pageInfo}>Page {page} of {pages}</span>
          <button disabled={page >= pages} onClick={() => { setPage(page + 1); load(page + 1); }}
            style={{ ...styles.pageBtn, ...(page >= pages ? styles.pageBtnDisabled : {}) }}>Next</button>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.extrabold,
    margin: 0,
    color: colors.text,
  },
  filterRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '7px 18px',
    borderRadius: radii.full,
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.white,
    cursor: 'pointer',
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    textTransform: 'capitalize',
    color: colors.textSecondary,
    transition: `all ${transition.fast}`,
  },
  filterActive: {
    backgroundColor: colors.accent,
    color: colors.white,
    borderColor: colors.accent,
  },
  tableCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    overflow: 'hidden',
    boxShadow: shadow.card,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 20px',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    borderBottom: `1px solid ${colors.border}`,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tr: {
    borderBottom: `1px solid ${colors.borderLight}`,
    cursor: 'pointer',
    transition: `background-color ${transition.fast}`,
  },
  td: {
    padding: '14px 20px',
    fontSize: fontSize.md,
    color: colors.text,
  },
  orderId: {
    fontSize: fontSize.sm,
    fontFamily: 'monospace',
    color: colors.textSecondary,
    backgroundColor: colors.hover,
    padding: '2px 8px',
    borderRadius: radii.sm,
  },
  customerName: {
    fontWeight: fontWeight.medium,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 20,
  },
  pageBtn: {
    padding: '8px 20px',
    borderRadius: radii.md,
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.white,
    cursor: 'pointer',
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.text,
    transition: `all ${transition.fast}`,
  },
  pageBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  pageInfo: {
    fontSize: fontSize.base,
    color: colors.textMuted,
  },
};
