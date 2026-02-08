// Location data for Nigerian states, LGAs, and areas
export const nigeriaStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara'
];

export const stateLGAs = {
  'Lagos': ['Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Port Harcourt', 'Shomolu', 'Surulere'],
  'Abuja': ['Abaji', 'Abuja Municipal', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali'],
  'Kano': ['Ajingi', 'Albasu', 'Bagwai', 'Bebeji', 'Bichi', 'Bunkure', 'Dala', 'Dambatta', 'Dawakin Kudu', 'Dawakin Tofa', 'Doguwa', 'Fagge', 'Gabasawa', 'Garko', 'Garun Mallam', 'Gaya', 'Gezawa', 'Gwale', 'Gwarzo', 'Kabo', 'Kano Municipal', 'Karaye', 'Kibiya', 'Kiru', 'Kumbotso', 'Kunchi', 'Kura', 'Madobi', 'Makoda', 'Minjibir', 'Nasarawa', 'Rano', 'Rimin Gado', 'Rogo', 'Shanono', 'Sumaila', 'Takai', 'Tarauni', 'Tofa', 'Tsanyawa', 'Tudun Wada', 'Ungogo', 'Warawa', 'Wudil']
};

export const lgaAreas = {
  'Lagos': {
    'Ikeja': ['Opebi', 'Allen Avenue', 'GRA Ikeja', 'Oregun', 'Alausa', 'Ipodo'],
    'Lekki': ['Phase 1', 'Phase 2', 'Chevron', 'VGC', 'Ajah', 'Sangotedo'],
    'Victoria Island': ['VI Main', 'Oniru', 'Banana Island', 'Eko Atlantic', 'Adetokunbo Ademola'],
    'Surulere': ['Ojuelegba', 'Adeniran Ogunsanya', 'Western Avenue', 'Aguda', 'Ijesha']
  },
  'Abuja': {
    'Wuse': ['Wuse 1', 'Wuse 2', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7'],
    'Maitama': ['Maitama District', 'Asokoro Extension', 'Diplomatic Zone'],
    'Garki': ['Garki 1', 'Garki 2', 'Area 1', 'Area 2', 'Area 3', 'Area 7', 'Area 8', 'Area 10', 'Area 11']
  }
};

// For backward compatibility
export const getStates = () => Promise.resolve({ data: nigeriaStates });
export const getLGAs = (state) => Promise.resolve({ data: stateLGAs[state] || [] });
export const getAreas = (state, lga) => Promise.resolve({ data: lgaAreas[state]?.[lga] || [] });