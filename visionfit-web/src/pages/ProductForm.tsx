import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { colors, radii, fontSize, fontWeight, shadow, transition, inputBase, textareaBase, labelBase } from '../theme';

const CATEGORIES = ['eyeglass', 'sunglasses', 'blue light', 'sports', 'transitions'];
const SHAPES = ['square', 'rectangle', 'round', 'cat-eye', 'browline', 'aviator'];
const FACE_SHAPES = ['round', 'heart', 'diamond', 'oval', 'square'];
const LENSES = ['single vision', 'blue-light', 'progressive', 'thin lens', 'photochromic'];

const IMG_BASE = '';

interface FormData {
  name: string;
  price: string;
  description: string;
  category: string;
  frameShape: string;
  colors: { name: string; hex: string }[];
  stock: { color: string; quantity: number }[];
  lowStockThreshold: string;
  compatibleLenses: string[];
  faceShapes: string[];
  image: string;
  inStock: boolean;
}

const empty: FormData = {
  name: '', price: '', description: '',
  category: 'eyeglass', frameShape: 'round',
  colors: [{ name: 'Black', hex: '#000000' }],
  stock: [{ color: 'Black', quantity: 0 }],
  lowStockThreshold: '5',
  compatibleLenses: [], faceShapes: [],
  image: '', inStock: true,
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(empty);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      api.getProduct(id).then((p) => {
        const colors = p.colors.length ? p.colors : [{ name: 'Black', hex: '#000000' }];
        const stock = p.stock?.length ? p.stock : colors.map((c: any) => ({ color: c.name, quantity: 0 }));
        setForm({
          name: p.name, price: String(p.price), description: p.description,
          category: p.category, frameShape: p.frameShape,
          colors,
          stock,
          lowStockThreshold: String(p.lowStockThreshold ?? 5),
          compatibleLenses: p.compatibleLenses, faceShapes: p.faceShapes,
          image: p.image, inStock: p.inStock,
        });
        if (p.image) setPreview(`${IMG_BASE}${p.image}`);
      });
    }
  }, [id, isEdit]);

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (fieldErrors[key]) setFieldErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  const toggleArray = (key: 'compatibleLenses' | 'faceShapes', val: string) => {
    setForm((f) => {
      const arr = f[key];
      return { ...f, [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] };
    });
    if (fieldErrors[key]) setFieldErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  const addColor = () => setForm((f) => ({ ...f, colors: [...f.colors, { name: '', hex: '#000000' }], stock: [...f.stock, { color: '', quantity: 0 }] }));
  const removeColor = (i: number) => setForm((f) => ({ ...f, colors: f.colors.filter((_, idx) => idx !== i), stock: f.stock.filter((_, idx) => idx !== i) }));
  const updateColor = (i: number, field: 'name' | 'hex', val: string) => {
    setForm((f) => ({ ...f, colors: f.colors.map((c, idx) => idx === i ? { ...c, [field]: val } : c) }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      if (fieldErrors.image) setFieldErrors((prev) => { const n = { ...prev }; delete n.image; return n; });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const errs: Record<string, string> = {};
    if (!form.description.trim()) errs.description = 'Description is required';
    if (form.compatibleLenses.length === 0) errs.compatibleLenses = 'Select at least one compatible lens';
    if (form.faceShapes.length === 0) errs.faceShapes = 'Select at least one face shape';
    if (!imageFile && !form.image) errs.image = 'Product image is required';
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      let imageUrl = form.image;
      if (imageFile) {
        const uploaded = await api.uploadImage(imageFile);
        imageUrl = uploaded.url;
      }

      const payload = {
        ...form,
        price: Number(form.price),
        lowStockThreshold: Number(form.lowStockThreshold),
        image: imageUrl,
      };

      if (isEdit && id) {
        await api.updateProduct(id, payload);
      } else {
        await api.createProduct(payload);
      }
      navigate('/products');
    } catch (err: any) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 style={styles.heading}>{isEdit ? 'Edit Product' : 'Add Product'}</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Product Name <span style={styles.required}>*</span></label>
            <input style={inputBase} value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Price (₱) <span style={styles.required}>*</span></label>
            <input style={inputBase} type="number" value={form.price} onChange={(e) => set('price', e.target.value)} required />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Description <span style={styles.required}>*</span></label>
          <textarea style={textareaBase} rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} required />
          {fieldErrors.description && <div style={styles.fieldError}>{fieldErrors.description}</div>}
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Category <span style={styles.required}>*</span></label>
            <select style={inputBase} value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Frame Shape <span style={styles.required}>*</span></label>
            <select style={inputBase} value={form.frameShape} onChange={(e) => set('frameShape', e.target.value)}>
              {SHAPES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Colors</label>
          {form.colors.map((c, i) => (
            <div key={i} style={styles.colorRow}>
              <input style={{ ...inputBase, flex: 1 }} placeholder="Color name" value={c.name} onChange={(e) => updateColor(i, 'name', e.target.value)} />
              <input type="color" value={c.hex} onChange={(e) => updateColor(i, 'hex', e.target.value)} style={styles.colorPicker} />
              {form.colors.length > 1 && (
                <button type="button" onClick={() => removeColor(i)} style={styles.removeBtn}>✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addColor} style={styles.addColorBtn}>+ Add Color</button>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Stock per Color</label>
          <div style={styles.stockGrid}>
            {form.colors.map((c, i) => (
              <div key={i} style={styles.stockRow}>
                <span style={{ ...styles.colorDot, backgroundColor: c.hex }} />
                <span style={styles.colorLabel}>{c.name || `Color ${i + 1}`}</span>
                <input
                  type="number"
                  min={0}
                  value={form.stock[i]?.quantity ?? 0}
                  onChange={(e) => {
                    const stock = [...form.stock];
                    while (stock.length <= i) stock.push({ color: '', quantity: 0 });
                    stock[i] = { color: c.name, quantity: Number(e.target.value) };
                    set('stock', stock);
                  }}
                  style={styles.stockInput}
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={labelBase}>Low Stock Threshold</label>
            <input
              type="number"
              min={0}
              value={form.lowStockThreshold}
              onChange={(e) => set('lowStockThreshold', e.target.value)}
              style={{ ...styles.stockInput, width: 60 }}
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Compatible Lenses <span style={styles.required}>*</span></label>
          {fieldErrors.compatibleLenses && <div style={styles.fieldError}>{fieldErrors.compatibleLenses}</div>}
          <div style={styles.chipRow}>
            {LENSES.map((l) => (
              <button key={l} type="button" onClick={() => toggleArray('compatibleLenses', l)}
                style={{ ...styles.chip, ...(form.compatibleLenses.includes(l) ? styles.chipActive : {}) }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Face Shapes <span style={styles.required}>*</span></label>
          {fieldErrors.faceShapes && <div style={styles.fieldError}>{fieldErrors.faceShapes}</div>}
          <div style={styles.chipRow}>
            {FACE_SHAPES.map((f) => (
              <button key={f} type="button" onClick={() => toggleArray('faceShapes', f)}
                style={{ ...styles.chip, ...(form.faceShapes.includes(f) ? styles.chipActive : {}) }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Product Image <span style={styles.required}>*</span></label>
          {fieldErrors.image && <div style={styles.fieldError}>{fieldErrors.image}</div>}
          <input type="file" accept="image/*" onChange={handleImage} style={styles.fileInput} />
          {preview && <img src={preview} alt="Preview" style={styles.preview} />}
        </div>

        <div style={styles.field}>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" checked={form.inStock} onChange={(e) => set('inStock', e.target.checked)} style={styles.checkbox} />
            In Stock
          </label>
        </div>

        <div style={styles.buttonRow}>
          <button type="button" onClick={() => navigate('/products')} style={styles.cancelBtn}>Cancel</button>
          <button type="submit" disabled={saving} style={{ ...styles.saveBtn, ...(saving ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }}>
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
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
  form: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: 28,
    boxShadow: shadow.card,
    maxWidth: 720,
  },
  row: {
    display: 'flex',
    gap: 16,
  },
  field: {
    marginBottom: 20,
    flex: 1,
  },
  label: {
    ...labelBase,
  },
  required: {
    color: colors.accent,
  },
  colorRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  colorPicker: {
    width: 44,
    height: 44,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    cursor: 'pointer',
    padding: 2,
  },
  removeBtn: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    border: `1px solid ${colors.redLight}`,
    backgroundColor: colors.redLight,
    color: colors.redDark,
    cursor: 'pointer',
    fontSize: fontSize.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addColorBtn: {
    padding: '7px 14px',
    borderRadius: radii.sm,
    border: `1px dashed ${colors.border}`,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginTop: 4,
  },
  stockGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginTop: 4,
  },
  stockRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: radii.full,
    border: `1px solid ${colors.border}`,
    flexShrink: 0,
  },
  colorLabel: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    minWidth: 80,
  },
  stockInput: {
    width: 80,
    height: 36,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.sm,
    padding: '0 10px',
    fontSize: fontSize.md,
    textAlign: 'center',
    backgroundColor: colors.inputBg,
    outline: 'none',
  },
  chipRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    padding: '7px 16px',
    borderRadius: radii.full,
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.white,
    cursor: 'pointer',
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    transition: `all ${transition.fast}`,
  },
  chipActive: {
    backgroundColor: colors.accent,
    color: colors.white,
    borderColor: colors.accent,
  },
  fileInput: {
    marginBottom: 10,
    fontSize: fontSize.md,
  },
  preview: {
    width: 120,
    height: 120,
    objectFit: 'cover',
    borderRadius: radii.lg,
    border: `1px solid ${colors.border}`,
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text,
    cursor: 'pointer',
  },
  checkbox: {
    width: 18,
    height: 18,
    accentColor: colors.accent,
    cursor: 'pointer',
  },
  buttonRow: {
    display: 'flex',
    gap: 12,
    marginTop: 8,
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '10px 24px',
    borderRadius: radii.lg,
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.white,
    cursor: 'pointer',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  saveBtn: {
    padding: '10px 28px',
    borderRadius: radii.lg,
    border: 'none',
    backgroundColor: colors.accent,
    color: colors.white,
    cursor: 'pointer',
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  error: {
    backgroundColor: colors.redLight,
    color: colors.redDark,
    padding: '12px 16px',
    borderRadius: radii.md,
    fontSize: fontSize.base,
    marginBottom: 16,
  },
  fieldError: {
    color: colors.redDark,
    fontSize: fontSize.sm,
    marginTop: 6,
    marginBottom: 4,
  },
};
