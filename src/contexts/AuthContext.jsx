import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('landlord_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('landlord_user');
        localStorage.removeItem('landlord_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Invalid email or password');

    const token = data.session?.access_token;
    const userData = {
      id: data.user?.id,
      email: data.user?.email,
      full_name: data.user?.user_metadata?.full_name || data.user?.email,
      phone: data.user?.user_metadata?.phone,
      role: data.user?.user_metadata?.role || 'landlord',
    };

    if (token) localStorage.setItem('landlord_token', token);
    localStorage.setItem('landlord_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const signup = async (formData) => {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone,
        role: 'landlord',
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Signup failed');
    return data;
  };

  const forgotPassword = async (email) => {
    const redirectTo = `${window.location.origin}/reset-password`;
    const response = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, redirectTo }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to send reset email');
    return data;
  };

  const resetPassword = async (access_token, refresh_token, new_password) => {
    const response = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token, refresh_token, new_password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to reset password');
    return data;
  };

  const updateProfile = async (full_name, phone) => {
    const token = localStorage.getItem('landlord_token');
    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ full_name, phone }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update profile');
    const updated = { ...user, full_name, phone };
    setUser(updated);
    localStorage.setItem('landlord_user', JSON.stringify(updated));
    return data;
  };

  const changePassword = async (current_password, new_password) => {
    const token = localStorage.getItem('landlord_token');
    const response = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ current_password, new_password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to change password');
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('landlord_user');
    localStorage.removeItem('landlord_token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, forgotPassword, resetPassword, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
