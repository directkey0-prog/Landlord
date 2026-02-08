import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiLock, FiSave } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new_password: '',
    confirm: '',
  });
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setSaving(true);
    // Mock save
    await new Promise(r => setTimeout(r, 800));
    toast.success('Profile updated successfully');
    setSaving(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.new_password || !passwordForm.confirm) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.new_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSavingPassword(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success('Password changed successfully');
    setPasswordForm({ current: '', new_password: '', confirm: '' });
    setSavingPassword(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account details</p>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{user?.full_name?.charAt(0) || 'L'}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy-900">{user?.full_name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-primary-50 text-primary-600 text-xs font-medium rounded-full">Landlord</span>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <form onSubmit={handleUpdateProfile} className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-bold text-navy-900 mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-4 inline-flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all border-0 cursor-pointer disabled:opacity-60"
        >
          <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handleChangePassword} className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-navy-900 mb-4">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={savingPassword}
          className="mt-4 inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all border-0 cursor-pointer disabled:opacity-60"
        >
          <FiLock /> {savingPassword ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
