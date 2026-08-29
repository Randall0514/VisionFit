import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import type { Product } from '../types';
import { colors, radii, fontSize, fontWeight, shadow, transition, badgeBase } from '../theme';

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
              <tr><td style={{ ...styles.td, textAlign: 'center', color: colors.textMuted }} colSpan={7}>Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td style={{ ...styles.td, textAlign: 'center', color: colors.textMuted }} colSpan={7}>No products found</td></tr>
            ) : products.map((p) => (
              <tr key={p._id} style={styles.tr}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.hover; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <td style={styles.td}>
                  {p.image ? (
                    <img src={`${IMG_BASE}${p.image}`} alt={p.name} style={styles.thumb} />
                  ) : (
                    <div style={styles.noImg}>No img</div>
                  )}
                </td>
                <td style={styles.td}><span style={styles.productName}>{p.name}</span></td>
                <td style={styles.td}>₱{p.price.toLocaleString()}</td>
                <td style={styles.td}>
                  <span style={styles.categoryPill}>{p.category}</span>
                </td>
                <td style={styles.td}>{p.frameShape}</td>
                <td style={styles.td}>
                  <span style={{
                    ...badgeBase,
                    backgroundColor: p.inStock ? colors.greenLight : colors.redLight,
                    color: p.inStock ? colors.greenDark : colors.redDark,
                  }}>
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
  addBtn: {
    padding: '10px 22px',
    borderRadius: radii.lg,
    border: 'none',
    backgroundColor: colors.accent,
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    cursor: 'pointer',
  },
  searchRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 42,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.lg,
    padding: '0 16px',
    fontSize: fontSize.md,
    outline: 'none',
    backgroundColor: colors.white,
  },
  searchBtn: {
    padding: '0 24px',
    borderRadius: radii.lg,
    border: 'none',
    backgroundColor: colors.primary,
    color: colors.white,
    cursor: 'pointer',
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.md,
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
    transition: `background-color ${transition.fast}`,
  },
  td: {
    padding: '14px 20px',
    fontSize: fontSize.md,
    verticalAlign: 'middle',
    color: colors.text,
  },
  productName: {
    fontWeight: fontWeight.semibold,
  },
  categoryPill: {
    padding: '2px 10px',
    borderRadius: radii.full,
    backgroundColor: colors.hover,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    objectFit: 'cover',
  },
  noImg: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.hover,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  actions: {
    display: 'flex',
    gap: 8,
  },
  editBtn: {
    padding: '6px 14px',
    borderRadius: radii.sm,
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.white,
    cursor: 'pointer',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    transition: `background-color ${transition.fast}`,
  },
  deleteBtn: {
    padding: '6px 14px',
    borderRadius: radii.sm,
    border: `1px solid ${colors.redLight}`,
    backgroundColor: colors.redLight,
    color: colors.redDark,
    cursor: 'pointer',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    transition: `background-color ${transition.fast}`,
  },
};
