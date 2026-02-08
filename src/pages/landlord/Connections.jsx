import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiPhone, FiMail, FiCalendar, FiHome, FiSearch } from 'react-icons/fi';
import { getLandlordConnections } from '../../services/propertyService';

const formatPrice = (amount) => new Intl.NumberFormat('en-NG').format(amount);

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterProperty, setFilterProperty] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getLandlordConnections();
        setConnections(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load connections:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const propertyNames = [...new Set(connections.map(c => c.property_name))];

  const filtered = connections.filter(c => {
    const matchesSearch = !search || c.tenant_name.toLowerCase().includes(search.toLowerCase()) || c.tenant_email.toLowerCase().includes(search.toLowerCase());
    const matchesProperty = filterProperty === 'all' || c.property_name === filterProperty;
    return matchesSearch && matchesProperty;
  });

  const totalEarnings = connections.reduce((sum, c) => sum + (c.amount_paid || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Connections</h1>
        <p className="text-gray-500 text-sm mt-1">Tenants who paid to connect with you</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
            <FiUsers className="text-primary-500 text-lg" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{connections.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Connections</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
            <FiHome className="text-green-600 text-lg" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{propertyNames.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Properties Connected</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
            <FiCalendar className="text-blue-600 text-lg" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{'\u20A6'}{formatPrice(totalEarnings)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Connection Fees</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tenant name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
          </div>
          <select
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer"
          >
            <option value="all">All Properties</option>
            {propertyNames.map(name => (
              <option key={name} value={name}>{name.length > 40 ? name.slice(0, 40) + '...' : name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Connections List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUsers className="text-2xl text-gray-400" />
          </div>
          <h3 className="font-bold text-navy-900 mb-2">
            {search || filterProperty !== 'all' ? 'No matching connections' : 'No connections yet'}
          </h3>
          <p className="text-gray-500 text-sm">
            {search || filterProperty !== 'all' ? 'Try a different search or filter' : 'When tenants pay to connect with your properties, they will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((conn, index) => (
            <motion.div
              key={conn.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Avatar & Name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary-500">{conn.tenant_name?.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-navy-900 truncate">{conn.tenant_name}</p>
                    <p className="text-xs text-gray-500 truncate">{conn.property_name}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <a href={`tel:${conn.tenant_phone}`} className="flex items-center gap-1.5 text-gray-600 hover:text-primary-500 no-underline">
                    <FiPhone className="text-xs" /> {conn.tenant_phone}
                  </a>
                  <a href={`mailto:${conn.tenant_email}`} className="flex items-center gap-1.5 text-gray-600 hover:text-primary-500 no-underline">
                    <FiMail className="text-xs" /> {conn.tenant_email}
                  </a>
                </div>

                {/* Date & Amount */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-medium text-green-600">{'\u20A6'}{formatPrice(conn.amount_paid)}</p>
                  <p className="text-xs text-gray-500">{new Date(conn.payment_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Connections;
