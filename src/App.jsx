import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import Login from './pages/landlord/Login';
import Signup from './pages/landlord/Signup';
import ForgotPassword from './pages/landlord/ForgotPassword';
import Dashboard from './pages/landlord/Dashboard';
import MyProperties from './pages/landlord/MyProperties';
import AddProperty from './pages/landlord/AddProperty';
import EditProperty from './pages/landlord/EditProperty';
import Connections from './pages/landlord/Connections';
import ContactAdmin from './pages/landlord/ContactAdmin';
import Profile from './pages/landlord/Profile';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Sidebar />
      <main className="lg:ml-64 flex-1 p-6 pt-16 lg:pt-6">
        <Outlet />
      </main>
      <div className="lg:ml-64">
        <Footer />
      </div>
    </div>
  );
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '12px', fontSize: '14px' } }} />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

          {/* Protected routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-properties" element={<MyProperties />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/edit-property/:id" element={<EditProperty />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/contact-admin" element={<ContactAdmin />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <BackToTop />
      </AuthProvider>
    </Router>
  );
}

export default App;
