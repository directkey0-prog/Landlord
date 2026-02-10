import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiKey, FiMail, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    setLoading(true);
    // Mock: simulate sending reset email
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
    toast.success('Password reset link sent!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary-400 rounded-lg flex items-center justify-center">
            <FiKey className="text-white text-xl" />
          </div>
          <span className="text-2xl font-bold text-navy-900">
            Direct<span className="text-primary-400">Key</span>
          </span>
        </div>

        {sent ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMail className="text-2xl text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-navy-900 mb-2">Check Your Email</h1>
            <p className="text-sm text-gray-500 mb-6">
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-primary-500 font-medium text-sm no-underline hover:underline"
            >
              <FiArrowLeft /> Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-navy-900 mb-2">Forgot Password?</h1>
            <p className="text-gray-500 mb-8 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-400 hover:bg-primary-500 text-white py-3.5 rounded-xl font-semibold transition-all border-0 cursor-pointer text-sm disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              <Link to="/login" className="text-primary-500 font-medium no-underline hover:underline inline-flex items-center gap-1">
                <FiArrowLeft className="text-xs" /> Back to Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
