import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiArrowLeft } from 'react-icons/fi';
import { getPropertyById, updateProperty } from '../../services/propertyService';
import { nigeriaStates, stateLGAs } from '../../services/locationService';
import toast from 'react-hot-toast';

const propertyTypes = ['Apartment', 'Duplex', 'Bungalow', 'Semi-Detached', 'Penthouse', 'Studio'];
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
  const [imageUrls, setImageUrls] = useState(['', '', '', '']);
  const [locationData, setLocationData] = useState({ lgas: [] });
  const [errors, setErrors] = useState({});

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
          property_type: property.property_type || '',
          bedrooms: String(property.bedrooms || ''),
          bathrooms: String(property.bathrooms || ''),
          price_per_year: String(property.price_per_year || ''),
          state: property.state || '',
          local_government: property.local_government || '',
          area: property.area || '',
          amenities: property.amenities || [],
        });
        const imgs = (property.property_images || []).map(i => i.image_url);
        setImageUrls([...imgs, ...Array(4 - imgs.length).fill('')].slice(0, 4));
        if (property.state) {
          setLocationData({
            lgas: stateLGAs[property.state] || [],
          });
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
    setSaving(true);
    try {
      const validImages = imageUrls.filter(url => url.trim());
      await updateProperty(id, {
        ...form,
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
        price_per_year: parseInt(form.price_per_year),
        property_images: validImages.map(url => ({ image_url: url })),
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Type *</label>
                <select value={form.property_type} onChange={(e) => updateField('property_type', e.target.value)} className={inputClass('property_type')}>
                  <option value="">Select type</option>
                  {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bedrooms *</label>
                <select value={form.bedrooms} onChange={(e) => updateField('bedrooms', e.target.value)} className={inputClass('bedrooms')}>
                  <option value="">Select</option>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bathrooms *</label>
                <select value={form.bathrooms} onChange={(e) => updateField('bathrooms', e.target.value)} className={inputClass('bathrooms')}>
                  <option value="">Select</option>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Per Year ({'\u20A6'}) *</label>
              <input type="number" value={form.price_per_year} onChange={(e) => updateField('price_per_year', e.target.value)} className={inputClass('price_per_year')} />
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
          <p className="text-sm text-gray-500 mb-4">Update image URLs (up to 4)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {imageUrls.map((url, i) => (
              <div key={i}>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => {
                      const updated = [...imageUrls];
                      updated[i] = e.target.value;
                      setImageUrls(updated);
                    }}
                    placeholder={`Image URL ${i + 1}`}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                  {url && (
                    <button type="button" onClick={() => { const u = [...imageUrls]; u[i] = ''; setImageUrls(u); }} className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center border-0 cursor-pointer text-gray-500 flex-shrink-0 mt-0.5">
                      <FiX />
                    </button>
                  )}
                </div>
                {url && <img src={url} alt="" className="mt-2 w-full h-24 object-cover rounded-lg" onError={(e) => { e.target.style.display = 'none'; }} />}
              </div>
            ))}
          </div>
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
