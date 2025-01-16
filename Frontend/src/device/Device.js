
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDevice, deleteDevice } from '../services/deviceService'; 
import {deleteDeviceLinking  } from '../services/personService';
import '../styles/Table.css';

function Device() {
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        async function fetchDevices() {
            try {
                const deviceData = await getDevice();
                if (Array.isArray(deviceData)) {
                    setDevices(deviceData); 
                } else {
                    setError('Unexpected data format received.');
                }
            } catch (error) {
                setError('Failed to fetch devices data.');
            }
        }
        fetchDevices();
    }, []);

    const handleDeleteDevice = async (id) => {
      try {
          await deleteDeviceLinking(id);  
          await deleteDevice(id);  
  
          alert('Device deleted successfully');
          
          setDevices(devices.filter((device) => device.id !== id));

      } catch (error) {
          console.error('Failed to delete device:', error);
          setError('Failed to delete device.');
      }
  };

    if (error) {
        return <p>{error}</p>; 
    }

    return (
      <div>
        <h1>Devices List</h1>
        <div className="buttons">
        <button className='backButton' onClick={() => navigate('/StartPage')}>
          BACK
        </button>

        <button className='backButton' onClick={() => navigate('/device/create')}>
          CREATE NEW DEVICE
        </button>

        </div>
        

        {devices.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Details</th>
                <th>Address</th>
                <th>Energy Consumption</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id}>
                  <td>{device.name}</td>
                  <td>{device.details}</td>
                  <td>{device.address}</td>
                  <td>{device.energyConsumption}</td>
                  <td className='buttons'>
                    <Link to={`/device/${device.id}`}>
                      <button>Update</button>
                    </Link>
                    <button
                      onClick={() => handleDeleteDevice(device.id)}
                      style={{ marginLeft: '10px', color: 'red' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No devices found.</p>
        )}
      </div>
    );
}

export default Device;
