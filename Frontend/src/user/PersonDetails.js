import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPersonById, updateName, updateUsername, updatePassword, updateEmail } from '../services/personService';
import '../styles/UpdatePage.css';


function PersonDetails() {
    const { id } = useParams(); //the id parameter from the url
    const [person, setPerson] = useState(null);
    const [error, setError] = useState(null);
    const [newName, setNewName] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        async function fetchPerson() {
            try {
                const personData = await getPersonById(id);
                setPerson(personData);
                setNewName(personData.name);
                setNewUsername(personData.username);
                setNewEmail(personData.email);
                setNewPassword(personData.password);
            } catch (error) {
                console.error('Error fetching person details:', error);
                setError('Failed to fetch person details.');
            }
        }

        fetchPerson();
    }, [id]);

    
    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    const handleUpdateName = async () => {
        try {
            const updatedPerson = await updateName(id, { body: newName });
            setPerson(updatedPerson);
            console.log('Updated name:', updatedPerson);
        } catch (error) {
            console.error('Error updating name:', error);
            setError('Failed to update name.');
        }
    };

    const handleUsernameChange = (e) => {
        setNewUsername(e.target.value);
    };

    const handleUpdateUsername = async () => {
        try {
            const updatedPerson = await updateUsername(id, { body: newUsername });
            setPerson(updatedPerson);
            console.log('Updated name:', updatedPerson);
        } catch (error) {
            console.error('Error updating name:', error);
            setError('Failed to update name.');
        }
    };

    const handleEmailChange = (e) => {
        setNewEmail(e.target.value);
    };

    const handleUpdateEmail = async () => {
        try {
            const updatedPerson = await updateEmail(id, { body: newEmail });
            setPerson(updatedPerson);
            console.log('Updated name:', updatedPerson);
        } catch (error) {
            console.error('Error updating name:', error);
            setError('Failed to update name.');
        }
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleUpdatePassword = async () => {
        try {
            const updatedPerson = await updatePassword(id, { body: newPassword });
            setPerson(updatedPerson);
            console.log('Updated name:', updatedPerson);
        } catch (error) {
            console.error('Error updating name:', error);
            setError('Failed to update name.');
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!person) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Person Details</h1>
            <button class="backButton" onClick={() => navigate('/person')} style={{ marginBottom: '20px' }}>
          BACK
        </button>
            <div class = "updated-elements">
                <p><strong>Current Name:</strong> {person.name}</p>
                <input
                    type="text"
                    value={newName}
                    onChange={handleNameChange}
                />
                <button onClick={handleUpdateName}>Update Name</button>
            </div>

            <div class = "updated-elements">
                <p><strong>Current Username:</strong> {person.username}</p>
                <input
                    type="text"
                    value={newUsername}
                    onChange={handleUsernameChange}
                />
                <button onClick={handleUpdateUsername}>Update Username</button>
            </div>


            <div class = "updated-elements">
                <p><strong>Current Email:</strong> {person.email}</p>
                <input
                    type="email"
                    value={newEmail}
                    onChange={handleEmailChange}
                />
                <button onClick={handleUpdateEmail}>Update Email</button>
            </div>

            <div class = "updated-elements">
                <p><strong>Current Password:</strong> {person.password}</p>
                <input
                    type="text"
                    value={newPassword}
                    onChange={handlePasswordChange}
                />
                <button onClick={handleUpdatePassword}>Update Password</button>
            </div>

        </div>
    );
}

export default PersonDetails;
