import React, { useState } from 'react';
import '../styles/Form.css';
import { useNavigate } from 'react-router-dom';


function DeviceCreation() {
  const [formData, setFormData] = useState({
    name: '',
    details: '',
    address: '',
    energyConsumption: '',
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); 

    try {
      const response = await fetch('http://localhost:8081/device/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          details: formData.details,
          address: formData.address,
          energyConsumption: formData.energyConsumption,
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Device created:', data);
        setSuccessMessage('Successful!');
        setFormData({
            name: '',
            details: '',
            address: '',
            energyConsumption: '',
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create. Please try again.');
      }
    } catch (err) {
      console.error('Error during creation:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Create Device</h1>
      <div className='buttons'>
      <button className='backButton' onClick={() => navigate('/StartPage')}>
          BACK
        </button>

        <button className="backButton" onClick={() => navigate('/device')}>
          SEE ALL DEVICES
        </button>
      </div>
        
      <div className="container-form" >
        <form className="form-1" onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Details</label>
            <input
              type="text"
              name="details"
              placeholder="details"
              value={formData.details}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Energy Consumption</label>
            <input
              type="float"
              name="energyConsumption"
              placeholder="energyConsumption"
              value={formData.energyConsumption}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Create</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </div>
    </div>
  );
}

export default DeviceCreation;
