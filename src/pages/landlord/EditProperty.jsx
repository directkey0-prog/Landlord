import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheck, FiArrowLeft } from 'react-icons/fi';
import { getPropertyById, updateProperty } from '../../services/propertyService';
import { nigeriaStates, stateLGAs } from '../../services/locationService';
import ImageUploader from '../../components/ImageUploader';
import toast from 'react-hot-toast';
import { APARTMENT_SUB_TYPES } from '../../utils/propertyTypes';

const allAmenities = [
  '24hr Security', 'Parking Space', 'Water Supply', 'Electricity', 'Fitted Kitchen',
  'Swimming Pool', 'Gym', 'Internet', 'Furnished', 'Elevator', 'BQ', 'Garden',
  'Security Gate', 'Gated Community', 'Concierge', 'Smart Home', 'CCTV', 'Generator',
];

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [locationData, setLocationData] = useState({ lgas: [] });
  const [errors, setErrors] = useState({});

  const isLand = form?.property_category === 'land';
  const isApartment = form?.property_category === 'apartment_type';

  useEffect(() => {
    const load = async () => {
      try {
        const property = await getPropertyById(id);
        if (!property) {
          toast.error('Property not found');
          navigate('/my-properties');
          return;
        }
        setForm({
          property_name: property.property_name || '',
          description: property.description || '',
          property_category: property.property_category || '',
          apartment_sub_type: property.apartment_sub_type || '',
          bedrooms: String(property.bedrooms || ''),
          bathrooms: String(property.bathrooms || ''),
          price_per_year: String(property.price_per_year || ''),
          land_area: String(property.land_area || ''),
          land_unit: property.land_unit || 'sqm',
          state: property.state || '',
          local_government: property.local_government || '',
          area: property.area || '',
          amenities: property.amenities || [],
        });
        const imgs = (property.property_images || []).map(i => ({
          preview: i.image_url,
          image_url: i.image_url,
          name: 'existing',
        }));
        setUploadedImages(imgs);
        if (property.state) {
          setLocationData({ lgas: stateLGAs[property.state] || [] });
        }
      } catch (err) {
        toast.error('Failed to load property');
        navigate('/my-properties');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!form) return;
    if (form.state) {
      setLocationData({ lgas: stateLGAs[form.state] || [] });
    }
  }, [form?.state]);

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
    if (!isLand && !form.bedrooms) errs.bedrooms = 'Required';
    if (!isLand && !form.bathrooms) errs.bathrooms = 'Required';
    if (!form.price_per_year || parseInt(form.price_per_year) <= 0) errs.price_per_year = 'Enter a valid price';
    if (isLand && (!form.land_area || parseFloat(form.land_area) <= 0)) errs.land_area = 'Enter a valid land size';
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
    setSaving(true);
    try {
      const imageList = uploadedImages.length > 0
        ? uploadedImages.map(img => img.preview || img.image_url)
        : ['https://picsum.photos/seed/edit/800/600'];
      await updateProperty(id, {
        ...form,
        property_category: form.property_category,
        apartment_sub_type: isApartment ? form.apartment_sub_type : null,
        bedrooms: isLand ? 0 : parseInt(form.bedrooms),
        bathrooms: isLand ? 0 : parseInt(form.bathrooms),
        price_per_year: parseInt(form.price_per_year),
        land_area: isLand ? parseFloat(form.land_area) : null,
        land_unit: isLand ? form.land_unit : null,
        amenities: isLand ? [] : form.amenities,
        property_images: imageList.map(url => ({ image_url: url })),
      });
      toast.success('Property updated successfully!');
      navigate('/my-properties');
    } catch (err) {
      toast.error('Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
      errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`;

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/my-properties')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy-900 mb-4 bg-transparent border-0 cursor-pointer">
        <FiArrowLeft /> Back to My Properties
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Edit Property</h1>
        <p className="text-gray-500 text-sm mt-1">Update your property details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-navy-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Name *</label>
              <input type="text" value={form.property_name} onChange={(e) => updateField('property_name', e.target.value)} className={inputClass('property_name')} />
              {errors.property_name && <p className="text-xs text-red-500 mt-1">{errors.property_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
              <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={4} className={inputClass('description')} />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Category *</label>
              <div className="flex gap-3">
                {[
                  { value: 'apartment_type', label: 'Apartment Type' },
                  { value: 'land', label: 'Land' },
                ].map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => updateField('property_category', cat.value)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border cursor-pointer ${
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

            {/* Bedrooms & Bathrooms */}
            {!isLand && (
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
                {isLand ? 'Asking Price' : 'Price Per Year'} ({'\u20A6'}) *
              </label>
              <input type="number" value={form.price_per_year} onChange={(e) => updateField('price_per_year', e.target.value)} placeholder={isLand ? 'e.g., 25000000' : 'e.g., 2500000'} className={inputClass('price_per_year')} />
              {errors.price_per_year && <p className="text-xs text-red-500 mt-1">{errors.price_per_year}</p>}
            </div>

            {/* Land Size */}
            {isLand && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Land Size *</label>
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">LGA *</label>
                <select value={form.local_government} onChange={(e) => updateField('local_government', e.target.value)} disabled={!form.state} className={inputClass('local_government')}>
                  <option value="">Select LGA</option>
                  {locationData.lgas.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
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

        {/* Amenities — not for Land */}
        {!isLand && (
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
                      selected ? 'bg-primary-50 border-primary-400 text-primary-600' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
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
          <button type="button" onClick={() => navigate('/my-properties')} className="px-6 py-3.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all bg-white cursor-pointer">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="flex-1 bg-primary-400 hover:bg-primary-500 text-white py-3.5 rounded-xl font-semibold transition-all border-0 cursor-pointer text-sm disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;
