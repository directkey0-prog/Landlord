import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiHome } from 'react-icons/fi';
import { createProperty } from '../../services/propertyService';
import ImageUploader from '../../components/ImageUploader';
import { nigeriaStates, stateLGAs } from '../../services/locationService';
import toast from 'react-hot-toast';

const propertyTypes = ['Apartment', 'Duplex', 'Bungalow', 'Semi-Detached', 'Penthouse', 'Studio'];
const allAmenities = [
  '24hr Security', 'Parking Space', 'Water Supply', 'Electricity', 'Fitted Kitchen',
  'Swimming Pool', 'Gym', 'Internet', 'Furnished', 'Elevator', 'BQ', 'Garden',
  'Security Gate', 'Gated Community', 'Concierge', 'Smart Home', 'CCTV', 'Generator',
];

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    property_name: '',
    description: '',
    property_type: '',
    bedrooms: '',
    bathrooms: '',
    price_per_year: '',
    state: '',
    local_government: '',
    area: '',
    amenities: [],
    images: [],
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [locationData, setLocationData] = useState({ lgas: [] });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (form.state) {
      setLocationData({ lgas: stateLGAs[form.state] || [] });
      setForm(prev => ({ ...prev, local_government: '', area: '' }));
    }
  }, [form.state]);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const toggleAmenity = (amenity) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.property_name.trim()) errs.property_name = 'Required';
    if (!form.description.trim()) errs.description = 'Required';
    if (!form.property_type) errs.property_type = 'Required';
    if (!form.bedrooms) errs.bedrooms = 'Required';
    if (!form.bathrooms) errs.bathrooms = 'Required';
    if (!form.price_per_year || parseInt(form.price_per_year) <= 0) errs.price_per_year = 'Enter a valid price';
    if (!form.state) errs.state = 'Required';
    if (!form.local_government) errs.local_government = 'Required';
    if (!form.area) errs.area = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const imageList = uploadedImages.length > 0
        ? uploadedImages.map(img => img.preview || img.image_url)
        : ['https://picsum.photos/seed/new/800/600'];
      await createProperty({
        ...form,
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
        price_per_year: parseInt(form.price_per_year),
        images: imageList,
      });
      toast.success('Property submitted for review!');
      navigate('/my-properties');
    } catch (err) {
      toast.error('Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
      errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Add New Property</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details to list your property. It will be reviewed before going live.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-navy-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Name *</label>
              <input
                type="text"
                value={form.property_name}
                onChange={(e) => updateField('property_name', e.target.value)}
                placeholder="e.g., Luxury 3-Bedroom Apartment in Lekki"
                className={inputClass('property_name')}
              />
              {errors.property_name && <p className="text-xs text-red-500 mt-1">{errors.property_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                placeholder="Describe your property, features, and surroundings..."
                className={inputClass('description')}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Type *</label>
                <select value={form.property_type} onChange={(e) => updateField('property_type', e.target.value)} className={inputClass('property_type')}>
                  <option value="">Select type</option>
                  {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.property_type && <p className="text-xs text-red-500 mt-1">{errors.property_type}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bedrooms *</label>
                <select value={form.bedrooms} onChange={(e) => updateField('bedrooms', e.target.value)} className={inputClass('bedrooms')}>
                  <option value="">Select</option>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                {errors.bedrooms && <p className="text-xs text-red-500 mt-1">{errors.bedrooms}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bathrooms *</label>
                <select value={form.bathrooms} onChange={(e) => updateField('bathrooms', e.target.value)} className={inputClass('bathrooms')}>
                  <option value="">Select</option>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                {errors.bathrooms && <p className="text-xs text-red-500 mt-1">{errors.bathrooms}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Per Year ({'\u20A6'}) *</label>
              <input
                type="number"
                value={form.price_per_year}
                onChange={(e) => updateField('price_per_year', e.target.value)}
                placeholder="e.g., 2500000"
                className={inputClass('price_per_year')}
              />
              {errors.price_per_year && <p className="text-xs text-red-500 mt-1">{errors.price_per_year}</p>}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-navy-900 mb-4">Location</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                <select value={form.state} onChange={(e) => updateField('state', e.target.value)} className={inputClass('state')}>
                  <option value="">Select state</option>
                  {nigeriaStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">LGA *</label>
                <select value={form.local_government} onChange={(e) => updateField('local_government', e.target.value)} disabled={!form.state} className={inputClass('local_government')}>
                  <option value="">Select LGA</option>
                  {locationData.lgas.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.local_government && <p className="text-xs text-red-500 mt-1">{errors.local_government}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Area / Neighbourhood *</label>
              <textarea
                value={form.area}
                onChange={(e) => updateField('area', e.target.value)}
                rows={3}
                maxLength={200}
                placeholder="e.g., Lekki Phase 1, Ikeja GRA, Ajah, Victoria Island..."
                className={inputClass('area')}
              />
              {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area}</p>}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-navy-900 mb-2">Property Images</h2>
          <p className="text-sm text-gray-500 mb-4">Upload images of your property</p>
          <ImageUploader images={uploadedImages} onChange={setUploadedImages} />
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-navy-900 mb-4">Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allAmenities.map((amenity) => {
              const selected = form.amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border cursor-pointer ${
                    selected
                      ? 'bg-primary-50 border-primary-400 text-primary-600'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {selected ? <FiCheck className="text-primary-400" /> : <div className="w-4" />}
                  {amenity}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/my-properties')}
            className="px-6 py-3.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all bg-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-400 hover:bg-primary-500 text-white py-3.5 rounded-xl font-semibold transition-all border-0 cursor-pointer text-sm disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit Property for Review'}
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center">Your property will be reviewed by our admin team before being published on the platform.</p>
      </form>
    </div>
  );
};

export default AddProperty;
