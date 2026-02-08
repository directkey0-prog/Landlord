const USE_DUMMY_DATA = true;
const API_BASE = 'http://localhost:5000/api';

let dummyProperties = [
  {
    id: 'lp1',
    property_name: 'Luxury 3-Bedroom Apartment in Lekki Phase 1',
    description: 'Beautifully finished 3-bedroom apartment with modern fixtures, spacious living area, and 24-hour security. Located in a serene estate with easy access to major roads and shopping centers.',
    property_type: 'Apartment',
    bedrooms: 3,
    bathrooms: 3,
    price_per_year: 4500000,
    state: 'Lagos',
    local_government: 'Eti-Osa',
    area: 'Lekki Phase 1',
    amenities: ['24hr Security', 'Parking Space', 'Water Supply', 'Electricity', 'Fitted Kitchen', 'Swimming Pool'],
    property_images: [
      { image_url: 'https://picsum.photos/seed/lp1a/800/600' },
      { image_url: 'https://picsum.photos/seed/lp1b/800/600' },
      { image_url: 'https://picsum.photos/seed/lp1c/800/600' },
    ],
    status: 'approved',
    views_count: 142,
    connections_count: 8,
    featured: true,
    landlord_id: '1',
    created_at: '2025-12-15T10:30:00Z',
  },
  {
    id: 'lp2',
    property_name: 'Modern 2-Bedroom Flat in Ikeja GRA',
    description: 'Well-maintained 2-bedroom flat in a quiet neighborhood within GRA Ikeja. Features include tiled floors, ample storage, and a dedicated parking spot.',
    property_type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    price_per_year: 2400000,
    state: 'Lagos',
    local_government: 'Ikeja',
    area: 'GRA Ikeja',
    amenities: ['Parking Space', 'Water Supply', 'Electricity', 'Security Gate'],
    property_images: [
      { image_url: 'https://picsum.photos/seed/lp2a/800/600' },
      { image_url: 'https://picsum.photos/seed/lp2b/800/600' },
    ],
    status: 'approved',
    views_count: 89,
    connections_count: 5,
    featured: false,
    landlord_id: '1',
    created_at: '2025-11-20T14:00:00Z',
  },
  {
    id: 'lp3',
    property_name: 'Spacious 4-Bedroom Duplex in Magodo',
    description: 'Impressive 4-bedroom semi-detached duplex in the prestigious Magodo GRA Phase 2 estate. Features a modern kitchen, large compound, BQ, and round-the-clock security.',
    property_type: 'Duplex',
    bedrooms: 4,
    bathrooms: 4,
    price_per_year: 6000000,
    state: 'Lagos',
    local_government: 'Kosofe',
    area: 'Magodo GRA',
    amenities: ['24hr Security', 'Parking Space', 'Water Supply', 'Electricity', 'BQ', 'Fitted Kitchen', 'Garden'],
    property_images: [
      { image_url: 'https://picsum.photos/seed/lp3a/800/600' },
      { image_url: 'https://picsum.photos/seed/lp3b/800/600' },
      { image_url: 'https://picsum.photos/seed/lp3c/800/600' },
    ],
    status: 'pending',
    views_count: 0,
    connections_count: 0,
    featured: false,
    landlord_id: '1',
    created_at: '2026-01-28T09:15:00Z',
  },
  {
    id: 'lp4',
    property_name: 'Executive Studio Apartment in Victoria Island',
    description: 'Compact yet stylish studio apartment perfect for young professionals. Fully furnished with high-speed internet, gym access, and a rooftop lounge.',
    property_type: 'Studio',
    bedrooms: 1,
    bathrooms: 1,
    price_per_year: 3600000,
    state: 'Lagos',
    local_government: 'Eti-Osa',
    area: 'Victoria Island',
    amenities: ['24hr Security', 'Gym', 'Internet', 'Furnished', 'Elevator', 'Water Supply', 'Electricity'],
    property_images: [
      { image_url: 'https://picsum.photos/seed/lp4a/800/600' },
    ],
    status: 'approved',
    views_count: 215,
    connections_count: 12,
    featured: true,
    landlord_id: '1',
    created_at: '2025-10-05T16:45:00Z',
  },
  {
    id: 'lp5',
    property_name: 'Cozy 2-Bedroom Bungalow in Surulere',
    description: 'Affordable 2-bedroom bungalow in the heart of Surulere. Easy access to National Stadium, Adeniran Ogunsanya Shopping Mall, and major bus routes.',
    property_type: 'Bungalow',
    bedrooms: 2,
    bathrooms: 1,
    price_per_year: 1200000,
    state: 'Lagos',
    local_government: 'Surulere',
    area: 'Adeniran Ogunsanya',
    amenities: ['Water Supply', 'Security Gate', 'Parking Space'],
    property_images: [
      { image_url: 'https://picsum.photos/seed/lp5a/800/600' },
      { image_url: 'https://picsum.photos/seed/lp5b/800/600' },
    ],
    status: 'rejected',
    views_count: 0,
    connections_count: 0,
    rejection_reason: 'Incomplete property images. Please upload at least 3 clear photos showing all rooms.',
    featured: false,
    landlord_id: '1',
    created_at: '2026-01-10T11:20:00Z',
  },
  {
    id: 'lp6',
    property_name: 'Premium 5-Bedroom Penthouse in Ikoyi',
    description: 'Ultra-luxury 5-bedroom penthouse with breathtaking views of the Lagos Lagoon. Features a private terrace, smart home technology, and concierge services.',
    property_type: 'Penthouse',
    bedrooms: 5,
    bathrooms: 5,
    price_per_year: 25000000,
    state: 'Lagos',
    local_government: 'Eti-Osa',
    area: 'Ikoyi',
    amenities: ['24hr Security', 'Swimming Pool', 'Gym', 'Elevator', 'Concierge', 'Smart Home', 'Water Supply', 'Electricity', 'Parking Space'],
    property_images: [
      { image_url: 'https://picsum.photos/seed/lp6a/800/600' },
      { image_url: 'https://picsum.photos/seed/lp6b/800/600' },
      { image_url: 'https://picsum.photos/seed/lp6c/800/600' },
      { image_url: 'https://picsum.photos/seed/lp6d/800/600' },
    ],
    status: 'pending',
    views_count: 0,
    connections_count: 0,
    featured: false,
    landlord_id: '1',
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'lp7',
    property_name: '3-Bedroom Semi-Detached in Ajah',
    description: 'Brand new 3-bedroom semi-detached house with modern finishes. Part of a gated community with dedicated security and well-paved roads.',
    property_type: 'Semi-Detached',
    bedrooms: 3,
    bathrooms: 3,
    price_per_year: 3000000,
    state: 'Lagos',
    local_government: 'Eti-Osa',
    area: 'Ajah',
    amenities: ['24hr Security', 'Parking Space', 'Water Supply', 'Electricity', 'Gated Community'],
    property_images: [
      { image_url: 'https://picsum.photos/seed/lp7a/800/600' },
      { image_url: 'https://picsum.photos/seed/lp7b/800/600' },
    ],
    status: 'approved',
    views_count: 67,
    connections_count: 3,
    featured: false,
    landlord_id: '1',
    created_at: '2025-12-01T12:00:00Z',
  },
];

