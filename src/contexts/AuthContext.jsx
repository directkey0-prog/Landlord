import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock landlord accounts for testing
const mockLandlords = [
  { id: '1', email: 'landlord1@test.com', password: 'Test123!', full_name: 'Chief Adebayo Ogundimu', phone: '+2348034521890' },
  { id: '2', email: 'landlord2@test.com', password: 'Test123!', full_name: 'Alhaji Musa Ibrahim', phone: '+2348091234567' },
  { id: '3', email: 'landlord3@test.com', password: 'Test123!', full_name: 'Mrs. Folake Adeyemi', phone: '+2348055678901' },
  { id: '4', email: 'landlord4@test.com', password: 'Test123!', full_name: 'Dr. Olumide Fashola', phone: '+2348023456789' },
  { id: '5', email: 'landlord5@test.com', password: 'Test123!', full_name: 'Engr. Chukwuemeka Obi', phone: '+2348067890123' },
];

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
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login
    const found = mockLandlords.find(l => l.email === email && l.password === password);
    if (!found) {
      throw new Error('Invalid email or password');
    }
    const userData = { id: found.id, email: found.email, full_name: found.full_name, phone: found.phone, role: 'landlord' };
    setUser(userData);
    localStorage.setItem('landlord_user', JSON.stringify(userData));
    return userData;
  };

  const signup = async (data) => {
    // Mock signup
    const exists = mockLandlords.find(l => l.email === data.email);
    if (exists) {
      throw new Error('Email already registered');
    }
    const userData = {
      id: String(Date.now()),
      email: data.email,
      full_name: data.full_name,
      phone: data.phone,
      role: 'landlord',
    };
    mockLandlords.push({ ...userData, password: data.password });
    setUser(userData);
    localStorage.setItem('landlord_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('landlord_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
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
