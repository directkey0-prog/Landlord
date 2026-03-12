import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiHome, FiAlertCircle } from 'react-icons/fi';
import { createProperty } from '../../services/propertyService';
import ImageUploader from '../../components/ImageUploader';
import { nigeriaStates, stateLGAs } from '../../services/locationService';
import toast from 'react-hot-toast';
import { APARTMENT_SUB_TYPES, LANDLORD_CATEGORIES } from '../../utils/propertyTypes';

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
    property_category: '',
    apartment_sub_type: '',
    bedrooms: '',
    bathrooms: '',
    price_per_year: '',
    land_area: '',
    land_unit: 'sqm',
    state: '',
    local_government: '',
    area: '',
    amenities: [],
    images: [],
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [locationData, setLocationData] = useState({ lgas: [] });
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  const isLand = form.property_category === 'land';
  const isShop = form.property_category === 'shop';
  const isApartment = form.property_category === 'apartment_type';

  useEffect(() => {
    if (form.state) {
      setLocationData({ lgas: stateLGAs[form.state] || [] });
      setForm(prev => ({ ...prev, local_government: '', area: '' }));
    }
  }, [form.state]);

  const updateField = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'property_category') next.apartment_sub_type = '';
      return next;
    });
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
    if (!form.property_category) errs.property_category = 'Required';
    if (isApartment && !form.apartment_sub_type) errs.apartment_sub_type = 'Required';
    if (!isLand && !isShop && !form.bedrooms) errs.bedrooms = 'Required';
    if (!isLand && !isShop && !form.bathrooms) errs.bathrooms = 'Required';
    if (!form.price_per_year || parseInt(form.price_per_year) <= 0) errs.price_per_year = 'Enter a valid price';
    if ((isLand || isShop) && (!form.land_area || parseFloat(form.land_area) <= 0)) errs.land_area = 'Enter a valid size';
    if (!form.state) errs.state = 'Required';
    if (!form.local_government) errs.local_government = 'Required';
    if (!form.area) errs.area = 'Required';
    const doneImages = uploadedImages.filter(img => img.status === 'done');
    if (doneImages.length === 0) errs.images = 'At least one image is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill in all required fields');
      setTimeout(() => document.querySelector('.border-red-300')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    const anyUploading = uploadedImages.some(img => img.status === 'uploading');
    if (anyUploading) {
      toast.error('Please wait for images to finish uploading');
      return;
    }
    setShowConfirm(false);
    setLoading(true);
    try {
      const doneImages = uploadedImages.filter(img => img.status === 'done').map(img => img.url);
      const imageList = doneImages.length > 0
        ? doneImages
        : ['https://picsum.photos/seed/new/800/600'];
      await createProperty({
        ...form,
        property_category: form.property_category,
        apartment_sub_type: isApartment ? form.apartment_sub_type : null,
        bedrooms: (isLand || isShop) ? 0 : parseInt(form.bedrooms),
        bathrooms: (isLand || isShop) ? 0 : parseInt(form.bathrooms),
        price_per_year: parseInt(form.price_per_year),
        land_area: (isLand || isShop) ? parseFloat(form.land_area) : null,
        land_unit: (isLand || isShop) ? form.land_unit : null,
        amenities: isLand ? [] : form.amenities,
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

  const categoryLabel = LANDLORD_CATEGORIES.find(c => c.value === form.property_category)?.label || form.property_category;

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

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Category *</label>
              <div className="flex flex-wrap gap-3">
                {LANDLORD_CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => updateField('property_category', cat.value)}
                    className={`flex-1 min-w-[120px] py-3 rounded-xl text-sm font-medium transition-all border cursor-pointer ${
                      form.property_category === cat.value
                        ? 'bg-primary-50 border-primary-400 text-primary-600'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              {errors.property_category && <p className="text-xs text-red-500 mt-1">{errors.property_category}</p>}
            </div>

            {/* Apartment Sub-type */}
            {isApartment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Apartment Type *</label>
                <select
                  value={form.apartment_sub_type}
                  onChange={(e) => updateField('apartment_sub_type', e.target.value)}
                  className={inputClass('apartment_sub_type')}
                >
                  <option value="">Select apartment type</option>
                  {APARTMENT_SUB_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                {errors.apartment_sub_type && <p className="text-xs text-red-500 mt-1">{errors.apartment_sub_type}</p>}
              </div>
            )}

            {/* Bedrooms & Bathrooms — not for land or shop */}
            {!isLand && !isShop && (
              <div className="grid grid-cols-2 gap-4">
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
            )}

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {isLand ? 'Asking Price' : isShop ? 'Annual Rent' : 'Price Per Year'} ({'\u20A6'}) *
              </label>
              <input
                type="number"
                value={form.price_per_year}
                onChange={(e) => updateField('price_per_year', e.target.value)}
                placeholder={isLand ? 'e.g., 25000000' : 'e.g., 2500000'}
                className={inputClass('price_per_year')}
              />
              {errors.price_per_year && <p className="text-xs text-red-500 mt-1">{errors.price_per_year}</p>}
            </div>

            {/* Land / Shop Size */}
            {(isLand || isShop) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isShop ? 'Floor Area *' : 'Land Size *'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={form.land_area}
                    onChange={(e) => updateField('land_area', e.target.value)}
                    placeholder="e.g., 500"
                    min="0"
                    className={`flex-1 ${inputClass('land_area')}`}
                  />
                  <select
                    value={form.land_unit}
                    onChange={(e) => updateField('land_unit', e.target.value)}
                    className="w-32 px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    <option value="sqm">sqm</option>
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                    <option value="plots">Plots</option>
                  </select>
                </div>
                {errors.land_area && <p className="text-xs text-red-500 mt-1">{errors.land_area}</p>}
              </div>
            )}
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
        <div className={`bg-white rounded-2xl shadow-sm p-6 ${errors.images ? 'ring-1 ring-red-300' : ''}`}>
          <h2 className="font-bold text-navy-900 mb-2">Property Images *</h2>
          <p className="text-sm text-gray-500 mb-4">Upload images of your property</p>
          <ImageUploader images={uploadedImages} onChange={(imgs) => { setUploadedImages(imgs); if (errors.images) setErrors(prev => ({ ...prev, images: '' })); }} />
          {errors.images && <p className="text-xs text-red-500 mt-2">{errors.images}</p>}
        </div>

        {/* Amenities — not for Land */}
        {!isLand && !isShop && (
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
        )}

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

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                  <FiAlertCircle className="text-primary-400 text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-navy-900">Confirm Submission</h3>
                  <p className="text-xs text-gray-500">Review details before submitting</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-navy-900 text-right max-w-[60%]">{form.property_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-navy-900">{categoryLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium text-navy-900">{form.area}, {form.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{isLand ? 'Asking Price' : 'Annual Rent'}</span>
                  <span className="font-medium text-navy-900">{'\u20A6'}{Number(form.price_per_year).toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-4">
                Your property will be reviewed by the admin team before going live.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 bg-white cursor-pointer transition-all"
                >
                  Go Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold bg-primary-400 hover:bg-primary-500 text-white border-0 cursor-pointer transition-all disabled:opacity-60"
                >
                  {loading ? 'Submitting...' : 'Yes, Submit'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddProperty;
