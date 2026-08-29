import React, { useEffect, useState } from 'react';
import api from '../api';
import type { Product } from '../types';
import { colors, radii, fontSize, fontWeight, shadow, transition, badgeBase } from '../theme';

const IMG_BASE = '';

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [lowStock, setLowStock] = useState<Product[]>([]);

  const load = (q?: string) => {
    setLoading(true);
    api.getProducts(q).then(setProducts).catch(console.error).finally(() => setLoading(false));
  };

  const loadLowStock = () => {
    api.getLowStock().then(setLowStock).catch(console.error);
  };

  useEffect(() => { load(); loadLowStock(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(search);
  };

  const updateStock = async (product: Product, colorIdx: number, qty: number) => {
    const stock = [...(product.stock || [])];
    while (stock.length <= colorIdx) {
      product.colors.forEach((c, i) => {
        if (!stock[i]) stock[i] = { color: c.name, quantity: 0 };
      });
    }
    stock[colorIdx] = { color: product.colors[colorIdx]?.name || '', quantity: qty };

    const inStock = stock.some(s => s.quantity > 0);

    setSavingId(product._id);
    try {
      const updated = await api.updateStock(product._id, { stock });
      setProducts((prev) => prev.map(p => p._id === product._id ? { ...p, stock: updated.stock, inStock } : p));
      loadLowStock();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const updateThreshold = async (product: Product, threshold: number) => {
    setSavingId(product._id);
    try {
      const updated = await api.updateStock(product._id, { stock: product.stock || [], lowStockThreshold: threshold });
      setProducts((prev) => prev.map(p => p._id === product._id ? { ...p, lowStockThreshold: updated.lowStockThreshold } : p));
      loadLowStock();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <h2 style={styles.heading}>Inventory</h2>

      {lowStock.length > 0 && (
        <div style={styles.alertCard}>
          <div style={styles.alertHeader}>Low Stock Alerts</div>
          <div style={styles.alertGrid}>
            {lowStock.map((p) => (
              <div key={p._id} style={styles.alertItem}>
                {p.image ? <img src={`${IMG_BASE}${p.image}`} alt="" style={styles.alertImg} /> : <div style={styles.alertNoImg}>!</div>}
                <div>
                  <div style={styles.alertName}>{p.name}</div>
                  <div style={styles.alertColors}>
                    {p.stock.map((s, i) => (
                      <span key={i} style={styles.alertColorTag}>{s.color}: {s.quantity}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSearch} style={styles.searchRow}>
        <input style={styles.searchInput} placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type="submit" style={styles.searchBtn}>Search</button>
      </form>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Colors & Stock</th>
              <th style={styles.th}>Threshold</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td style={{ ...styles.td, textAlign: 'center', color: colors.textMuted }} colSpan={4}>Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td style={{ ...styles.td, textAlign: 'center', color: colors.textMuted }} colSpan={4}>No products found</td></tr>
            ) : products.map((p) => {
              const threshold = p.lowStockThreshold || 5;
              const stock = p.stock || [];
              const hasLow = stock.some(s => s.quantity <= threshold && s.quantity > 0);
              const hasZero = stock.some(s => s.quantity === 0);
              return (
                <tr key={p._id} style={styles.tr}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.hover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <td style={styles.td}>
                    <div style={styles.productCell}>
                      {p.image ? <img src={`${IMG_BASE}${p.image}`} alt="" style={styles.thumb} /> : <div style={styles.noImg}>No img</div>}
                      <div>
                        <div style={styles.productName}>{p.name}</div>
                        <div style={styles.productCat}>{p.category}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.stockInputs}>
                      {p.colors.map((c, i) => {
                        const qty = stock[i]?.quantity ?? 0;
                        const isLow = qty <= threshold && qty > 0;
                        return (
                          <div key={i} style={styles.stockRow}>
                            <span style={{ ...styles.colorDot, backgroundColor: c.hex }} />
                            <span style={styles.colorName}>{c.name}</span>
                            <input
                              type="number"
                              min={0}
                              value={qty}
                              onChange={(e) => updateStock(p, i, Number(e.target.value))}
                              disabled={savingId === p._id}
                              style={{ ...styles.stockInput, ...(isLow ? styles.stockInputLow : hasZero && qty === 0 ? styles.stockInputZero : {}) }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <input
                      type="number"
                      min={0}
                      value={threshold}
                      onChange={(e) => updateThreshold(p, Number(e.target.value))}
                      disabled={savingId === p._id}
                      style={styles.thresholdInput}
                    />
                  </td>
                  <td style={styles.td}>
                    {hasZero ? (
                      <span style={{ ...badgeBase, backgroundColor: colors.redLight, color: colors.redDark }}>Out of Stock</span>
                    ) : hasLow ? (
                      <span style={{ ...badgeBase, backgroundColor: colors.yellowLight, color: colors.yellowDark }}>Low Stock</span>
                    ) : (
                      <span style={{ ...badgeBase, backgroundColor: colors.greenLight, color: colors.greenDark }}>In Stock</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heading: { fontSize: fontSize.heading, fontWeight: fontWeight.extrabold, marginBottom: 24, color: colors.text },
  alertCard: { backgroundColor: colors.yellowLight, borderRadius: radii.xl, padding: 20, marginBottom: 20, border: `1px solid ${colors.yellow}30` },
  alertHeader: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.yellowDark, marginBottom: 12 },
  alertGrid: { display: 'flex', flexDirection: 'column', gap: 8 },
  alertItem: { display: 'flex', alignItems: 'center', gap: 12 },
  alertImg: { width: 36, height: 36, borderRadius: radii.sm, objectFit: 'cover' },
  alertNoImg: { width: 36, height: 36, borderRadius: radii.sm, backgroundColor: colors.yellow, color: colors.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: fontWeight.bold },
  alertName: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
  alertColors: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 },
  alertColorTag: { fontSize: fontSize.xs, color: colors.yellowDark, backgroundColor: `${colors.yellow}20`, padding: '1px 8px', borderRadius: radii.full },
  searchRow: { display: 'flex', gap: 10, marginBottom: 20 },
  searchInput: { flex: 1, height: 42, border: `1px solid ${colors.border}`, borderRadius: radii.lg, padding: '0 16px', fontSize: fontSize.md, outline: 'none', backgroundColor: colors.white },
  searchBtn: { padding: '0 24px', borderRadius: radii.lg, border: 'none', backgroundColor: colors.primary, color: colors.white, cursor: 'pointer', fontWeight: fontWeight.semibold, fontSize: fontSize.md },
  tableCard: { backgroundColor: colors.white, borderRadius: radii.xl, overflow: 'hidden', boxShadow: shadow.card },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 20px', fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textMuted, borderBottom: `1px solid ${colors.border}`, textTransform: 'uppercase', letterSpacing: 0.3 },
  tr: { borderBottom: `1px solid ${colors.borderLight}`, transition: `background-color ${transition.fast}` },
  td: { padding: '14px 20px', fontSize: fontSize.md, color: colors.text, verticalAlign: 'middle' },
  productCell: { display: 'flex', alignItems: 'center', gap: 12 },
  thumb: { width: 44, height: 44, borderRadius: radii.md, objectFit: 'cover' },
  noImg: { width: 44, height: 44, borderRadius: radii.md, backgroundColor: colors.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fontSize.xs, color: colors.textMuted },
  productName: { fontWeight: fontWeight.semibold, fontSize: fontSize.md },
  productCat: { fontSize: fontSize.sm, color: colors.textMuted, textTransform: 'capitalize' },
  stockInputs: { display: 'flex', flexDirection: 'column', gap: 6 },
  stockRow: { display: 'flex', alignItems: 'center', gap: 8 },
  colorDot: { width: 12, height: 12, borderRadius: radii.full, border: `1px solid ${colors.border}`, flexShrink: 0 },
  colorName: { fontSize: fontSize.sm, color: colors.textSecondary, minWidth: 70 },
  stockInput: { width: 70, height: 32, border: `1px solid ${colors.border}`, borderRadius: radii.sm, padding: '0 8px', fontSize: fontSize.sm, textAlign: 'center', backgroundColor: colors.inputBg, outline: 'none' },
  stockInputLow: { borderColor: colors.yellow, backgroundColor: `${colors.yellow}10` },
  stockInputZero: { borderColor: colors.red, backgroundColor: `${colors.red}10` },
  thresholdInput: { width: 60, height: 32, border: `1px solid ${colors.border}`, borderRadius: radii.sm, padding: '0 8px', fontSize: fontSize.sm, textAlign: 'center', backgroundColor: colors.inputBg, outline: 'none' },
};
