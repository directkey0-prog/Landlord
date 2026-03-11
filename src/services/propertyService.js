// =============================================================================
// Landlord Property Service
// Backend URL is read from VITE_BACKEND_URL in .env
// =============================================================================

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

const getToken = () => localStorage.getItem('landlord_token') || '';

const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || `Error: ${response.status}`);
  }
  return data;
};

export const getLandlordProperties = async () => {
  return apiCall('/properties/landlord/my');
};

export const getPropertyById = async (id) => {
  const response = await fetch(`${API_BASE}/properties/${id}`);
  return response.json();
};

export const createProperty = async (data) => {
  return apiCall('/properties', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateProperty = async (id, data) => {
  return apiCall(`/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteProperty = async (id) => {
  return apiCall(`/properties/${id}`, {
    method: 'DELETE',
  });
};

export const getLandlordConnections = async () => {
  return apiCall('/payments/landlord/connections');
};

export const getLandlordStats = async () => {
  const properties = await getLandlordProperties();
  const arr = Array.isArray(properties) ? properties : [];
  return {
    total: arr.length,
    approved: arr.filter(p => p.status === 'approved').length,
    pending: arr.filter(p => p.status === 'pending').length,
    rejected: arr.filter(p => p.status === 'rejected').length,
    totalViews: arr.reduce((sum, p) => sum + (p.views_count || 0), 0),
    totalConnections: arr.reduce((sum, p) => sum + (p.connections_count || 0), 0),
  };
};
