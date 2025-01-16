import axios from 'axios';

export const getSent = async (id) => {
    const token = localStorage.getItem('token'); 
  
    const response = await axios.get(`http://chat.localhost/sent/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
    return response.data;
  };

  export const getReceived = async (id) => {
    const token = localStorage.getItem('token'); 
  
    const response = await axios.get(`http://chat.localhost/received/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
    return response.data;
  };

  export const getMessages = async (idSender, idReceiver) => {
    const token = localStorage.getItem('token'); 
  
    const response = await axios.get(`http://chat.localhost/messages/${idSender}/${idReceiver}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
    return response.data;
  };