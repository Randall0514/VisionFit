import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { colors, radii, fontSize, fontWeight, shadow, transition, inputBase, labelBase } from '../theme';

export default function Settings() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [shippingFee, setShippingFee] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [storeMsg, setStoreMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getSettings().then((s) => {
      setStoreName(s.storeName || '');
      setContactEmail(s.contactEmail || '');
      setShippingFee(String(s.shippingFee || 0));
    }).catch(console.error);
  }, []);

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg('');
    setSaving(true);
    try {
      await api.updateSettings({ storeName, contactEmail, shippingFee: Number(shippingFee) });
      setProfileMsg('Settings saved');
    } catch (err: any) {
      setProfileMsg(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      setPasswordMsg('Password updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 style={styles.heading}>Settings</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Profile</h3>
          <form onSubmit={handleProfile} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>First Name</label>
              <input style={inputBase} value={firstName} onChange={(e) => setFirstName(e.target.value)} readOnly />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Last Name</label>
              <input style={inputBase} value={lastName} onChange={(e) => setLastName(e.target.value)} readOnly />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input style={{ ...inputBase, backgroundColor: colors.hover, cursor: 'not-allowed' }} value={user?.email || ''} readOnly />
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Change Password</h3>
          <form onSubmit={handlePassword} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Current Password</label>
              <input style={inputBase} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>New Password</label>
              <input style={inputBase} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Confirm New Password</label>
              <input style={inputBase} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            {passwordMsg && <div style={{ ...styles.msg, color: passwordMsg.includes('updated') ? colors.greenDark : colors.redDark }}>{passwordMsg}</div>}
            <button type="submit" disabled={saving} style={styles.saveBtn}>Update Password</button>
          </form>
        </div>
      </div>

      <div style={{ ...styles.card, maxWidth: 720, marginTop: 20 }}>
        <h3 style={styles.cardTitle}>Store Settings</h3>
        <form onSubmit={handleProfile} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Store Name</label>
              <input style={inputBase} value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Contact Email</label>
              <input style={inputBase} type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Shipping Fee (₱)</label>
            <input style={{ ...inputBase, maxWidth: 200 }} type="number" min={0} value={shippingFee} onChange={(e) => setShippingFee(e.target.value)} />
          </div>
          {profileMsg && <div style={{ ...styles.msg, color: profileMsg.includes('saved') ? colors.greenDark : colors.redDark }}>{profileMsg}</div>}
          <button type="submit" disabled={saving} style={styles.saveBtn}>Save Settings</button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heading: { fontSize: fontSize.heading, fontWeight: fontWeight.extrabold, marginBottom: 24, color: colors.text },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 },
  card: { backgroundColor: colors.white, borderRadius: radii.xl, padding: 28, boxShadow: shadow.card },
  cardTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, marginBottom: 20, color: colors.text, marginTop: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  row: { display: 'flex', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6, flex: 1 },
  label: { ...labelBase },
  msg: { fontSize: fontSize.base, fontWeight: fontWeight.medium, padding: '10px 14px', borderRadius: radii.md, backgroundColor: colors.hover },
  saveBtn: { alignSelf: 'flex-start', padding: '10px 24px', borderRadius: radii.lg, border: 'none', backgroundColor: colors.accent, color: colors.white, fontSize: fontSize.md, fontWeight: fontWeight.bold, cursor: 'pointer' },
};
