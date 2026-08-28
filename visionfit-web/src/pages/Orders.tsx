import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import type { Order } from '../types';

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
              <tr><td style={{ ...styles.td, textAlign: 'center', color: '#aaa' }} colSpan={6}>Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td style={{ ...styles.td, textAlign: 'center', color: '#aaa' }} colSpan={6}>No orders found</td></tr>
            ) : orders.map((o) => {
              const user = o.user as any;
              const name = user?.firstName ? `${user.firstName} ${user.lastName}` : 'Unknown';
              return (
                <tr key={o._id} style={styles.tr} onClick={() => navigate(`/orders/${o._id}`)}>
                  <td style={styles.td}><code style={{ fontSize: 12 }}>{o._id.slice(-8)}</code></td>
                  <td style={styles.td}>{name}</td>
                  <td style={styles.td}>{o.items.length} item(s)</td>
                  <td style={styles.td}>₱{o.totalPrice.toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...badgeColor(o.status) }}>{o.status}</span>
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
          <button disabled={page <= 1} onClick={() => { setPage(page - 1); load(page - 1); }} style={styles.pageBtn}>Prev</button>
          <span style={styles.pageInfo}>Page {page} of {pages}</span>
          <button disabled={page >= pages} onClick={() => { setPage(page + 1); load(page + 1); }} style={styles.pageBtn}>Next</button>
        </div>
      )}
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
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  heading: { fontSize: 22, fontWeight: 800, margin: 0 },
  filterRow: { display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' },
  filterBtn: { padding: '7px 16px', borderRadius: 20, border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, textTransform: 'capitalize' },
  filterActive: { backgroundColor: '#6C3BC6', color: '#fff', borderColor: '#6C3BC6' },
  tableCard: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#888', borderBottom: '1px solid #eee', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f5f5f5', cursor: 'pointer' },
  td: { padding: '12px 16px', fontSize: 14 },
  badge: { padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 16 },
  pageBtn: { padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontSize: 13 },
  pageInfo: { fontSize: 13, color: '#888' },
};
