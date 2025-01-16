import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDevicesByPersonId } from '../services/personService'; 
import { getDeviceById, startSimulation, startSimulation2 } from '../services/deviceService'; 
import '../styles/Table.css';
import { useAuth } from '../AuthContext'; 
import WebSocket from './WebSocket'; 
import Chat from '.././chat/Chat';

function DeviceUser() {
  const { authState } = useAuth(); 
  const { id: personId } = useParams(); 
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null); 
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [simulationCounter, setSimulationCounter] = useState(1);

  useEffect(() => {
    const storedCounter = parseInt(localStorage.getItem('simulationCounter'), 10);
    if (!isNaN(storedCounter)) {
      setSimulationCounter(storedCounter);
    } else {
      localStorage.setItem('simulationCounter', 1);
    }
  }, []);

  useEffect(() => {
    setSimulationCounter(1);
    localStorage.setItem('simulationCounter', 1);

    const handleStorageChange = (event) => {
      if (event.key === 'simulationCounter') {
        setSimulationCounter(parseInt(event.newValue, 10));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    setSelectedUserId(personId);
      console.log(personId);
    async function fetchDevices() {
      try {
        const personDevices = await getDevicesByPersonId(personId);
        if (Array.isArray(personDevices) && personDevices.length > 0) {
          const deviceDetailsPromises = personDevices.map(async (device) => {
            return await getDeviceById(device.deviceId);
          });
          const detailedDevices = await Promise.all(deviceDetailsPromises);
          setDevices(detailedDevices);
        } else {
          setError('No devices found for this person.');
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setError('Access forbidden. Please check your permissions.');
        } else {
          setError('Failed to fetch devices data.');
        }
      }
    }

    if (personId) {
      fetchDevices();
    }
  }, [personId]);


  const handleStartSimulation = (deviceId) => {
    let currentCounter = simulationCounter; 

    // Toggle between 1 and 2 only
    const nextCounter = currentCounter === 2 ? 1 : 2;

    startSimulation(deviceId, currentCounter)
      .then(() => {
        setSelectedDeviceId(deviceId);
        
        // Update the state and local storage correctly
        setSimulationCounter(nextCounter);
        localStorage.setItem('simulationCounter', nextCounter);
      })
      .catch((error) => {
        console.error('Error starting simulation:', error);
      });
};


  

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Devices List</h1>
      {devices.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Details</th>
              <th>Address</th>
              <th>Energy Consumption</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id}>
                <td>{device.name}</td>
                <td>{device.details}</td>
                <td>{device.address}</td>
                <td>{device.energyConsumption}</td>
                <td>
                  <button
                    onClick={() => handleStartSimulation(device.id)
                    }
                  >
                    Start simulation
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No devices found.</p>
      )}
      <WebSocket selectedDeviceId={selectedDeviceId} />
      <Chat senderId={personId} />
      </div>
  );
}

export default DeviceUser;
