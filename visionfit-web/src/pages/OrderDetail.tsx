import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import type { Order } from '../types';
import { colors, radii, fontSize, fontWeight, shadow, badgeColor, badgeBase, transition } from '../theme';

const STATUSES = ['unpaid', 'processing', 'shipped', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      api.getOrder(id).then(setOrder).catch(console.error).finally(() => setLoading(false));
    }
  }, [id]);

  const handleStatus = async (newStatus: string) => {
    if (!id || !confirm(`Change status to "${newStatus}"?`)) return;
    setUpdating(true);
    try {
      const updated = await api.updateOrderStatus(id, newStatus);
      setOrder(updated);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading order...</div>;
  if (!order) return <div style={styles.error}>Order not found</div>;

  const user = order.user as any;
  const customerName = user?.firstName ? `${user.firstName} ${user.lastName}` : 'Unknown';
  const bc = badgeColor(order.status as any);

  return (
    <div>
      <button onClick={() => navigate('/orders')} style={styles.backBtn}>&larr; Back to Orders</button>
      <h2 style={styles.heading}>Order #{order._id.slice(-8)}</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Customer</h3>
          <p style={styles.info}>{customerName}</p>
          <p style={styles.infoSmall}>{user?.email}</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Delivery</h3>
          <p style={styles.info}>{order.deliveryDetails.fullName || customerName}</p>
          <p style={styles.infoSmall}>{order.deliveryDetails.address || 'No address'}</p>
          <p style={styles.infoSmall}>{order.deliveryDetails.mobile || 'No phone'}</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Status</h3>
          <span style={{ ...badgeBase, backgroundColor: bc.bg, color: bc.color, fontSize: fontSize.md, padding: '5px 14px' }}>{order.status}</span>
          <div style={styles.statusRow}>
            {STATUSES.map((s) => (
              <button key={s} onClick={() => handleStatus(s)}
                disabled={updating || s === order.status}
                style={{ ...styles.statusBtn, ...(s === order.status ? styles.statusBtnActive : {}) }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Items</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Color</th>
              <th style={styles.th}>Lens</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} style={styles.tr}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.hover; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <td style={styles.td}><span style={{ fontWeight: fontWeight.medium }}>{item.name}</span></td>
                <td style={styles.td}>{item.color}</td>
                <td style={styles.td}>{item.lensType || '-'}</td>
                <td style={styles.td}>{item.quantity}</td>
                <td style={styles.td}>₱{(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={styles.total}>Total: ₱{order.totalPrice.toLocaleString()}</div>
      </div>

      <div style={styles.timestamp}>
        Created: {new Date(order.createdAt).toLocaleString()}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: fontSize.md,
    color: colors.accent,
    fontWeight: fontWeight.semibold,
    padding: 0,
    marginBottom: 12,
    transition: `color ${transition.fast}`,
  },
  heading: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.extrabold,
    marginBottom: 24,
    color: colors.text,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: 24,
    boxShadow: shadow.card,
  },
  cardTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 0,
    letterSpacing: 0.3,
  },
  info: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    margin: 0,
    color: colors.text,
  },
  infoSmall: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    margin: '4px 0 0',
  },
  statusRow: {
    marginTop: 12,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBtn: {
    padding: '7px 16px',
    borderRadius: radii.sm,
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.white,
    cursor: 'pointer',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textTransform: 'capitalize',
    color: colors.textSecondary,
    transition: `all ${transition.fast}`,
  },
  statusBtnActive: {
    backgroundColor: colors.accent,
    color: colors.white,
    borderColor: colors.accent,
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
    transition: `background-color ${transition.fast}`,
  },
  td: {
    padding: '14px 20px',
    fontSize: fontSize.md,
    color: colors.text,
  },
  total: {
    textAlign: 'right',
    padding: '16px 20px',
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
    borderTop: `1px solid ${colors.border}`,
    color: colors.text,
  },
  timestamp: {
    marginTop: 12,
    fontSize: fontSize.sm,
    color: colors.textMuted,
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
