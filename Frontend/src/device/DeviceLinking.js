import React, { useEffect, useState } from 'react';
import { useParams , useNavigate} from 'react-router-dom';
import { getDevice } from '../services/deviceService'; 
import { linkDeviceToPerson } from '../services/personService';
import '../styles/Table.css';

function DeviceLinking() {
    const { id: personId } = useParams(); 
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
                console.error('Error fetching devices:', error);
                setError('Failed to fetch devices data.');
            }
        }
        fetchDevices();
    }, []);

    const handleLinkDeviceToPerson = async (deviceId) => {
        try {
            await linkDeviceToPerson(personId, deviceId);
            alert('Device linked to person successfully!');
        } catch (error) {
            console.error('Error linking device to person:', error);
            setError('Failed to link device to person.');
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Devices List</h1>
            <div className='buttons'>
      <button className='backButton' onClick={() => navigate('/StartPage')} style={{ marginBottom: '20px' }}>
          BACK
        </button>

        <button className="backButton" onClick={() => navigate('/person')} style={{ marginBottom: '20px' }}>
          SEE ALL DEVICES
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
                                    <button onClick={() => handleLinkDeviceToPerson(device.id)}>
                                        Link Device to Person
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

export default DeviceLinking;