const dummyConnections = [
  { id: 'c1', tenant_name: 'Adaeze Nwosu', tenant_email: 'adaeze@gmail.com', tenant_phone: '+2348012345678', property_id: 'lp1', property_name: 'Luxury 3-Bedroom Apartment in Lekki Phase 1', amount_paid: 15000, payment_date: '2026-01-20T14:30:00Z', status: 'active' },
  { id: 'c2', tenant_name: 'Babatunde Salami', tenant_email: 'baba.salami@yahoo.com', tenant_phone: '+2348098765432', property_id: 'lp1', property_name: 'Luxury 3-Bedroom Apartment in Lekki Phase 1', amount_paid: 15000, payment_date: '2026-01-18T10:15:00Z', status: 'active' },
  { id: 'c3', tenant_name: 'Grace Okoro', tenant_email: 'grace.okoro@gmail.com', tenant_phone: '+2348076543210', property_id: 'lp4', property_name: 'Executive Studio Apartment in Victoria Island', amount_paid: 15000, payment_date: '2026-01-15T09:00:00Z', status: 'active' },
  { id: 'c4', tenant_name: 'Ibrahim Abdullahi', tenant_email: 'ibrahim.a@gmail.com', tenant_phone: '+2348034567890', property_id: 'lp2', property_name: 'Modern 2-Bedroom Flat in Ikeja GRA', amount_paid: 15000, payment_date: '2026-01-12T16:45:00Z', status: 'active' },
  { id: 'c5', tenant_name: 'Chioma Eze', tenant_email: 'chioma.eze@outlook.com', tenant_phone: '+2348023456789', property_id: 'lp4', property_name: 'Executive Studio Apartment in Victoria Island', amount_paid: 15000, payment_date: '2026-01-10T11:30:00Z', status: 'active' },
  { id: 'c6', tenant_name: 'Oluwaseun Dada', tenant_email: 'seun.dada@gmail.com', tenant_phone: '+2348045678901', property_id: 'lp7', property_name: '3-Bedroom Semi-Detached in Ajah', amount_paid: 15000, payment_date: '2026-01-08T13:20:00Z', status: 'active' },
  { id: 'c7', tenant_name: 'Fatima Bello', tenant_email: 'fatima.b@gmail.com', tenant_phone: '+2348056789012', property_id: 'lp1', property_name: 'Luxury 3-Bedroom Apartment in Lekki Phase 1', amount_paid: 15000, payment_date: '2026-01-05T10:00:00Z', status: 'active' },
  { id: 'c8', tenant_name: 'David Okonkwo', tenant_email: 'david.o@yahoo.com', tenant_phone: '+2348067890123', property_id: 'lp2', property_name: 'Modern 2-Bedroom Flat in Ikeja GRA', amount_paid: 15000, payment_date: '2025-12-28T15:10:00Z', status: 'active' },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getLandlordProperties = async () => {
  if (USE_DUMMY_DATA) {
    await delay(600);
    return dummyProperties;
  }
  const res = await fetch(`${API_BASE}/properties/landlord`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('landlord_token')}` },
  });
  return res.json();
};

export const getPropertyById = async (id) => {
  if (USE_DUMMY_DATA) {
    await delay(400);
    return dummyProperties.find(p => p.id === id) || null;
  }
  const res = await fetch(`${API_BASE}/properties/${id}`);
  return res.json();
};

export const createProperty = async (data) => {
  if (USE_DUMMY_DATA) {
    await delay(1000);
    const newProperty = {
      ...data,
      id: 'lp' + Date.now(),
      status: 'pending',
      views_count: 0,
      connections_count: 0,
      featured: false,
      landlord_id: '1',
      created_at: new Date().toISOString(),
      property_images: (data.images || []).map((url) => ({ image_url: url })),
    };
    dummyProperties.unshift(newProperty);
    return newProperty;
  }
  const res = await fetch(`${API_BASE}/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('landlord_token')}` },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateProperty = async (id, data) => {
  if (USE_DUMMY_DATA) {
    await delay(800);
    const index = dummyProperties.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Property not found');
    dummyProperties[index] = { ...dummyProperties[index], ...data };
    return dummyProperties[index];
  }
  const res = await fetch(`${API_BASE}/properties/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('landlord_token')}` },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteProperty = async (id) => {
  if (USE_DUMMY_DATA) {
    await delay(500);
    dummyProperties = dummyProperties.filter(p => p.id !== id);
    return { success: true };
  }
  const res = await fetch(`${API_BASE}/properties/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('landlord_token')}` },
  });
  return res.json();
};

export const getLandlordConnections = async () => {
  if (USE_DUMMY_DATA) {
    await delay(600);
    return dummyConnections;
  }
  const res = await fetch(`${API_BASE}/connections/landlord`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('landlord_token')}` },
  });
  return res.json();
};

export const getLandlordStats = async () => {
  if (USE_DUMMY_DATA) {
    await delay(300);
    return {
      total: dummyProperties.length,
      approved: dummyProperties.filter(p => p.status === 'approved').length,
      pending: dummyProperties.filter(p => p.status === 'pending').length,
      rejected: dummyProperties.filter(p => p.status === 'rejected').length,
      totalViews: dummyProperties.reduce((sum, p) => sum + (p.views_count || 0), 0),
      totalConnections: dummyConnections.length,
    };
  }
  const res = await fetch(`${API_BASE}/landlord/stats`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('landlord_token')}` },
  });
  return res.json();
};
