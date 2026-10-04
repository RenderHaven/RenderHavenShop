import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, MapPin, Package, Edit3, LogOut, Plus, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addressApi, authApi } from '../lib/api';
import type { Address } from '../types';

type Tab = 'profile' | 'addresses';

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const [tab, setTab] = useState<Tab>('profile');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? '');
  const [editEmail, setEditEmail] = useState(user?.email ?? '');
  const [saving, setSaving] = useState(false);
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: '', line1: '', city: '', state: '', pincode: '' });

  useEffect(() => {
    if (user?.id && tab === 'addresses') {
      addressApi.getAll(user.id).then((data) => {
        setAddresses((data as { addresses?: Address[] })?.addresses ?? (data as Address[]) ?? []);
      }).catch(() => {});
    }
  }, [user?.id, tab]);

  if (!user) return <Navigate to="/login" replace />;

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    try {
      await authApi.editUser(user.id, { name: editName, email: editEmail });
      await refreshUser();
      setEditingProfile(false);
    } catch {
      /* swallow */
    } finally {
      setSaving(false);
    }
  }

  async function addAddress() {
    await addressApi.add({ ...newAddr, user_id: user!.id });
    setNewAddr({ label: '', line1: '', city: '', state: '', pincode: '' });
    setShowAddAddr(false);
    const data = await addressApi.getAll(user!.id);
    setAddresses((data as { addresses?: Address[] })?.addresses ?? (data as Address[]) ?? []);
  }

  async function deleteAddress(id: string) {
    await addressApi.remove(id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={16} /> },
  ];

  return (
    <main className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-black text-5xl text-dark">My Account</h1>
        <div className="flex gap-3">
          <Link
            to="/orders"
            className="flex items-center gap-2 text-sm font-medium text-dark/60 hover:text-dark transition-colors"
          >
            <Package size={16} />
            <span className="hidden sm:inline">Orders</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${
              tab === t.id
                ? 'bg-olive text-white border-olive'
                : 'bg-white text-dark/60 border-olive/20 hover:border-olive/50'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="bg-white rounded-3xl border border-olive/10 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-dark text-xl">Personal Information</h2>
            {!editingProfile && (
              <button
                onClick={() => setEditingProfile(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-olive hover:text-dark transition-colors"
              >
                <Edit3 size={14} /> Edit
              </button>
            )}
          </div>

          {editingProfile ? (
            <div className="space-y-4">
              {[
                { label: 'Full Name', value: editName, setter: setEditName },
                { label: 'Email', value: editEmail, setter: setEditEmail },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-xs font-medium text-dark/50 uppercase tracking-wide block mb-1">{f.label}</label>
                  <input
                    value={f.value}
                    onChange={(e) => f.setter(e.target.value)}
                    className="w-full bg-cream border border-olive/20 rounded-xl px-4 py-3 text-sm text-dark focus:outline-none focus:border-olive"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 bg-olive text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-olive/80 transition-colors"
                >
                  <Save size={14} />
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setEditingProfile(false)}
                  className="flex items-center gap-2 bg-cream text-dark text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-olive/10 transition-colors"
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', value: user.name },
                { label: 'Phone', value: user.phone },
                { label: 'Email', value: user.email || '—' },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-xs font-medium text-dark/40 uppercase tracking-wide mb-1">{f.label}</p>
                  <p className="font-semibold text-dark">{f.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Addresses Tab */}
      {tab === 'addresses' && (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-2xl border border-olive/10 p-5 flex justify-between items-start">
              <div>
                <p className="font-semibold text-dark mb-0.5">{addr.label || 'Address'}</p>
                <p className="text-sm text-dark/60">
                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                  {addr.city}, {addr.state} — {addr.pincode}
                </p>
              </div>
              <button onClick={() => deleteAddress(addr.id)} className="p-2 text-dark/30 hover:text-red-500 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          ))}

          {showAddAddr ? (
            <div className="bg-white rounded-2xl border border-olive/20 p-6 space-y-4">
              <h3 className="font-semibold text-dark">Add New Address</h3>
              {(['label', 'line1', 'city', 'state', 'pincode'] as const).map((field) => (
                <input
                  key={field}
                  value={newAddr[field]}
                  onChange={(e) => setNewAddr((p) => ({ ...p, [field]: e.target.value }))}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full bg-cream border border-olive/20 rounded-xl px-4 py-3 text-sm text-dark focus:outline-none focus:border-olive"
                />
              ))}
              <div className="flex gap-3">
                <button onClick={addAddress} className="flex items-center gap-2 bg-olive text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-olive/80 transition-colors">
                  <Save size={14} /> Save Address
                </button>
                <button onClick={() => setShowAddAddr(false)} className="flex items-center gap-2 bg-cream text-dark text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-olive/10 transition-colors">
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddAddr(true)}
              className="flex items-center gap-2 w-full bg-cream border border-dashed border-olive/30 rounded-2xl p-5 text-sm font-medium text-dark/50 hover:text-dark hover:border-olive transition-colors"
            >
              <Plus size={16} className="text-olive" />
              Add New Address
            </button>
          )}
        </div>
      )}
    </main>
  );
}

