import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { Settings as SettingsIcon, Save, Globe, Lock } from 'lucide-react';

const Settings = ({ token }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [data, setData] = useState({
    siteTitle: '', siteEmail: '', sitePhone: '', siteAddress: '',
    currency: 'GBP', deliveryCharge: 10, freeDeliveryOver: 100,
    returnPolicy: 30, maintenanceMode: false,
    primaryColor: '#2563eb', secondaryColor: '#4f46e5',
    logoUrl: '', fontFamily: 'Inter'
  });

  useEffect(() => { fetchSettings(); }, [token]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/admin/settings`, { headers: { token } });
      if (res.data.success) {
        const s = res.data.settings;
        setData(prev => ({ ...prev,
          siteTitle: s.siteTitle || '', siteEmail: s.siteEmail || '',
          sitePhone: s.sitePhone || '', siteAddress: s.siteAddress || '',
          currency: s.currency || 'GBP', deliveryCharge: s.deliveryCharge ?? 10,
          freeDeliveryOver: s.freeDeliveryOver ?? 100, returnPolicy: s.returnPolicy ?? 30,
          maintenanceMode: s.maintenanceMode || false,
          primaryColor: s.primaryColor || '#2563eb', secondaryColor: s.secondaryColor || '#4f46e5',
          logoUrl: s.logoUrl || '', fontFamily: s.fontFamily || 'Inter'
        }));
      }
    } catch (e) { console.error(e); toast.error('Failed to load settings'); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await axios.put(`${backendUrl}/api/admin/settings`, data, { headers: { token } });
      if (res.data.success) {
        toast.success('Settings saved');
        document.documentElement.style.setProperty('--color-primary', data.primaryColor);
        document.documentElement.style.setProperty('--color-secondary', data.secondaryColor);
        document.documentElement.style.setProperty('--font-family', data.fontFamily);
      } else toast.error(res.data.message || 'Failed to save');
    } catch (e) { console.error(e); toast.error('Failed to save settings'); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    try {
      setPasswordSaving(true);
      const res = await axios.post(
        `${backendUrl}/api/user/admin/change-password`,
        { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(res.data.message || 'Failed to change password');
      }
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'password', label: 'Password', icon: Lock }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-500">Manage your store settings and preferences</p>
        </div>
        {data.siteEmail && (
          <div className="bg-blue-50 px-4 py-3 rounded-xl">
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Admin Email</p>
            <p className="text-blue-900 font-bold">{data.siteEmail}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-medium text-sm transition-all ${
                activeTab === t.id ? 'bg-white text-blue-600 border-t border-l border-r border-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}>
              <Icon size={18} /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
        {activeTab === 'general' && (
          <>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg"><SettingsIcon className="text-blue-600" size={24} /></div>
              <h2 className="text-xl font-bold text-slate-900">General Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Site Title</label>
                <input type="text" name="siteTitle" value={data.siteTitle} onChange={handleChange} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Contact Email</label>
                <input type="email" name="siteEmail" value={data.siteEmail} onChange={handleChange} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                <input type="text" name="sitePhone" value={data.sitePhone} onChange={handleChange} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
                <input type="text" name="siteAddress" value={data.siteAddress} onChange={handleChange} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Currency</label>
                <select name="currency" value={data.currency} onChange={handleChange} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none bg-white">
                  <option value="GBP">GBP (&pound;)</option><option value="USD">USD ($)</option><option value="EUR">EUR (&euro;)</option>
                </select></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Standard Delivery Charge</label>
                <input type="number" name="deliveryCharge" value={data.deliveryCharge} onChange={handleChange} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Free Delivery Over</label>
                <input type="number" name="freeDeliveryOver" value={data.freeDeliveryOver} onChange={handleChange} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Return Window (days)</label>
                <input type="number" name="returnPolicy" value={data.returnPolicy} onChange={handleChange} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none" /></div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="maintenanceMode" checked={data.maintenanceMode} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <div><p className="font-medium text-slate-900">Maintenance Mode</p><p className="text-sm text-slate-500">Show maintenance page to visitors</p></div>
            </div>
          </>
        )}

        {activeTab === 'password' && (
          <>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg"><Lock className="text-purple-600" size={24} /></div>
              <h2 className="text-xl font-bold text-slate-900">Change Password</h2>
            </div>
            <div className="space-y-4 max-w-xl">
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none" /></div>
              <p className="text-sm text-slate-500">Password must be at least 8 characters long.</p>
            </div>
          </>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-100">
          {activeTab === 'general' && (
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60">
              <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
          {activeTab === 'password' && (
            <button onClick={handleChangePassword} disabled={passwordSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60">
              <Lock size={20} /> {passwordSaving ? 'Changing...' : 'Change Password'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

