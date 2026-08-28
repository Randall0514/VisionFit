import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import type { Product } from '../types';

const IMG_BASE = '';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = (q?: string) => {
    setLoading(true);
    api.getProducts(q).then(setProducts).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(search);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={styles.topRow}>
        <h2 style={styles.heading}>Products</h2>
        <button onClick={() => navigate('/products/new')} style={styles.addBtn}>+ Add Product</button>
      </div>

      <form onSubmit={handleSearch} style={styles.searchRow}>
        <input
          style={styles.searchInput}
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" style={styles.searchBtn}>Search</button>
      </form>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Shape</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td style={{ ...styles.td, textAlign: 'center', color: '#aaa' }} colSpan={7}>Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td style={{ ...styles.td, textAlign: 'center', color: '#aaa' }} colSpan={7}>No products found</td></tr>
            ) : products.map((p) => (
              <tr key={p._id} style={styles.tr}>
                <td style={styles.td}>
                  {p.image ? (
                    <img src={`${IMG_BASE}${p.image}`} alt={p.name} style={styles.thumb} />
                  ) : (
                    <div style={styles.noImg}>No img</div>
                  )}
                </td>
                <td style={styles.td}><strong>{p.name}</strong></td>
                <td style={styles.td}>₱{p.price.toLocaleString()}</td>
                <td style={styles.td}>{p.category}</td>
                <td style={styles.td}>{p.frameShape}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, backgroundColor: p.inStock ? '#d1fae5' : '#fee2e2', color: p.inStock ? '#065f46' : '#991b1b' }}>
                    {p.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button onClick={() => navigate(`/products/${p._id}/edit`)} style={styles.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(p._id, p.name)} style={styles.deleteBtn}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  heading: { fontSize: 22, fontWeight: 800, margin: 0 },
  addBtn: { padding: '10px 20px', borderRadius: 10, border: 'none', backgroundColor: '#6C3BC6', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  searchRow: { display: 'flex', gap: 8, marginBottom: 16 },
  searchInput: { flex: 1, height: 42, border: '1px solid #ddd', borderRadius: 10, padding: '0 14px', fontSize: 14, outline: 'none' },
  searchBtn: { padding: '0 20px', borderRadius: 10, border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 600 },
  tableCard: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#888', borderBottom: '1px solid #eee', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '12px 16px', fontSize: 14, verticalAlign: 'middle' },
  thumb: { width: 48, height: 48, borderRadius: 8, objectFit: 'cover' },
  noImg: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#aaa' },
  badge: { padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 },
  actions: { display: 'flex', gap: 6 },
  editBtn: { padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  deleteBtn: { padding: '6px 12px', borderRadius: 6, border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
};
