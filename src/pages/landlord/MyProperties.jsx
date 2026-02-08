import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiPlus, FiEdit2, FiTrash2, FiEye, FiUsers, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { getLandlordProperties, deleteProperty } from '../../services/propertyService';
import toast from 'react-hot-toast';

const formatPrice = (amount) => {
  if (!amount) return '0';
  return new Intl.NumberFormat('en-NG').format(amount);
};

const statusConfig = {
  approved: { label: 'Approved', bg: 'bg-green-100 text-green-700' },
  pending: { label: 'Pending', bg: 'bg-yellow-100 text-yellow-700' },
  rejected: { label: 'Rejected', bg: 'bg-red-100 text-red-700' },
};

const MyProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const data = await getLandlordProperties();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      toast.success('Property deleted successfully');
    } catch (err) {
      toast.error('Failed to delete property');
    } finally {
      setDeleting(false);
      setDeleteModal(null);
    }
  };

  const filtered = properties.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = !search || p.property_name.toLowerCase().includes(search.toLowerCase()) || p.area?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: properties.length,
    approved: properties.filter(p => p.status === 'approved').length,
    pending: properties.filter(p => p.status === 'pending').length,
    rejected: properties.filter(p => p.status === 'rejected').length,
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'approved', label: 'Approved' },
    { key: 'pending', label: 'Pending' },
    { key: 'rejected', label: 'Rejected' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">My Properties</h1>
          <p className="text-gray-500 text-sm mt-1">{properties.length} total properties</p>
        </div>
        <Link
          to="/add-property"
          className="inline-flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all no-underline"
        >
          <FiPlus /> Add Property
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search properties..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border-0 cursor-pointer whitespace-nowrap ${
                  filter === tab.key
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 bg-transparent'
                }`}
              >
                {tab.label} ({counts[tab.key]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-32 h-24 bg-gray-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiHome className="text-2xl text-gray-400" />
          </div>
          <h3 className="font-bold text-navy-900 mb-2">
            {search ? 'No matching properties' : filter !== 'all' ? `No ${filter} properties` : 'No properties yet'}
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            {search ? 'Try a different search term' : 'Start by adding your first property listing'}
          </p>
          {!search && (
            <Link to="/add-property" className="inline-flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all no-underline">
              <FiPlus /> Add Property
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0 relative">
                    <img
                      src={property.property_images?.[0]?.image_url || 'https://picsum.photos/seed/default/400/300'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[property.status]?.bg || 'bg-gray-100 text-gray-700'}`}>
                      {statusConfig[property.status]?.label || property.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-bold text-navy-900 mb-1 truncate">{property.property_name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{property.area}, {property.local_government}, {property.state}</p>
                        <p className="text-lg font-bold text-navy-900">{'\u20A6'}{formatPrice(property.price_per_year)}<span className="text-sm font-normal text-gray-500">/year</span></p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => navigate(`/edit-property/${property.id}`)}
                          className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-primary-50 hover:text-primary-500 flex items-center justify-center transition-all border-0 cursor-pointer text-gray-600"
                          title="Edit"
                        >
                          <FiEdit2 className="text-sm" />
                        </button>
                        <button
                          onClick={() => setDeleteModal(property.id)}
                          className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all border-0 cursor-pointer text-gray-600"
                          title="Delete"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><FiEye /> {property.views_count || 0} views</span>
                      <span className="flex items-center gap-1"><FiUsers /> {property.connections_count || 0} connections</span>
                      <span>{property.property_type}</span>
                      <span>{property.bedrooms} bed / {property.bathrooms} bath</span>
                    </div>

                    {property.status === 'rejected' && property.rejection_reason && (
                      <div className="mt-3 flex items-start gap-2 bg-red-50 rounded-lg p-3">
                        <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-700">{property.rejection_reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !deleting && setDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="text-red-500 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 text-center mb-2">Delete Property</h3>
              <p className="text-sm text-gray-500 text-center mb-6">Are you sure you want to delete this property? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all bg-white cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal)}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-all border-0 cursor-pointer disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyProperties;
