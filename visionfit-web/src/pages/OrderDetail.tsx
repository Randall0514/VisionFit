import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import type { Order } from '../types';

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

  if (loading) return <div style={{ padding: 20, color: '#888' }}>Loading order...</div>;
  if (!order) return <div style={{ padding: 20, color: '#d33' }}>Order not found</div>;

  const user = order.user as any;
  const customerName = user?.firstName ? `${user.firstName} ${user.lastName}` : 'Unknown';

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
          <div style={{ ...styles.badge, ...badgeColor(order.status) }}>{order.status}</div>
          <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
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
              <tr key={i} style={styles.tr}>
                <td style={styles.td}>{item.name}</td>
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

      <div style={{ marginTop: 8, fontSize: 12, color: '#aaa' }}>
        Created: {new Date(order.createdAt).toLocaleString()}
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
  return { backgroundColor: c.background, color: c.color, padding: '4px 14px', borderRadius: 6, fontSize: 14, fontWeight: 600, display: 'inline-block' };
}

const styles: Record<string, React.CSSProperties> = {
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6C3BC6', fontWeight: 600, padding: 0, marginBottom: 12 },
  heading: { fontSize: 22, fontWeight: 800, marginBottom: 20 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: 13, fontWeight: 600, color: '#888', textTransform: 'uppercase', marginBottom: 10, marginTop: 0 },
  info: { fontSize: 16, fontWeight: 700, margin: 0 },
  infoSmall: { fontSize: 13, color: '#666', margin: '4px 0 0' },
  badge: { textTransform: 'capitalize' },
  statusBtn: { padding: '6px 14px', borderRadius: 6, border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' },
  statusBtnActive: { backgroundColor: '#6C3BC6', color: '#fff', borderColor: '#6C3BC6' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#888', borderBottom: '1px solid #eee', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '12px 16px', fontSize: 14 },
  total: { textAlign: 'right', padding: '12px 16px', fontSize: 16, fontWeight: 800, borderTop: '1px solid #eee' },
};
