import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeviceById, updateName, updateAddress, updateDetails, updateEnergyCons } from '../services/deviceService';

function DeviceDetails() {
    const { id } = useParams();
    const [device, setDevice] = useState(null);
    const [error, setError] = useState(null);
    const [newName, setNewName] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [newDetails, setNewDetails] = useState('');
    const [newEnergy, setNewEnergy] = useState('');
    const navigate = useNavigate();



    useEffect(() => {
        async function fetchDevice() {
            try {
                const deviceData = await getDeviceById(id);
                console.log('Fetched device details:', deviceData);
                setDevice(deviceData);
                setNewName(deviceData.name);
                setNewAddress(deviceData.address);
                setNewDetails(deviceData.details);
                setNewEnergy(deviceData.energyConsumption);
            } catch (error) {
                console.error('Error fetching device details:', error);
                setError('Failed to fetch device details.');
            }
        }
        fetchDevice();
    }, [id]);

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    const handleUpdateName = async () => {
        try {
            const updatedDevice = await updateName(id, { body: newName });
            setDevice(updatedDevice);
            console.log('Updated name:', updatedDevice);
        } catch (error) {
            console.error('Error updating name:', error);
            setError('Failed to update name.');
        }
    };

    const handleAddressChange = (e) => {
        setNewAddress(e.target.value);
    };

    const handleUpdateAddress = async () => {
        try {
            const updatedDevice = await updateAddress(id, { body: newAddress });
            setDevice(updatedDevice);
            console.log('Updated address:', updatedDevice);
        } catch (error) {
            console.error('Error updating address:', error);
            setError('Failed to update address.');
        }
    };

    const handleDetailsChange = (e) => {
        setNewDetails(e.target.value);
    };

    const handleUpdateDetails = async () => {
        try {
            const updatedDevice = await updateDetails(id, { body: newDetails });
            setDevice(updatedDevice);
            console.log('Updated details:', updatedDevice);
        } catch (error) {
            console.error('Error updating details:', error);
            setError('Failed to update details.');
        }
    };

    const handleEnergyChange = (e) => {
        setNewEnergy(e.target.value);
    };

    const handleUpdateEnergy = async () => {
        try {
            const updatedDevice = await updateEnergyCons(id, { body: newEnergy });
            setDevice(updatedDevice);
            console.log('Updated energy consumption:', updatedDevice);
        } catch (error) {
            console.error('Error updating energy consumption:', error);
            setError('Failed to update energy consumption.');
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!device) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Device Details</h1>

        <button className='backButton' onClick={() => navigate('/device')} style={{ marginBottom: '20px' }}>
            BACK        
        </button>

            <div class = "updated-elements">
                <p><strong>Current Name:</strong> {device.name}</p>
                <input
                    type="text"
                    value={newName}
                    onChange={handleNameChange}
                />
                <button onClick={handleUpdateName}>Update Name</button>
            </div>

            <div class = "updated-elements">
                <p><strong>Current Address:</strong> {device.address}</p>
                <input
                    type="text"
                    value={newAddress}
                    onChange={handleAddressChange}
                />
                <button onClick={handleUpdateAddress}>Update Address</button>
            </div>


            <div class = "updated-elements">
                <p><strong>Current Details:</strong> {device.details}</p>
                <input
                    type="text"
                    value={newDetails}
                    onChange={handleDetailsChange}
                />
                <button onClick={handleUpdateDetails}>Update Details</button>
            </div>

            <div class = "updated-elements">
                <p><strong>Current Energy Consumption:</strong> {device.energyConsumption}</p>
                <input
                    type="float"
                    value={newEnergy}
                    onChange={handleEnergyChange}
                />
                <button onClick={handleUpdateEnergy}>Update Details</button>
            </div>

        </div>
    );
}

export default DeviceDetails;
