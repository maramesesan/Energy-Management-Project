import axios from 'axios';

export const getDevice = async () => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.get(`http://device1.localhost/device`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
    return response.data;
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }
};


export const startSimulation = async (id, simNr) => {
  const token = localStorage.getItem('token');

  try {
    console.log(`http://device${simNr}.localhost/device/simulation/${id}`)
    const response = await axios.get(`http://device${simNr}.localhost/device/simulation/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
    console.log(response);
    return response.data;
  } catch (error) {
    alert('Failed to start simulation for device');
    throw error;
  }
};

export const startSimulation2 = async (id) => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`http://device1.localhost/device/simulation/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
);
  return response.data;

};



export const getDeviceById = async (id) => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`http://device1.localhost/device/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
); 
  return response.data;
};


export const updateName = async (id, updateData) => {
  const token = localStorage.getItem('token');

  const response = await axios.patch(`http://device1.localhost/device/update/name/${id}`, updateData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
); 
  return response.data;
};


export const updateAddress = async (id, updateData) => {
  const token = localStorage.getItem('token');

  const response = await axios.patch(`http://device1.localhost/device/update/address/${id}`, updateData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
); 
  return response.data;
};

export const updateDetails = async (id, updateData) => {
  const token = localStorage.getItem('token');

  const response = await axios.patch(`http://device1.localhost/device/update/details/${id}`, updateData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
); 
  return response.data;
};

export const updateEnergyCons = async (id, updateData) => {
  const token = localStorage.getItem('token');

  const response = await axios.patch(`http://device1.localhost/device/update/energy/${id}`, updateData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
); 
  return response.data;
};

export const deleteDevice = async (id) => {
  const token = localStorage.getItem('token');

  const response = await axios.delete(`http://device1.localhost/device/delete/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
); 
  return response.data;
};






