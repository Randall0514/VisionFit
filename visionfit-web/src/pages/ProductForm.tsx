import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

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
  compatibleLenses: string[];
  faceShapes: string[];
  image: string;
  inStock: boolean;
}

const empty: FormData = {
  name: '', price: '', description: '',
  category: 'eyeglass', frameShape: 'round',
  colors: [{ name: 'Black', hex: '#000000' }],
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

  useEffect(() => {
    if (isEdit && id) {
      api.getProduct(id).then((p) => {
        setForm({
          name: p.name, price: String(p.price), description: p.description,
          category: p.category, frameShape: p.frameShape,
          colors: p.colors.length ? p.colors : [{ name: 'Black', hex: '#000000' }],
          compatibleLenses: p.compatibleLenses, faceShapes: p.faceShapes,
          image: p.image, inStock: p.inStock,
        });
        if (p.image) setPreview(`${IMG_BASE}${p.image}`);
      });
    }
  }, [id, isEdit]);

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) => setForm((f) => ({ ...f, [key]: val }));

  const toggleArray = (key: 'compatibleLenses' | 'faceShapes', val: string) => {
    setForm((f) => {
      const arr = f[key];
      return { ...f, [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] };
    });
  };

  const addColor = () => setForm((f) => ({ ...f, colors: [...f.colors, { name: '', hex: '#000000' }] }));
  const removeColor = (i: number) => setForm((f) => ({ ...f, colors: f.colors.filter((_, idx) => idx !== i) }));
  const updateColor = (i: number, field: 'name' | 'hex', val: string) => {
    setForm((f) => ({ ...f, colors: f.colors.map((c, idx) => idx === i ? { ...c, [field]: val } : c) }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
            <label style={styles.label}>Product Name *</label>
            <input style={styles.input} value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Price (₱) *</label>
            <input style={styles.input} type="number" value={form.price} onChange={(e) => set('price', e.target.value)} required />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea style={styles.textarea} rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Category *</label>
            <select style={styles.input} value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Frame Shape *</label>
            <select style={styles.input} value={form.frameShape} onChange={(e) => set('frameShape', e.target.value)}>
              {SHAPES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Colors</label>
          {form.colors.map((c, i) => (
            <div key={i} style={styles.colorRow}>
              <input style={{ ...styles.input, flex: 1 }} placeholder="Color name" value={c.name} onChange={(e) => updateColor(i, 'name', e.target.value)} />
              <input type="color" value={c.hex} onChange={(e) => updateColor(i, 'hex', e.target.value)} style={styles.colorPicker} />
              {form.colors.length > 1 && (
                <button type="button" onClick={() => removeColor(i)} style={styles.removeBtn}>✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addColor} style={styles.addColorBtn}>+ Add Color</button>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Compatible Lenses</label>
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
          <label style={styles.label}>Face Shapes</label>
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
          <label style={styles.label}>Product Image</label>
          <input type="file" accept="image/*" onChange={handleImage} style={styles.fileInput} />
          {preview && <img src={preview} alt="Preview" style={styles.preview} />}
        </div>

        <div style={styles.field}>
          <label style={styles.label}>
            <input type="checkbox" checked={form.inStock} onChange={(e) => set('inStock', e.target.checked)} style={{ marginRight: 8 }} />
            In Stock
          </label>
        </div>

        <div style={styles.buttonRow}>
          <button type="button" onClick={() => navigate('/products')} style={styles.cancelBtn}>Cancel</button>
          <button type="submit" disabled={saving} style={styles.saveBtn}>
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heading: { fontSize: 22, fontWeight: 800, marginBottom: 20 },
  form: { backgroundColor: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', maxWidth: 700 },
  row: { display: 'flex', gap: 16 },
  field: { marginBottom: 16, flex: 1 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 },
  input: { width: '100%', height: 42, border: '1px solid #ddd', borderRadius: 8, padding: '0 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' },
  textarea: { width: '100%', border: '1px solid #ddd', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', backgroundColor: '#fafafa' },
  colorRow: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 },
  colorPicker: { width: 42, height: 42, border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', padding: 2 },
  removeBtn: { width: 32, height: 32, borderRadius: 6, border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: 14 },
  addColorBtn: { padding: '6px 12px', borderRadius: 6, border: '1px dashed #ccc', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 13, color: '#666' },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  chip: { padding: '6px 14px', borderRadius: 20, border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontSize: 13 },
  chipActive: { backgroundColor: '#6C3BC6', color: '#fff', borderColor: '#6C3BC6' },
  fileInput: { marginBottom: 8 },
  preview: { width: 120, height: 120, objectFit: 'cover', borderRadius: 10, border: '1px solid #eee' },
  buttonRow: { display: 'flex', gap: 10, marginTop: 8 },
  cancelBtn: { padding: '10px 24px', borderRadius: 10, border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  saveBtn: { padding: '10px 24px', borderRadius: 10, border: 'none', backgroundColor: '#6C3BC6', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700 },
  error: { backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 12 },
};
