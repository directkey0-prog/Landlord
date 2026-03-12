import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMail } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

const subjects = [
  'Property Listing Issue',
  'Account Problem',
  'Payment Question',
  'Feature Request',
  'Report a Bug',
  'Other',
];

const ContactAdmin = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    subject: '',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.full_name || '',
          email: user?.email || '',
          phone: user?.phone_number || '',
          subject: form.subject,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      setSent(true);
      toast.success('Message sent to admin!');
    } catch (err) {
      toast.error(err.message || 'Could not send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-sm p-12 text-center"
        >
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMail className="text-2xl text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-navy-900 mb-2">Message Sent!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Our admin team will review your message and respond within 24 hours.
          </p>
          <button
            onClick={() => { setSent(false); setForm({ subject: '', message: '' }); }}
            className="bg-primary-400 hover:bg-primary-500 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all border-0 cursor-pointer"
          >
            Send Another Message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Contact Admin</h1>
        <p className="text-gray-500 text-sm mt-1">Send a message to the DirectKey admin team</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
          <input
            type="text"
            value={user?.full_name || ''}
            disabled
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
          <select
            value={form.subject}
            onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent cursor-pointer"
          >
            <option value="">Select a subject</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
            rows={5}
            placeholder="Describe your issue or question..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-400 hover:bg-primary-500 text-white py-3.5 rounded-xl font-semibold transition-all border-0 cursor-pointer text-sm disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <FiSend />
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactAdmin;
