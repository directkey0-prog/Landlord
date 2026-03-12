import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiCheckCircle, FiClock, FiXCircle, FiPlus, FiUsers, FiEye, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { getLandlordProperties, getLandlordConnections } from '../../services/propertyService';

const Dashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propsData, connData] = await Promise.all([
          getLandlordProperties(),
          getLandlordConnections().catch(() => []),
        ]);
        setProperties(Array.isArray(propsData) ? propsData : []);
        setConnectionsCount(Array.isArray(connData) ? connData.length : 0);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    total: properties.length,
    approved: properties.filter(p => p.status === 'approved').length,
    pending: properties.filter(p => p.status === 'pending').length,
    rejected: properties.filter(p => p.status === 'rejected').length,
    totalViews: properties.reduce((sum, p) => sum + (p.views_count || 0), 0),
    connections: connectionsCount,
  };

  const statCards = [
    { label: 'Total Properties', value: stats.total, icon: FiHome, color: 'bg-blue-50 text-blue-600' },
    { label: 'Approved', value: stats.approved, icon: FiCheckCircle, color: 'bg-green-50 text-green-600' },
    { label: 'Pending', value: stats.pending, icon: FiClock, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Connections', value: stats.connections, icon: FiUsers, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900 mb-1">
          Welcome back, {user?.full_name?.split(' ')[0] || 'Landlord'}
        </h1>
        <p className="text-gray-500">Here is an overview of your properties and activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="text-lg" />
            </div>
            <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          to="/add-property"
          className="flex items-center gap-4 bg-gradient-to-r from-primary-400 to-primary-500 rounded-2xl p-6 text-white hover:shadow-lg transition-shadow no-underline"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <FiPlus className="text-xl" />
          </div>
          <div>
            <p className="font-semibold">Add New Property</p>
            <p className="text-sm text-white/80">Create a new property listing</p>
          </div>
        </Link>
        <Link
          to="/my-properties"
          className="flex items-center gap-4 bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-6 text-white hover:shadow-lg transition-shadow no-underline"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <FiEye className="text-xl" />
          </div>
          <div>
            <p className="font-semibold">View My Properties</p>
            <p className="text-sm text-white/80">Manage your existing listings</p>
          </div>
        </Link>
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-navy-900">Recent Properties</h2>
          <Link to="/my-properties" className="text-sm text-primary-500 hover:underline flex items-center gap-1 no-underline">
            View all <FiArrowRight className="text-xs" />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-16 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHome className="text-2xl text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">You have not listed any properties yet</p>
            <Link to="/add-property" className="inline-flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all no-underline">
              <FiPlus /> Add Your First Property
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {properties.slice(0, 5).map((property) => (
              <div key={property.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <img
                  src={property.property_images?.[0]?.image_url || 'https://picsum.photos/seed/default/100/80'}
                  alt=""
                  className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-navy-900 text-sm truncate">{property.property_name}</p>
                  <p className="text-xs text-gray-500">{property.area}, {property.state}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    property.status === 'approved' ? 'bg-green-100 text-green-700' :
                    property.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {property.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{'\u20A6'}{(property.price_per_year || property.monthly_rent * 12)?.toLocaleString()}/yr</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
