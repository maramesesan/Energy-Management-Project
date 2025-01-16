import axios from 'axios';

export const getPersons = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`http://user.localhost/person`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
    return response.data;
  } catch (error) {
    console.error('Error fetching persons:', error);
    throw error;
  }
};

export const getPersonById = async (id) => {
  const token = localStorage.getItem('token'); 

  const response = await axios.get(`http://user.localhost/person/${id}`, {
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

  const response = await axios.patch(`http://user.localhost/person/update/name/${id}`, updateData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
);
  return response.data;
};

export const updateUsername = async (id, updateData) => {
  const token = localStorage.getItem('token'); 

  const response = await axios.patch(`http://user.localhost/person/update/username/${id}`, updateData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
);
  return response.data;
};

export const updatePassword = async (id, updateData) => {
  const token = localStorage.getItem('token'); 

  const response = await axios.patch(`http://user.localhost/person/update/password/${id}`, updateData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
);
  return response.data;
};

export const updateEmail = async (id, updateData) => {
  const token = localStorage.getItem('token'); 

  const response = await axios.patch(`http://user.localhost/person/update/email/${id}`, updateData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
);
  return response.data;
};


export const linkDeviceToPerson = async (personId, deviceId) => {
  const token = localStorage.getItem('token'); 

  const response = await axios.post(`http://user.localhost/person/${personId}/link-device`, {
      body: deviceId,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
  });
  return response.data;
};

export const deleteDeviceLinking = async (deviceId) => {
  const token = localStorage.getItem('token'); 

  const response = await axios.delete(`http://user.localhost/person/delete-device`, {
    data: { body: deviceId },
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const deletePersonLinking = async (personId) => {
  const token = localStorage.getItem('token'); 

  const response = await axios.delete(`http://user.localhost/person/delete-person`, {
    headers: { 'Content-Type': 'application/json' },
    data: { body: personId },
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};


export const deletePerson = async (id) => {
  const token = localStorage.getItem('token'); 

  const response = await axios.delete(`http://user.localhost/person/delete/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
);
  return response.data;
};

export async function getDevicesByPersonId(personId) {
  const token = localStorage.getItem('token'); 

      const response = await axios.get(`http://user.localhost/person/${personId}/devices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
      return response.data;
}
